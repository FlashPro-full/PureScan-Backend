export function getTriggerCategory(displayCategory: string): string | null {
  const s = (displayCategory || "").toLowerCase();
  if (s.includes("book")) return "Books";
  if (s.includes("music") || s === "cd") return "Music";
  if (s.includes("video game") || s.includes("videogame")) return "VideoGames";
  if (s.includes("video") || s.includes("dvd") || s.includes("blu")) return "Videos";
  return null;
}

function findMatchingTrigger(
  config: any[],
  salesRank: number,
  eScore: number
): any | null {
  if (!config?.length) return null;
  for (const t of config) {
    const rankMatch =
      salesRank >= (t.minSalesrank ?? 0) && salesRank <= (t.maxSalesrank ?? Infinity);
    const eScoreMatch =
      t.skipEScore ||
      (eScore >= (t.minEScore ?? 0) && eScore <= (t.maxEScore ?? 999));
    if (rankMatch && eScoreMatch) return t;
  }
  return null;
}

function findTriggerByRank(config: any[], salesRank: number): any | null {
  if (!config?.length) return null;
  for (const t of config) {
    if (
      salesRank >= (t.minSalesrank ?? 0) &&
      salesRank <= (t.maxSalesrank ?? Infinity)
    )
      return t;
  }
  return null;
}

export function calculateEScore(
  fbaConfig: any[],
  mfConfig: any[],
  salesRank: number,
  condition: "new" | "used"
): number {
  const triggers = condition === "new" ? fbaConfig : mfConfig;
  const t = findTriggerByRank(triggers, salesRank);
  if (!t) return 0;
  const delta = (t.maxEScore ?? 0) - (t.minEScore ?? 0);
  const range = (t.maxSalesrank ?? 0) - (t.minSalesrank ?? 0);
  if (range === 0) return t.minEScore ?? 0;
  const ratio = (salesRank - (t.minSalesrank ?? 0)) / range;
  return Math.round((t.minEScore ?? 0) + delta * ratio);
}

export function selectTargetPrice(
  fbaConfig: any[],
  mfConfig: any[],
  salesRank: number,
  initialPrice: number,
  buyBoxNew: number,
  lowestNew: number,
  usedOffers: { avgOf3?: number; lowest?: number; secondLowest?: number } | undefined,
  condition: "new" | "used"
): number {
  const triggers = condition === "new" ? fbaConfig : mfConfig;
  const t = findTriggerByRank(triggers, salesRank);
  if (!t) return 0;
  let price = initialPrice;

  const ceiling1On = t.ceiling1 && t.ceiling1Options;
  const ceiling1Opt = t.ceiling1Options?.options || "New Buy Box";
  const ceiling1Disc = t.ceiling1Options?.discount ?? 0;

  const primeLessOn = t.primeLess && t.primeLessOptions;
  const plOpt = t.primeLessOptions?.option || "";
  const plBump = t.primeLessOptions?.bumpUpDollars ?? 0;
  const plPct = t.primeLessOptions?.bumpUpPercentage ?? 0;

  const ceiling2On = t.ceiling2 && t.ceiling2Options;
  const c2Opt = t.ceiling2Options?.option || "";
  const c2Bump = t.ceiling2Options?.bumpUpDollars ?? 0;
  const c2Pct = t.ceiling2Options?.bumpUpPercentage ?? 0;

  if (primeLessOn && usedOffers) {
    if (
      (plOpt === "Average of 3 Used Offers" || plOpt.includes("Average")) &&
      usedOffers.avgOf3 != null
    ) {
      const bump = plBump + usedOffers.avgOf3 * (plPct / 100);
      const floor = Math.round((usedOffers.avgOf3 + bump) * 100) / 100;
      price = Math.max(price, floor);
    } else if (
      (plOpt === "2nd Lowest Used Offer" || plOpt.includes("2nd")) &&
      usedOffers.secondLowest != null
    ) {
      const floor =
        usedOffers.secondLowest +
        plBump +
        usedOffers.secondLowest * (plPct / 100);
      price = Math.max(price, Math.round(floor * 100) / 100);
    } else if (
      (plOpt === "Lowest Used Offer" || plOpt.includes("Lowest")) &&
      usedOffers.lowest != null
    ) {
      const floor =
        usedOffers.lowest + plBump + usedOffers.lowest * (plPct / 100);
      price = Math.max(price, Math.round(floor * 100) / 100);
    }
  }

  if (ceiling1On) {
    const ref = ceiling1Opt === "New Buy Box" ? buyBoxNew : lowestNew;
    const cap = Math.round(ref * (1 - ceiling1Disc / 100) * 100) / 100;
    price = price < cap ? price : ref;
  }

  if (ceiling2On && usedOffers) {
    if (
      (c2Opt === "Average of 3 Used Offers" || c2Opt.includes("Average")) &&
      usedOffers.avgOf3 != null
    ) {
      const bump = c2Bump + usedOffers.avgOf3 * (c2Pct / 100);
      const floor = Math.round((usedOffers.avgOf3 + bump) * 100) / 100;
      price = Math.max(price, floor);
    } else if (
      (c2Opt === "2nd Lowest Used Offer" || c2Opt.includes("2nd")) &&
      usedOffers.secondLowest != null
    ) {
      const floor =
        usedOffers.secondLowest +
        c2Bump +
        usedOffers.secondLowest * (c2Pct / 100);
      price = Math.max(price, Math.round(floor * 100) / 100);
    } else if (
      (c2Opt === "Lowest Used Offer" || c2Opt.includes("Lowest")) &&
      usedOffers.lowest != null
    ) {
      const floor =
        usedOffers.lowest + c2Bump + usedOffers.lowest * (c2Pct / 100);
      price = Math.max(price, Math.round(floor * 100) / 100);
    }
  }

  return price;
}

export function determineRoute(
  fbaConfig: any[],
  mfConfig: any[],
  salesRank: number,
  eScore: number,
  fbaProfit: number,
  mfProfit: number
): { fbaAccept: boolean; mfAccept: boolean } {
  const fbaTrigger = findMatchingTrigger(fbaConfig, salesRank, eScore);
  const mfTrigger = findMatchingTrigger(mfConfig, salesRank, eScore);

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
