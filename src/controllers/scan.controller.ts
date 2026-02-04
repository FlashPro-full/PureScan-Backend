import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { saveScan, findScanListByUserId } from "../services/scan.service";
import { SPApiService } from "../third-party/spapi.service";
import { findAdminByUserId } from "../services/user.service";
import { findAmazonByUserId } from "../services/amazon.service";
import { findProductByCondition, saveProduct } from "../services/product.service";
import { Recommendation } from "../entities/scan.entity";

export const createScan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user!.id);

    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({
        result: false,
        error: "Barcode is required",
      });
    }

    let adminId = -1;

    if (req.user?.role === 'user') {
      const user = await findAdminByUserId(userId);
      adminId = user?.admin?.id || -1;
    } else {
      adminId = userId;
    }

    const amazon = await findAmazonByUserId(adminId);

    if (!amazon) {
      return res.status(404).json({
        result: false,
        error: "Amazon credentials not found",
      });
    }

    let product = await findProductByCondition({ barcode });
    let scannedPrice = 0.1;
    let recommendation = Recommendation.DISCARD;

    if (!product) {
      try {
        const spApiService = new SPApiService(amazon.clientId, amazon.clientSecret, amazon.refreshToken);
        const spProduct = await spApiService.lookupProduct(barcode)

        if (spProduct?.numberOfResults === 0) {
          return res.status(404).json({
            result: false,
            error: "Product not found",
          });
        }

        const item = spProduct.items[0];
        const attributes = item.attributes || {};
        const dimensionsList = Array.isArray(attributes.item_dimensions) ? attributes.item_dimensions : [];
        const imagesList = Array.isArray(item.images) ? item.images : [];
        const productTypesList = Array.isArray(item.productTypes) ? item.productTypes : [];
        const salesRanksList = Array.isArray(item.salesRanks) ? item.salesRanks : [];

        const asin = item.asin;
        const title = attributes.item_name?.[0]?.value;
        const author = attributes.author?.[0]?.value;
        const publisher = attributes.manufacturer?.[0]?.value;
        const category = productTypesList?.[0]?.productType;
        const platform = attributes.platform?.[0]?.value || attributes.computer_platform?.[0]?.value || attributes.video_game_platform?.[0]?.value || null;
        const itemType = attributes.item_type_keyword?.[0]?.value;
        const weight = {
          unit: attributes.item_weight?.[0]?.unit,
          value: attributes.item_weight?.[0]?.value,
        }
        const dimensions = {
          length: dimensionsList?.[0].length,
          width: dimensionsList?.[0].width,
          height: dimensionsList?.[0].height,
        };
        const displayGroupRank = salesRanksList?.[0]?.displayGroupRanks?.[0];
        const salesRank = `#${displayGroupRank?.rank} in ${displayGroupRank?.title}`;
        const image = imagesList?.[0]?.images?.[0]?.link;
        const listPrice = {
          amount: attributes.list_price?.[0]?.value,
          currency: attributes.list_price?.[0]?.currency,
        }

        const newProduct = {
          barcode: barcode,
          asin: asin,
          title: title,
          author: author,
          publisher: publisher,
          category: category,
          itemType: itemType,
          platform: platform,
          dimensions: dimensions,
          weight: weight,
          salesRank: salesRank,
          image: image,
          listPrice: listPrice,
        };

        product = await saveProduct(newProduct);
        scannedPrice += 0.1;
        recommendation = Recommendation.KEEP;
      } catch (spError: any) {
        console.error("SP-API lookup error:", spError.message);
        return res.status(500).json({
          result: false,
          error: spError.message,
        });
      }
    }

    const newScan: any = {
      user: { id: userId },
      product: { id: product.id },
      recommendation: Recommendation.KEEP,
      scannedPrice: scannedPrice
    }

    const scan = await saveScan(newScan);

    res.status(200).json({
      result: true,
      scan: {
        ...scan,
        product: product
      }
    });
  } catch (error: any) {
    console.error("Scan error:", error);
    res.status(500).json({
      result: false,
      error: "Scan failed",
    });
  }
};

export const getScanList = async (req: AuthRequest, res: Response) => {
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

export const getExternalScan = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user!.id);

  const { barcode } = req.body;

  if (!barcode) {
    return res.status(400).json({
      result: false,
      error: "Barcode is required",
    });
  }

  let adminId = -1;

  if (req.user?.role === 'user') {
    const user = await findAdminByUserId(userId);
    adminId = user?.admin?.id || -1;
  } else {
    adminId = userId;
  }

  const amazon = await findAmazonByUserId(adminId);

  if (!amazon) {
    return res.status(404).json({
      result: false,
      error: "Amazon credentials not found",
    });
  }

  let product = await findProductByCondition({ barcode });
  let scannedPrice = 0.1;
  let recommendation = Recommendation.DISCARD;

  if (!product) {
    try {
      const spApiService = new SPApiService(amazon.clientId, amazon.clientSecret, amazon.refreshToken);
      const spProduct = await spApiService.lookupProduct(barcode)

      if (spProduct?.numberOfResults === 0) {
        return res.status(404).json({
          result: false,
          error: "Product not found",
        });
      }

      const item = spProduct.items[0];
      const attributes = item.attributes || {};
      const dimensionsList = Array.isArray(attributes.item_dimensions) ? attributes.item_dimensions : [];
      const imagesList = Array.isArray(item.images) ? item.images : [];
      const productTypesList = Array.isArray(item.productTypes) ? item.productTypes : [];
      const salesRanksList = Array.isArray(item.salesRanks) ? item.salesRanks : [];

      const asin = item.asin;
      const title = attributes.item_name?.[0]?.value;
      const author = attributes.author?.[0]?.value;
      const publisher = attributes.manufacturer?.[0]?.value;
      const category = productTypesList?.[0]?.productType;
      const platform = attributes.platform?.[0]?.value || attributes.computer_platform?.[0]?.value || attributes.video_game_platform?.[0]?.value || null;
      const itemType = attributes.item_type_keyword?.[0]?.value;
      const weight = {
        unit: attributes.item_weight?.[0]?.unit,
        value: attributes.item_weight?.[0]?.value,
      }
      const dimensions = {
        length: dimensionsList?.[0].length,
        width: dimensionsList?.[0].width,
        height: dimensionsList?.[0].height,
      };
      const displayGroupRank = salesRanksList?.[0]?.displayGroupRanks?.[0];
      const salesRank = `#${displayGroupRank?.rank} in ${displayGroupRank?.title}`;
      const image = imagesList?.[0]?.images?.[0]?.link;
      const listPrice = {
        amount: attributes.list_price?.[0]?.value,
        currency: attributes.list_price?.[0]?.currency,
      }

      const newProduct = {
        barcode: barcode,
        asin: asin,
        title: title,
        author: author,
        publisher: publisher,
        category: category,
        itemType: itemType,
        platform: platform,
        dimensions: dimensions,
        weight: weight,
        salesRank: salesRank,
        image: image,
        listPrice: listPrice,
      };

      product = await saveProduct(newProduct);
      scannedPrice += 0.1;
      recommendation = Recommendation.KEEP;
    } catch (spError: any) {
      console.error("SP-API lookup error:", spError.message);
      return res.status(500).json({
        result: false,
        error: spError.message,
      });
    }
  }
}
