import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { saveScan, findScanListByUserId, deleteScanById, findScanListPaginationByUserId } from "../services/scan.service";
import { findTriggersByCondition } from "../services/trigger.service";
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

function getTriggerCategory(displayCategory: string): string | null {
  const s = (displayCategory || "").toLowerCase();
  if (s.includes("book")) return "Books";
  if (s.includes("music") || s === "cd") return "Music";
  if (s.includes("video game") || s.includes("videogame")) return "VideoGames";
  if (s.includes("video") || s.includes("dvd") || s.includes("blu")) return "Videos";
  return null;
}

function findTriggerByRank(config: any[], salesRank: number): any | null {
  if (!config?.length) return null;
  for (const t of config) {
    if (salesRank >= (t.minSalesrank ?? 0) && salesRank <= (t.maxSalesrank ?? Infinity))
      return t;
  }
  return null;
}

function calculateEScore(fbaConfig: any[], mfConfig: any[], salesRank: number): number {
  const fbat = findTriggerByRank(fbaConfig, salesRank);
  if (!fbat) return 0;
  const fbaMinE = fbat.minEScore ?? 0;
  const fbaMaxE = fbat.maxEScore ?? 0;
  const fbaDelta = fbaMaxE - fbaMinE;
  const fbaRange = (fbat.maxSalesrank ?? 0) - (fbat.minSalesrank ?? 0);
  if (fbaRange === 0) return fbaMinE;
  const fbaRatio = (salesRank - (fbat.minSalesrank ?? 0)) / fbaRange;
  const fbaEScore = Math.round(fbaMinE + fbaDelta * fbaRatio);
  const mft = findTriggerByRank(mfConfig, salesRank);
  if (!mft) return 0;
  const mfMinE = mft.minEScore ?? 0;
  const mfMaxE = mft.maxEScore ?? 0;
  const mfDelta = mfMaxE - mfMinE;
  const mfRange = (mft.maxSalesrank ?? 0) - (mft.minSalesrank ?? 0);
  if (mfRange === 0) return mfMinE;
  const mfRatio = (salesRank - (mft.minSalesrank ?? 0)) / mfRange;
  const mfEScore = Math.round(mfMinE + mfDelta * mfRatio);
  return Math.min(fbaEScore, mfEScore);
}

export type offersRef = {
  avgOf3?: number;
  lowest?: number;
  secondLowest?: number;
  thirdLowest?: number;
};

export type targetPriceInput = {
  settings: {
    fbaSlot?: number;
    slot?: number;
    bbCompare?: boolean;
    amazonOffPercentage?: number;
    ceiling1?: boolean;
    ceiling1Options?: { option: string; discount: number };
    primeLess?: boolean;
    primeLessOptions?: { option: string; bumpUpDollars: number; bumpUpPercentage: number };
    ceiling2?: boolean;
    ceiling2Options?: { option: string; bumpUpDollars: number; bumpUpPercentage: number };
  };
  fbaPrices?: number[];
  prices: number[];
  offers?: offersRef | undefined;
  buyBoxPrice?: number;
  lowestNewPrice: number;
  buyBoxNew: number;
  amazonPrice?: number;
  route: "FBA" | "MF";
  offersCount?: number;
  fbaOffersCount?: number;
};

export type CapEntry = { name: string; value: number; applied: boolean; reason: string };

function refCap(
  offers: offersRef,
  option: string,
  bumpDollar: number,
  bumpPct: number,
  mode: "min" | "max" = "min"
): number {
  let ref: number | null | undefined = null;
  if (option === "Average of 3 Used Offers" || option.includes("Average")) {
    ref = offers.avgOf3;
  } else if (option === "2nd Lowest Used Offer" || option.includes("2nd")) {
    ref = offers.secondLowest;
  } else if (option === "3rd Lowest Used Offer" || option.includes("3rd")) {
    ref = offers.thirdLowest;
  } else {
    ref = offers.lowest;
  }
  if (ref === null || ref === undefined || ref <= 0) return Infinity;
  const bumpedByDollar = Math.round((ref + bumpDollar) * 100) / 100;
  const bumpedByPct = Math.round(ref * (1 + bumpPct / 100) * 100) / 100;
  const bumpLimit = mode === "max" ? Math.max(bumpedByDollar, bumpedByPct) : Math.min(bumpedByDollar, bumpedByPct);
  return Math.round(bumpLimit * 100) / 100;
}

export function determineTargetPrice(input: targetPriceInput): number {
  const { settings, fbaPrices, prices, offers, buyBoxPrice, amazonPrice, lowestNewPrice, buyBoxNew, route, fbaOffersCount, offersCount } = input;

  const fbaLen = fbaPrices?.length ?? 0;
  const pricesLen = prices.length ?? 0;

  let initialPrice = 0;
  if (route === "FBA") {
    if (fbaOffersCount !== undefined && fbaOffersCount !== null) {
      if (settings.fbaSlot !== undefined && settings.fbaSlot !== null && settings.fbaSlot > 0 && fbaOffersCount >= settings.fbaSlot) {
        const fbaSlot = settings.fbaSlot > fbaLen ? fbaLen - 1 : settings.fbaSlot - 1;
        initialPrice = fbaPrices?.[fbaSlot] ?? 0;
      }
    }

    if (initialPrice === 0 && offersCount !== undefined && offersCount !== null) {
      if (settings.slot !== undefined && settings.slot !== null && settings.slot > 0 && offersCount >= settings.slot) {
        const slot = settings.slot > pricesLen ? pricesLen - 1 : settings.slot - 1;
        initialPrice = prices?.[slot] ?? 0;
      }
    }

    let priceAfterBBCompare = initialPrice;
    if (settings.bbCompare && buyBoxPrice !== undefined && buyBoxPrice !== null && buyBoxPrice > 0 && buyBoxPrice < initialPrice) {
      priceAfterBBCompare = buyBoxPrice;
    }

    let amazonCap: number = Infinity;
    if (amazonPrice !== undefined && amazonPrice !== null && amazonPrice > 0 && settings.amazonOffPercentage !== undefined && settings.amazonOffPercentage !== null) {
      amazonCap = Math.round(amazonPrice * (1 - (settings.amazonOffPercentage ?? 0) / 100) * 100) / 100;
    }

    let ceiling1Cap: number = Infinity;
    if (settings.ceiling1 && settings.ceiling1Options) {
      if (settings.ceiling1Options.option === "Lowest New Price" && lowestNewPrice !== undefined && lowestNewPrice !== null && lowestNewPrice > 0) {
        ceiling1Cap = Math.round(lowestNewPrice * (1 - (settings.ceiling1Options.discount ?? 0) / 100) * 100) / 100;
      } else if (settings.ceiling1Options.option === "New Buy Box" && buyBoxNew !== undefined && buyBoxNew !== null && buyBoxNew > 0) {
        ceiling1Cap = Math.round(buyBoxNew * (1 - (settings.ceiling1Options.discount ?? 0) / 100) * 100) / 100;
      }
    }

    let primeLessCap: number = Infinity;
    if (settings.primeLess && settings.primeLessOptions) {
      primeLessCap = refCap(
        offers ?? {},
        settings.primeLessOptions.option,
        settings.primeLessOptions.bumpUpDollars ?? 0,
        settings.primeLessOptions.bumpUpPercentage ?? 0,
        "min") ?? Infinity;
    }

    let ceiling2Cap: number = Infinity;
    if (settings.ceiling2 && settings.ceiling2Options) {
      ceiling2Cap = refCap(offers ?? {},
        settings.ceiling2Options.option,
        settings.ceiling2Options.bumpUpDollars ?? 0,
        settings.ceiling2Options.bumpUpPercentage ?? 0,
        "min") ?? Infinity;
    }

    const current = Math.min(priceAfterBBCompare, amazonCap, ceiling1Cap, primeLessCap, ceiling2Cap);
    const targetPrice = Math.max(0, Math.round(current * 100) / 100);
    return targetPrice;
  } else {
    if (offersCount !== undefined && offersCount !== null) {
      if (settings.slot !== undefined && settings.slot !== null && settings.slot > 0 && offersCount >= settings.slot) {
        const slot = settings.slot > pricesLen ? pricesLen - 1 : settings.slot - 1;
        initialPrice = prices?.[slot] ?? 0;
      }
    }

    let amazonCap: number = Infinity;
    if (amazonPrice !== undefined && amazonPrice !== null && amazonPrice > 0 && (settings.amazonOffPercentage !== undefined || settings.amazonOffPercentage !== null)) {
      amazonCap = Math.round(amazonPrice * (1 - (settings.amazonOffPercentage ?? 0) / 100) * 100) / 100;
    }

    let ceiling1Cap: number = Infinity;
    if (settings.ceiling1 && settings.ceiling1Options) {
      if (settings.ceiling1Options.option === "Lowest New Price" && lowestNewPrice !== undefined && lowestNewPrice !== null && lowestNewPrice > 0) {
        ceiling1Cap = Math.round(lowestNewPrice * (1 - (settings.ceiling1Options.discount ?? 0) / 100) * 100) / 100;
      } else if (settings.ceiling1Options.option === "New Buy Box" && buyBoxNew !== undefined && buyBoxNew !== null && buyBoxNew > 0) {
        ceiling1Cap = Math.round(buyBoxNew * (1 - (settings.ceiling1Options.discount ?? 0) / 100) * 100) / 100;
      }
    }

    const current = Math.min(initialPrice, amazonCap, ceiling1Cap);
    const targetPrice = Math.max(0, Math.round(current * 100) / 100);
    return targetPrice;
  }

}

function selectFBATargetPrice(
  fbaConfig: any[],
  salesRank: number,
  fbaPrices: number[],
  prices: number[],
  offers: offersRef | undefined,
  buyBoxPrice: number,
  lowestNewPrice: number,
  buyBoxNew: number,
  amazonPrice?: number,
  fbaOffersCount?: number,
  offersCount?: number
): number {
  const t = findTriggerByRank(fbaConfig, salesRank);
  if (!t) return 0;
  return determineTargetPrice({
    settings: {
      fbaSlot: t.fbaSlot,
      slot: t.usedSlot,
      bbCompare: t.bbCompare,
      amazonOffPercentage: t.amazonOffPercentage,
      ceiling1: t.ceiling1,
      ceiling1Options: t.ceiling1Options,
      primeLess: t.primeLess,
      primeLessOptions: t.primeLessOptions,
      ceiling2: t.ceiling2,
      ceiling2Options: t.ceiling2Options,
    },
    fbaPrices,
    prices,
    offers,
    buyBoxPrice,
    lowestNewPrice,
    buyBoxNew,
    amazonPrice,
    route: "FBA",
    fbaOffersCount,
    offersCount
  });
}

function selectMFTargetPrice(
  mfConfig: any[],
  salesRank: number,
  prices: number[],
  buyBoxPrice: number,
  lowestNewPrice: number,
  buyBoxNew: number,
  amazonPrice?: number,
  offersCount?: number,
): number {
  const t = findTriggerByRank(mfConfig, salesRank);
  if (!t) return 0;
  return determineTargetPrice({
    settings: {
      slot: t.usedSlot,
      amazonOffPercentage: t.amazonOffPercentage,
      ceiling1: t.ceiling1,
      ceiling1Options: t.ceiling1Options,
    },
    prices,
    buyBoxPrice,
    lowestNewPrice,
    buyBoxNew,
    amazonPrice,
    route: "MF",
    offersCount
  });
}

function determineRoute(
  fbaConfig: any[],
  mfConfig: any[],
  salesRank: number,
  fbaProfit: number,
  mfProfit: number
): { fbaAccept: boolean; mfAccept: boolean } {
  const fbaTrigger = findTriggerByRank(fbaConfig, salesRank);
  const mfTrigger = findTriggerByRank(mfConfig, salesRank);

  const fbaAccept =
    !!fbaTrigger &&
    !fbaTrigger.alwaysReject &&
    fbaProfit >= (fbaTrigger.targetProfit ?? 0);
  const mfAccept =
    !!mfTrigger &&
    !mfTrigger.alwaysReject &&
    mfProfit >= (mfTrigger.targetProfit ?? 0);

  return { fbaAccept, mfAccept };
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

    const tempResultList: any[] = await Promise.all(items.map((item: any) =>
      spApiService.getItemOffers(item.asin, itemCondition))
    );

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
    const dimensionsList = item.dimensions;
    const imagesList = Array.isArray(item.images) ? item.images : [];
    const salesRanksList = Array.isArray(item.salesRanks) ? item.salesRanks : [];

    const title = attributes.item_name?.[0]?.value;
    const author = attributes.author?.[0]?.value;
    const publisher = attributes.manufacturer?.[0]?.value;
    const platform =
      attributes.platform?.[0]?.value ||
      attributes.computer_platform?.[0]?.value ||
      attributes.video_game_platform?.[0]?.value ||
      null;
    const itemType = attributes.item_type_keyword?.[0]?.value;

    const itemData = dimensionsList?.[0]?.item || 0;
    const itemWeight = Math.round(itemData?.weight?.value * 100) / 100;
    const packageData = dimensionsList?.[0]?.package || 0;
    const packageWeight = Math.round(packageData?.weight?.value * 100) / 100;

    const weight = {
      item: {
        unit: itemData?.weight?.unit,
        value: itemWeight
      },
      package: {
        unit: packageData?.weight?.unit,
        value: packageWeight
      }
    };

    const displayGroupRank = salesRanksList?.[0]?.displayGroupRanks?.[0];
    const category = formatCategory(displayGroupRank?.websiteDisplayGroup ?? itemType);
    const salesRank = displayGroupRank?.rank || 0;
    const image = imagesList?.[0]?.images?.[0]?.link;
    const listPrice = {
      amount: attributes.list_price?.[0]?.value,
      currency: attributes.list_price?.[0]?.currency,
    };

    const triggerCategory = getTriggerCategory(category);

    const userTriggers = await findTriggersByCondition({
      user: { id: userId },
      category: triggerCategory as string,
      enabled: true,
    });

    const fbaTrigger = userTriggers.find((t) => t.module === ModuleEnum.FBA);
    const mfTrigger = userTriggers.find((t) => t.module === ModuleEnum.MF);
    const fbaConfig = fbaTrigger?.config || [];
    const mfConfig = mfTrigger?.config || [];

    const eScore = calculateEScore(fbaConfig, mfConfig, salesRank);

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

    const lowestFBANewItem = lowestPricesList.find((item: any) => {
      return item?.condition.toLowerCase() === "new" && item?.fulfillmentChannel.toLowerCase() === "amazon";
    })
    const lowestFBANew = lowestFBANewItem?.LandedPrice?.Amount || 0;

    const lowestUsedItem = lowestPricesList.filter((item: any) =>
      item?.condition.toLowerCase() === "used"
    ).sort((a: any, b: any) => a.LandedPrice.Amount - b.LandedPrice.Amount)[0];

    const lowestUsed = lowestUsedItem?.LandedPrice?.Amount || 0;

    const lowestFBAUsedItem = lowestPricesList.find((item: any) => {
      return item?.condition.toLowerCase() === "used" && item?.fulfillmentChannel.toLowerCase() === "amazon";
    })
    const lowestFBAUsed = lowestFBAUsedItem?.LandedPrice?.Amount || 0;

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
      pricesList = offersList.map((item: any) =>
        Math.round((Number(item?.Shipping?.Amount) + Number(item?.ListingPrice?.Amount)) * 100) / 100
      );

      pricesList.sort((a: number, b: number) => a - b);

      const fbaOffersList = offersList.filter((item: any) =>
        item?.IsFulfilledByAmazon
      );

      fbaPricesList = fbaOffersList.map((item: any) =>
        Math.round((Number(item?.Shipping?.Amount) + Number(item?.ListingPrice?.Amount)) * 100) / 100
      );

      fbaPricesList.sort((a: number, b: number) => a - b);

      const amazonPrice = fbaPricesList.find((item: any) => item?.IsEligibleForSuperSaverShipping);

      const lowest = pricesList.length >= 1 ? pricesList[0] : 0;
      const secondLowest = pricesList.length >= 2 ? pricesList[1] : 0;
      const thirdLowest = pricesList.length >= 3 ? pricesList[2] : 0;
      const avgOf3 = pricesList.length >= 3 ? Math.round((lowest + secondLowest + thirdLowest) / 3 * 100) / 100 : 0;

      const lowestOffers = {
        lowest,
        secondLowest,
        thirdLowest,
        avgOf3
      }

      const offersCount = condition === "new" ? fbaNew + mfNew : fbaUsed + mfUsed + collectible;
      const fbaOffersCount = condition === "new" ? fbaNew : fbaUsed;

      if (fbaOffersCount > 0 && fbaPricesList.length === 0) {
        fbaPricesList = condition === "new" ? [lowestFBANew] : [lowestFBAUsed];
      }

      const buyBoxPrice = condition === "new" ? buyBoxNew : buyBoxUsed;

      fbaTargetPrice = selectFBATargetPrice(fbaConfig, salesRank, fbaPricesList, pricesList, lowestOffers, buyBoxPrice, lowestNew, buyBoxNew, amazonPrice, fbaOffersCount, offersCount);
      mfTargetPrice = selectMFTargetPrice(mfConfig, salesRank, pricesList, buyBoxPrice, lowestNew, buyBoxNew, amazonPrice, offersCount);

    }

    let fbaProfit = 0, mfProfit = 0;
    let mfShippingCost = 4.5;
    if (mfTrigger?.mfExtraValue !== undefined && mfTrigger?.mfExtraValue !== null && mfTrigger?.mfExtraValue > 0) {
      mfShippingCost = mfTrigger.mfExtraValue;
    }

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
