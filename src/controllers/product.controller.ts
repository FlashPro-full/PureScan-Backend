import { Request, Response } from "express";
import {
  findProductByCondition,
  savePricing,
  saveProduct,
} from "../services/product.service";
import { spApiService } from "../third-party/spapi.service";
import { FeeCalculatorService } from "../third-party/fee.service";

const feeCalculatorService = new FeeCalculatorService();

const getItemTypeFromCategory = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes("book")) return "books";
  if (cat.includes("video") || cat.includes("game")) return "video_games";
  if (cat.includes("music")) return "music";
  if (cat.includes("movie") || cat.includes("dvd")) return "videos";
  return "other";
};

export const lookupProduct = async (req: Request, res: Response) => {
  try {
    const { barcode, asin } = req.body;

    if (!barcode && !asin) {
      return res.status(400).json({
        result: false,
        error: "Barcode or ASIN is required",
      });
    }

    let product = await findProductByCondition({ barcode, asin });

    if (!product) {
      try {
        const spApiData = await spApiService.lookupProduct(barcode || "");

        if (!spApiData || !spApiData.items || spApiData.items.length === 0) {
          return res.status(404).json({
            result: false,
            error: "Product not found",
          });
        }

        const item = spApiData.items[0];
        const attributes = item.attributes || {};
        const dimensions = item.dimensions || {};
        const identifiers = item.identifiers || {};
        const images = item.images || [];
        const salesRanks = item.salesRanks || [];

        const newProduct = {
          barcode: barcode || "",
          asin: identifiers.asin?.[0]?.identifier || asin,
          title: attributes.title?.[0]?.value || "Unknown",
          author: attributes.contributor?.[0]?.value || null,
          publisher: attributes.publisher?.[0]?.value || null,
          category: attributes.product_type_name?.[0]?.value || null,
          itemType: getItemTypeFromCategory(
            attributes.product_type_name?.[0]?.value || ""
          ),
          images: images
            .map((img: any) => img.images?.[0]?.url || "")
            .filter(Boolean),
          dimensionsLength: dimensions.length?.value || null,
          dimensionsWidth: dimensions.width?.value || null,
          dimensionsHeight: dimensions.height?.value || null,
          weightOz: dimensions.weight?.value || null,
          salesRank:
            salesRanks[0]?.displayGroupRanks?.[0]?.rank?.toString() || null,
        };

        product = await saveProduct(newProduct);
      } catch (spError: any) {
        console.error("SP-API lookup error:", spError.message);
        return res.status(500).json({
          result: false,
          error: spError.message,
        });
      }
    }

    const sortedPricing =
      product.pricings?.sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      ) || [];

    let pricing = sortedPricing[0] || null;

    if (!pricing || new Date(pricing.expiresAt) < new Date()) {
      try {
        const spPricing = await spApiService.getPricing(product.asin || "");

        if (spPricing && spPricing.payload) {
          const summary = spPricing.payload[0]?.Summary || {};
          const lowestPrices = spPricing.payload[0]?.LowestPrices || [];

          const buyBoxPrice =
            summary.LowestPrices?.[0]?.LandedPrice?.Amount || null;
          const lowestMfPrice =
            lowestPrices.find((p: any) => p.condition === "New")?.LandedPrice
              ?.Amount || null;

          const dimensions = {
            length: product.dimensionsLength || 8,
            width: product.dimensionsWidth || 5,
            height: product.dimensionsHeight || 1,
          };

          const fbaFees = buyBoxPrice
            ? feeCalculatorService.calculateFBAFees(
                buyBoxPrice,
                dimensions,
                product.weightOz || 8
              )
            : null;

          const mfFees = lowestMfPrice
            ? feeCalculatorService.calculateMFFees(lowestMfPrice)
            : null;

          const newPricing: any = {
            product: { id: Number(product.id) },
            source: "amazon_sp_api",
            buyBoxPrice: buyBoxPrice ? parseFloat(buyBoxPrice) : null,
            lowestMfPrice: lowestMfPrice ? parseFloat(lowestMfPrice) : null,
            fbaFees: fbaFees?.total || null,
            fulfillmentFee: fbaFees?.fulfillmentFee || null,
            storageFee: fbaFees?.storageFee || null,
            referralFeeRate: 0.15,
            closingFee: 1.8,
            effectiveDate: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };

          pricing = await savePricing(newPricing);
        }
      } catch (pricingError: any) {
        console.error("Pricing fetch error:", pricingError.message);
      }
    }

    const buyBoxPrice = pricing?.buyBoxPrice || 0;
    const lowestMfPrice = pricing?.lowestMfPrice || 0;

    const dimensions = {
      length: product.dimensionsLength || 8,
      width: product.dimensionsWidth || 5,
      height: product.dimensionsHeight || 1,
    };

    const fbaFees = buyBoxPrice
      ? feeCalculatorService.calculateFBAFees(
          buyBoxPrice,
          dimensions,
          product.weightOz || 8
        )
      : null;

    const mfFees = lowestMfPrice
      ? feeCalculatorService.calculateMFFees(lowestMfPrice)
      : null;

    const fbaProfit = fbaFees
      ? feeCalculatorService.calculateFBAProfit(buyBoxPrice, fbaFees)
      : null;
    const mfProfit = mfFees
      ? feeCalculatorService.calculateMFProfit(lowestMfPrice, mfFees)
      : null;

    let decision = "discard";
    let channel = "";
    let profit = 0;

    if (fbaProfit !== null && fbaProfit > 0) {
      decision = "keep";
      channel = "FBA";
      profit = fbaProfit;
    } else if (mfProfit !== null && mfProfit > 0) {
      decision = "keep";
      channel = "MF";
      profit = mfProfit;
    }

    const suggestedPrice = buyBoxPrice || lowestMfPrice || 0;
    const margin =
      suggestedPrice > 0 ? ((profit / suggestedPrice) * 100).toFixed(1) : "0";

    res.status(200).json({
      result: true,
      product: {
        id: product.id,
        barcode: product.barcode,
        asin: product.asin,
        title: product.title,
        author: product.author,
        publisher: product.publisher,
        category: product.category,
        itemType: product.itemType || "other",
        images: product.images || [],
        dimensions: {
          length: product.dimensionsLength,
          width: product.dimensionsWidth,
          height: product.dimensionsHeight,
          weightOz: product.weightOz,
        },
        salesRank: product.salesRank,
      },
      pricing: {
        buyBoxPrice,
        lowestMfPrice,
        fbaFees: fbaFees
          ? {
              fulfillmentFee: fbaFees.fulfillmentFee,
              storageFee: fbaFees.storageFee,
              referralFee: fbaFees.referralFee,
              closingFee: fbaFees.closingFee,
              totalFees: fbaFees.total,
            }
          : null,
        mfFees: mfFees
          ? {
              referralFee: mfFees.referralFee,
              closingFee: mfFees.closingFee,
              totalFees: mfFees.total,
            }
          : null,
        lastUpdated: pricing?.effectiveDate || new Date(),
      },
      recommendation: {
        decision,
        channel,
        profit,
        margin: `${margin}%`,
        calculations: {
          fba:
            fbaFees && fbaProfit !== null
              ? {
                  profit: fbaProfit,
                  formula: `${buyBoxPrice} - (${fbaFees.fulfillmentFee} + ${fbaFees.storageFee} + ${fbaFees.referralFee} + ${fbaFees.closingFee}) - 1.20`,
                }
              : null,
          mf:
            mfFees && mfProfit !== null
              ? {
                  profit: mfProfit,
                  formula: `${lowestMfPrice} - (${mfFees.referralFee} + ${mfFees.closingFee}) - 3.75`,
                }
              : null,
        },
      },
    });
  } catch (error: any) {
    console.error("Product lookup error:", error);
    res.status(500).json({
      result: false,
      error: "Product lookup failed",
    });
  }
};
