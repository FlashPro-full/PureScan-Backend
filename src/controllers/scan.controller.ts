import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { saveScan, findScanListByUserId, deleteScanById, findScanListPaginationByUserId } from "../services/scan.service";
import { findTriggersByCondition } from "../services/trigger.service";
import {
  getTriggerCategory,
  calculateEScore,
  selectTargetPrice,
  determineRoute,
} from "../services/trigger-logic.service";
import { spApiService } from "../third-party/spapi.service";
import { getProductCondition } from "../config";
import { ModuleEnum } from "../entities/trigger.entity";

function formatCategory(category: string): string {
  if (category.includes("book")) {
    return "Book";
  } else if (category.includes("dvd")) {
    return "DVD";
  } else if (category.includes("music")) {
    return "Music";
  } else if (category.includes("video_games")) {
    return "Video Games";
  }

  return "Others";
}

export const createScanHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user!.id);

    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({
        result: false,
        error: "Barcode is required",
      });
    }

    const spProduct = await spApiService.lookupProduct(barcode);

    if (spProduct?.numberOfResults === 0) {
      return res.status(404).json({
        result: false,
        error: "Product not found",
      });
    }

    const items = spProduct.items;

    const condition = getProductCondition();
    const itemCondition = condition === "new" ? "New" : "Used";

    const tempResultList: any[] = await Promise.all(items.map((item: any) => spApiService.getItemOffers(item.asin, itemCondition)));

    let item = null;
    let spOffers = null;

    if (tempResultList?.[0]?.payload.Summary.TotalOfferCount !== 0) {
      item = items[0];
      spOffers = tempResultList[0];
    } else {
      item = items[items.length - 1];
      spOffers = tempResultList[items.length - 1];
    }

    const asin = item.asin;
    const attributes = item.attributes || {};
    const dimensionsList = attributes.item_dimensions ?? item.dimensions;
    const imagesList = Array.isArray(item.images) ? item.images : [];
    const salesRanksList = Array.isArray(item.salesRanks)
      ? item.salesRanks
      : [];

    const title = attributes.item_name?.[0]?.value;
    const author = attributes.author?.[0]?.value;
    const publisher = attributes.manufacturer?.[0]?.value;
    const platform =
      attributes.platform?.[0]?.value ||
      attributes.computer_platform?.[0]?.value ||
      attributes.video_game_platform?.[0]?.value ||
      null;
    const itemType = attributes.item_type_keyword?.[0]?.value;
    const weight = attributes.item_weight?.[0] ?? (dimensionsList?.[0] as { package?: { weight?: unknown } } | undefined)?.package?.weight;
    const dimensions = {
      length: dimensionsList?.[0]?.length,
      width: dimensionsList?.[0]?.width,
      height: dimensionsList?.[0]?.height,
    };
    const displayGroupRank = salesRanksList?.[0]?.displayGroupRanks?.[0];
    const category = formatCategory(
      displayGroupRank?.websiteDisplayGroup ?? itemType
    );
    const salesRank = displayGroupRank?.rank || 0;
    const image = imagesList?.[0]?.images?.[0]?.link;
    const listPrice = {
      amount: attributes.list_price?.[0]?.value,
      currency: attributes.list_price?.[0]?.currency,
    };

    const triggerCategory = getTriggerCategory(category);

    const userTriggers = triggerCategory
      ? await findTriggersByCondition({
        user: { id: userId },
        category: triggerCategory,
        enabled: true,
      })
      : [];

    const fbaTrigger = userTriggers.find((t) => t.module === ModuleEnum.FBA);
    const mfTrigger = userTriggers.find((t) => t.module === ModuleEnum.MF);
    const fbaConfig = fbaTrigger?.config || [];
    const mfConfig = mfTrigger?.config || [];

    const summary = spOffers?.payload?.Summary;
    const lowestPricesList = summary?.LowestPrices || [];
    const buyBoxPricesList = summary?.BuyBoxPrices || [];
    const numberOfOffersList = summary?.NumberOfOffers || [];
    const offersList = spOffers?.payload?.Offers || [];

    const buyBoxNewItem = buyBoxPricesList.find((item: any) => item?.condition.toLowerCase() === "new")
    const buyBoxNew = buyBoxNewItem?.LandedPrice.Amount || 0;
    const buyBoxUsedItem = buyBoxPricesList.find((item: any) => item?.condition.toLowerCase() === "used")
    const buyBoxUsed = buyBoxUsedItem?.LandedPrice?.Amount || 0;
    const lowestNewItem = lowestPricesList.filter((item: any) =>
      item?.condition.toLowerCase() === "new"
    ).sort((a: any, b: any) => a.LandedPrice.Amount - b.LandedPrice.Amount)[0];
    const lowestNew = lowestNewItem?.LandedPrice?.Amount || 0;
    const lowestUsedItem = lowestPricesList.filter((item: any) =>
      item?.condition.toLowerCase() === "used"
    ).sort((a: any, b: any) => a.LandedPrice.Amount - b.LandedPrice.Amount)[0];
    const lowestUsed = lowestUsedItem?.LandedPrice?.Amount || 0;
    const lowestCollectibleItem = lowestPricesList.filter((item: any) =>
      item?.condition.toLowerCase() === "collectible"
    ).sort((a: any, b: any) => a.LandedPrice.Amount - b.LandedPrice.Amount)[0];
    const lowestCollectible = lowestCollectibleItem?.LandedPrice?.Amount || 0;
    const mfUsedItem = numberOfOffersList.find((item: any) =>
      item?.condition.toLowerCase() === "used" &&
      item?.fulfillmentChannel.toLowerCase() === "merchant"
    );
    const mfUsed = mfUsedItem?.OfferCount || 0;
    const mfNewItem = numberOfOffersList.find((item: any) =>
      item?.condition.toLowerCase() === "new" &&
      item?.fulfillmentChannel.toLowerCase() === "merchant"
    );
    const mfNew = mfNewItem?.OfferCount || 0;
    const collectibleItem = numberOfOffersList.find((item: any) =>
      item?.condition.toLowerCase() === "collectible" &&
      item?.fulfillmentChannel.toLowerCase() === "merchant"
    );
    const collectible = collectibleItem?.OfferCount || 0;
    const fbaUsedItem = numberOfOffersList.find((item: any) =>
      item?.condition.toLowerCase() === "used" &&
      item?.fulfillmentChannel.toLowerCase() === "amazon"
    );
    const fbaUsed = fbaUsedItem?.OfferCount || 0;
    const fbaNewItem = numberOfOffersList.find((item: any) =>
      item?.condition.toLowerCase() === "new" &&
      item?.fulfillmentChannel.toLowerCase() === "amazon"
    );
    const fbaNew = fbaNewItem?.OfferCount || 0;
    const count = {
      mfUsed,
      mfNew,
      fbaUsed,
      fbaNew,
      collectible
    };

    let fbaTargetPrice = 0;
    let mfTargetPrice = 0;
    let pricesList: number[] = [];
    let fbaPricesList: number[] = [];

    if (offersList.length === 0) {
      fbaTargetPrice = lowestCollectible;
      mfTargetPrice = lowestCollectible;
      pricesList = [lowestCollectible];
      fbaPricesList = [lowestCollectible];
    } else {
      const fbaOffersList = offersList.filter(
        (item: any) => item?.IsFulfilledByAmazon
      );
      pricesList = offersList.map(
        (item: any) =>
          Math.round(
            (Number(item?.Shipping?.Amount) +
              Number(item?.ListingPrice?.Amount)) *
            100
          ) / 100
      );
      fbaPricesList = fbaOffersList.map(
        (item: any) =>
          Math.round(
            (Number(item?.Shipping?.Amount) +
              Number(item?.ListingPrice?.Amount)) *
            100
          ) / 100
      );

      const tempList: any[] = [];
      pricesList.forEach((price: number) => {
        const index = tempList.findIndex((item: any) => item.price === price);
        if (index > -1) {
          tempList[index].count++;
        } else {
          tempList.push({
            count: 1,
            price: price,
          });
        }
      });

      const usedOffersRaw =
        condition === "used"
          ? offersList
          : offersList.filter((o: any) =>
            String(o?.Condition?.ConditionType ?? o?.condition ?? "").toLowerCase().includes("used")
          );
      const usedOffersData = usedOffersRaw
        .map((o: any) =>
          Math.round(
            (Number(o?.Shipping?.Amount ?? 0) + Number(o?.ListingPrice?.Amount ?? 0)) * 100
          ) / 100
        )
        .sort((a: number, b: number) => a - b);
      const usedOffers =
        usedOffersData.length >= 1
          ? {
            lowest: usedOffersData[0],
            secondLowest: usedOffersData[1],
            thirdLowest: usedOffersData[2],
            avgOf3:
              usedOffersData.length >= 3
                ? Math.round(
                  ((usedOffersData[0] + usedOffersData[1] + usedOffersData[2]) / 3) * 100
                ) / 100
                : undefined,
          }
          : undefined;

      const sortedFba = [...fbaPricesList].sort((a, b) => a - b);
      const sortedAll = [...pricesList].sort((a, b) => a - b);
      const initialPrice = sortedFba.length > 0 ? sortedFba[0] : (sortedAll[0] ?? 0);

      fbaTargetPrice = selectTargetPrice(
        fbaConfig,
        mfConfig,
        salesRank,
        initialPrice,
        buyBoxNew,
        lowestNew,
        buyBoxUsed,
        usedOffers,
        "FBA",
        fbaTrigger?.missingOptions ?? undefined,
        fbaTrigger?.disabledMissing ?? true
      );
      mfTargetPrice = 0;
      const sortedTempList = [...tempList].sort(
        (a, b) => b.count - a.count || a.price - b.price
      );
      if (sortedTempList.length >= 1) {
        mfTargetPrice = sortedTempList[0].price;
      }
    }

    let fbaProfit = 0, mfProfit = 0;
    const mfShippingCost = 3.89;

    const eScore = calculateEScore(fbaConfig, mfConfig, salesRank);

    const { fba: fbaFeeRes, mf: mfFeeRes } = await spApiService.getMyFeesEstimates(
      asin,
      barcode,
      fbaTargetPrice,
      mfTargetPrice,
      mfShippingCost
    );

    const fbaTotalFees = fbaFeeRes?.FeesEstimate?.TotalFeesEstimate?.Amount || 0;
    fbaProfit = Math.round((fbaTargetPrice - fbaTotalFees) * 100) / 100;
    const mfTotalFees = mfFeeRes?.FeesEstimate?.TotalFeesEstimate?.Amount || 0;
    mfProfit = Math.round((mfTargetPrice - mfTotalFees - mfShippingCost) * 100) / 100;

    const { fbaAccept, mfAccept } = determineRoute(
      fbaConfig,
      mfConfig,
      salesRank,
      eScore,
      fbaProfit,
      mfProfit
    );

    let route = "REJECTED";

    if (fbaAccept) {
      if (condition === "new") {
        route = "AMAZON NEW - FBA";
      } else {
        route = "AMAZON - FBA";
      }
    } else if (mfAccept) {
      if (condition === "new") {
        route = "AMAZON NEW - MF";
      } else {
        route = "AMAZON - MF";
      }
    }

    const scanResult = {
      product: {
        asin,
        title,
        author,
        publisher,
        platform,
        itemType,
        category,
        weight,
        dimensions,
        image,
        listPrice
      },
      pricing: {
        salesRank,
        eScore,
        buyBox: { new: buyBoxNew, used: buyBoxUsed },
        lowestNew: lowestNew
      },
      offers: {
        count,
        all: pricesList,
        fba: fbaPricesList
      },
      fba: {
        targetPrice: fbaTargetPrice,
        profit: fbaProfit,
        accept: fbaAccept
      },
      mf: {
        targetPrice: mfTargetPrice,
        profit: mfProfit,
        accept: mfAccept
      }
    };

    await saveScan({
      user: { id: userId },
      asin: asin,
      title: title,
      image: image,
      category: category,
      salesRank: salesRank,
      eScore: eScore,
      lowestNew: lowestNew,
      lowestUsed: lowestUsed,
      newBB: buyBoxNew,
      usedBB: buyBoxUsed,
      fbaAccept: fbaAccept,
      mfAccept: mfAccept,
      fbaTargetPrice: fbaTargetPrice,
      mfTargetPrice: mfTargetPrice,
      fbaProfit: fbaProfit,
      mfProfit: mfProfit,
      route: route,
      profit: fbaAccept ? fbaProfit : mfAccept ? mfProfit : 0,
    } as Partial<any>);
    return res.status(200).json({
      result: true,
      scanResult,
    });

  } catch (error: any) {
    console.error("Scan error:", error);
    res.status(500).json({
      result: false,
      error: "Scan failed",
    });
  }
};

export const getScanListHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const scans = await findScanListByUserId(Number(userId));

    res.status(200).json({
      result: true,
      scanList: scans,
    });
  } catch (error: any) {
    console.error("Get scans error:", error);
    res.status(500).json({
      result: true,
      error: "Failed to get scans",
    });
  }
};

export const getScanListPaginationHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

    const { scanList, total, totalPages } = await findScanListPaginationByUserId(
      Number(userId),
      page,
      limit
    );

    res.status(200).json({
      result: true,
      scanList,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error: any) {
    console.error("Get scans pagination error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get scans pagination"
    });
  }
};

export const deleteScanHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteScanById(Number(id));
    res.status(200).json({
      result: true,
      message: "Scan deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete scan error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to delete scan"
    });
  }
}