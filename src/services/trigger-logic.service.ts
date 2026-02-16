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
  salesRank: number
): number {
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

export function selectTargetPrice(
  fbaConfig: any[],
  mfConfig: any[],
  salesRank: number,
  initialPrice: number,
  buyBoxNew: number,
  lowestNew: number,
  buyBoxUsed: number,
  usedOffers: { avgOf3?: number; lowest?: number; secondLowest?: number; thirdLowest?: number } | undefined,
  route: "FBA" | "MF",
  missingOptions?: { targetPricePercentage?: number; fixedPrice?: number },
  disabledMissing?: boolean
): number {
  const triggers = route === "FBA" ? fbaConfig : mfConfig;
  const t = findTriggerByRank(triggers, salesRank);
  if (!t) return 0;

  const hasUsedOffers = !!(
    usedOffers &&
    (usedOffers.lowest != null ||
      usedOffers.secondLowest != null ||
      usedOffers.thirdLowest != null ||
      usedOffers.avgOf3 != null)
  );
  const hasNewOffers = buyBoxNew > 0 || lowestNew > 0;

  if (disabledMissing && (!hasUsedOffers || !hasNewOffers)) return 0;

  let price = initialPrice;
  if (!hasNewOffers && missingOptions?.fixedPrice != null) {
    price = missingOptions.fixedPrice;
  } else if (!hasUsedOffers && missingOptions?.targetPricePercentage != null && lowestNew > 0) {
    price = Math.round(lowestNew * (missingOptions.targetPricePercentage / 100) * 100) / 100;
  }

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
      (plOpt === "3rd Lowest Used Offer" || plOpt.includes("3rd")) &&
      usedOffers.thirdLowest != null
    ) {
      const floor =
        usedOffers.thirdLowest +
        plBump +
        usedOffers.thirdLowest * (plPct / 100);
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

  if (t.bbCompare && buyBoxUsed > 0 && buyBoxUsed > price) {
    price = buyBoxUsed;
  }

  if (ceiling1On && hasNewOffers) {
    const ref = ceiling1Opt === "New Buy Box" ? buyBoxNew : lowestNew;
    const cap = Math.round(ref * (1 - ceiling1Disc / 100) * 100) / 100;
    price = Math.min(price, cap);
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
      (c2Opt === "3rd Lowest Used Offer" || c2Opt.includes("3rd")) &&
      usedOffers.thirdLowest != null
    ) {
      const floor =
        usedOffers.thirdLowest +
        c2Bump +
        usedOffers.thirdLowest * (c2Pct / 100);
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

  if (!hasUsedOffers || !hasNewOffers) return price;

  const candidates: number[] = [];
  if (initialPrice > 0) candidates.push(initialPrice);
  if (buyBoxNew > 0) candidates.push(buyBoxNew);
  if (lowestNew > 0) candidates.push(lowestNew);
  if (buyBoxUsed > 0) candidates.push(buyBoxUsed);
  if (usedOffers) {
    if (usedOffers.lowest != null && usedOffers.lowest > 0) candidates.push(usedOffers.lowest);
    if (usedOffers.secondLowest != null && usedOffers.secondLowest > 0) candidates.push(usedOffers.secondLowest);
    if (usedOffers.thirdLowest != null && usedOffers.thirdLowest > 0) candidates.push(usedOffers.thirdLowest);
    if (usedOffers.avgOf3 != null && usedOffers.avgOf3 > 0) candidates.push(usedOffers.avgOf3);
  }

  if (candidates.length === 0) return price;
  const uniqueCandidates = [...new Set(candidates)];
  let best = uniqueCandidates[0];
  let bestDiff = Math.abs(uniqueCandidates[0] - price);
  for (let i = 1; i < uniqueCandidates.length; i++) {
    const d = Math.abs(uniqueCandidates[i] - price);
    if (d < bestDiff) {
      bestDiff = d;
      best = uniqueCandidates[i];
    }
  }
  return best;
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
