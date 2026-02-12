export interface CeilingConfig {
  enabled: boolean;
  options: string;
  discount: number;
}

export interface PrimeLessConfig {
  enabled: boolean;
  options: string;
  bumpUpDollars: number;
  bumpUpPercentage: number;
}

export interface Ceiling2Config {
  enabled: boolean;
  options: string;
  bumpUpDollars: number;
  bumpUpPercentage: number;
}

export interface FbaTrigger {
  name: string;
  skipEScore: boolean;
  minEScore: number;
  maxEScore: number;
  minSalesrank: number;
  maxSalesrank: number;
  fbaSlot: number | null;
  usedSlot: number | null;
  bbCompare: boolean;
  amazonOffPercentage: number;
  targetProfit: number;
  alwaysReject: boolean;
  ceiling1: CeilingConfig;
  primeLess: PrimeLessConfig;
  ceiling2: Ceiling2Config;
}

export interface MfTrigger {
  name: string;
  skipEScore: boolean;
  minEScore: number;
  maxEScore: number;
  minSalesrank: number;
  maxSalesrank: number;
  usedSlot: number | null;
  amazonOffPercentage: number;
  targetProfit: number;
  alwaysReject: boolean;
  ceiling1: CeilingConfig;
}

export interface CategoryTriggers {
  fba: FbaTrigger[];
  mf: MfTrigger[];
}

export interface GaylordsTriggerConfig {
  Books: CategoryTriggers;
  Music: CategoryTriggers;
  Video: CategoryTriggers;
  VideoGames: CategoryTriggers;
}

const C1_OFF: CeilingConfig = { enabled: false, options: '', discount: 0 };
const PL_OFF: PrimeLessConfig = { enabled: false, options: '', bumpUpDollars: 0, bumpUpPercentage: 0 };
const C2_OFF: Ceiling2Config = { enabled: false, options: '', bumpUpDollars: 0, bumpUpPercentage: 0 };

export const GAYLORDS_TRIGGERS: GaylordsTriggerConfig = {
  Books: {
    fba: [
      { name: '01', skipEScore: false, minEScore: 151, maxEScore: 180, minSalesrank: 1, maxSalesrank: 50000, fbaSlot: 3, usedSlot: 15, bbCompare: true, amazonOffPercentage: 5, targetProfit: 1, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 5 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '02', skipEScore: false, minEScore: 115, maxEScore: 150, minSalesrank: 50001, maxSalesrank: 125000, fbaSlot: 3, usedSlot: 15, bbCompare: true, amazonOffPercentage: 5, targetProfit: 1.25, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 5 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '03', skipEScore: false, minEScore: 71, maxEScore: 114, minSalesrank: 125001, maxSalesrank: 250000, fbaSlot: 2, usedSlot: 15, bbCompare: true, amazonOffPercentage: 8, targetProfit: 1.45, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 8 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 7, bumpUpPercentage: 30 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 7, bumpUpPercentage: 30 } },
      { name: '04', skipEScore: false, minEScore: 46, maxEScore: 70, minSalesrank: 250001, maxSalesrank: 500000, fbaSlot: 2, usedSlot: 15, bbCompare: true, amazonOffPercentage: 10, targetProfit: 3, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 15 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '05', skipEScore: false, minEScore: 25, maxEScore: 45, minSalesrank: 500001, maxSalesrank: 900000, fbaSlot: 1, usedSlot: 15, bbCompare: true, amazonOffPercentage: 10, targetProfit: 3.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 20 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 5, bumpUpPercentage: 25 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 5, bumpUpPercentage: 25 } },
      { name: '06', skipEScore: false, minEScore: 13, maxEScore: 24, minSalesrank: 900001, maxSalesrank: 1400000, fbaSlot: 1, usedSlot: 10, bbCompare: true, amazonOffPercentage: 10, targetProfit: 5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 20 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 5, bumpUpPercentage: 25 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 5, bumpUpPercentage: 25 } },
      { name: '07', skipEScore: false, minEScore: 6, maxEScore: 12, minSalesrank: 1400001, maxSalesrank: 2100000, fbaSlot: 1, usedSlot: 5, bbCompare: true, amazonOffPercentage: 10, targetProfit: 6, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 20 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 4, bumpUpPercentage: 20 },
        ceiling2: C2_OFF },
      { name: '08', skipEScore: false, minEScore: 3, maxEScore: 5, minSalesrank: 2100001, maxSalesrank: 2400000, fbaSlot: null, usedSlot: 2, bbCompare: false, amazonOffPercentage: 10, targetProfit: 15, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '09', skipEScore: false, minEScore: 1, maxEScore: 2, minSalesrank: 2400000, maxSalesrank: 5000000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 9999999999, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '10', skipEScore: false, minEScore: 0, maxEScore: 0, minSalesrank: 5000001, maxSalesrank: 10000000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 9999999999, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '11', skipEScore: false, minEScore: 0, maxEScore: 0, minSalesrank: 10000001, maxSalesrank: 30000000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 9999999999, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 }, primeLess: PL_OFF, ceiling2: C2_OFF },
    ],
    mf: [
      { name: '01', skipEScore: false, minEScore: 151, maxEScore: 180, minSalesrank: 1, maxSalesrank: 50000, usedSlot: 5, amazonOffPercentage: 5, targetProfit: 1.25, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 6 } },
      { name: '02', skipEScore: false, minEScore: 115, maxEScore: 150, minSalesrank: 50001, maxSalesrank: 125000, usedSlot: 5, amazonOffPercentage: 10, targetProfit: 1.8, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 8 } },
      { name: '03', skipEScore: false, minEScore: 71, maxEScore: 114, minSalesrank: 125001, maxSalesrank: 250000, usedSlot: 4, amazonOffPercentage: 10, targetProfit: 2, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '04', skipEScore: false, minEScore: 46, maxEScore: 70, minSalesrank: 250001, maxSalesrank: 500000, usedSlot: 3, amazonOffPercentage: 10, targetProfit: 3, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '05', skipEScore: false, minEScore: 25, maxEScore: 45, minSalesrank: 500001, maxSalesrank: 900000, usedSlot: 2, amazonOffPercentage: 10, targetProfit: 4, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '06', skipEScore: false, minEScore: 13, maxEScore: 24, minSalesrank: 900001, maxSalesrank: 1400000, usedSlot: 2, amazonOffPercentage: 10, targetProfit: 4.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 11 } },
      { name: '07', skipEScore: false, minEScore: 6, maxEScore: 12, minSalesrank: 1400001, maxSalesrank: 2100000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 15 } },
      { name: '08', skipEScore: false, minEScore: 3, maxEScore: 5, minSalesrank: 2100001, maxSalesrank: 3000000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 8, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 15 } },
      { name: '09', skipEScore: false, minEScore: 1, maxEScore: 2, minSalesrank: 3000001, maxSalesrank: 6000000, usedSlot: 1, amazonOffPercentage: 20, targetProfit: 10, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 } },
      { name: '10', skipEScore: false, minEScore: 0, maxEScore: 0, minSalesrank: 6000001, maxSalesrank: 10000000, usedSlot: 1, amazonOffPercentage: 20, targetProfit: 50, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 } },
      { name: '11', skipEScore: false, minEScore: 0, maxEScore: 0, minSalesrank: 10000001, maxSalesrank: 30000000, usedSlot: 1, amazonOffPercentage: 20, targetProfit: 100, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 } },
    ],
  },

  Music: {
    fba: [
      { name: '01', skipEScore: true, minEScore: 150, maxEScore: 180, minSalesrank: 1, maxSalesrank: 25000, fbaSlot: 3, usedSlot: 5, bbCompare: true, amazonOffPercentage: 8, targetProfit: 1.25, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 8 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '02', skipEScore: true, minEScore: 120, maxEScore: 150, minSalesrank: 25001, maxSalesrank: 50000, fbaSlot: 3, usedSlot: 5, bbCompare: true, amazonOffPercentage: 10, targetProfit: 1.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '03', skipEScore: true, minEScore: 90, maxEScore: 120, minSalesrank: 50001, maxSalesrank: 75000, fbaSlot: 2, usedSlot: 5, bbCompare: true, amazonOffPercentage: 10, targetProfit: 2.25, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '04', skipEScore: true, minEScore: 60, maxEScore: 90, minSalesrank: 75001, maxSalesrank: 125000, fbaSlot: 1, usedSlot: 2, bbCompare: true, amazonOffPercentage: 15, targetProfit: 2.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 15 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '05', skipEScore: true, minEScore: 30, maxEScore: 60, minSalesrank: 125001, maxSalesrank: 200000, fbaSlot: 1, usedSlot: 2, bbCompare: true, amazonOffPercentage: 15, targetProfit: 6, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 15 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '06', skipEScore: true, minEScore: 15, maxEScore: 30, minSalesrank: 200001, maxSalesrank: 250000, fbaSlot: 1, usedSlot: 2, bbCompare: true, amazonOffPercentage: 20, targetProfit: 999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 },
        primeLess: { enabled: true, options: '...', bumpUpDollars: 20, bumpUpPercentage: 80 },
        ceiling2: C2_OFF },
      { name: 'Trigger 7', skipEScore: true, minEScore: 3, maxEScore: 15, minSalesrank: 250001, maxSalesrank: 300000, fbaSlot: null, usedSlot: 1, bbCompare: true, amazonOffPercentage: 20, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: C1_OFF,
        primeLess: { enabled: true, options: '2nd Lowest Used Offer', bumpUpDollars: 0, bumpUpPercentage: 0 },
        ceiling2: C2_OFF },
      { name: '08', skipEScore: true, minEScore: 1, maxEScore: 2, minSalesrank: 300000, maxSalesrank: 450000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: C1_OFF,
        primeLess: { enabled: true, options: 'Lowest Used Offer', bumpUpDollars: 0, bumpUpPercentage: 0 },
        ceiling2: C2_OFF },
      { name: '09', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 450001, maxSalesrank: 999999999999, fbaSlot: null, usedSlot: null, bbCompare: false, amazonOffPercentage: 30, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: C1_OFF, primeLess: PL_OFF, ceiling2: C2_OFF },
    ],
    mf: [
      { name: '01', skipEScore: true, minEScore: 120, maxEScore: 180, minSalesrank: 1, maxSalesrank: 25000, usedSlot: 8, amazonOffPercentage: 5, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 7 } },
      { name: '02', skipEScore: true, minEScore: 90, maxEScore: 120, minSalesrank: 25000, maxSalesrank: 50000, usedSlot: 6, amazonOffPercentage: 10, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 9 } },
      { name: '03', skipEScore: true, minEScore: 60, maxEScore: 90, minSalesrank: 50001, maxSalesrank: 75000, usedSlot: 4, amazonOffPercentage: 10, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '04', skipEScore: true, minEScore: 30, maxEScore: 60, minSalesrank: 75001, maxSalesrank: 125000, usedSlot: 3, amazonOffPercentage: 7, targetProfit: 7, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '05', skipEScore: true, minEScore: 15, maxEScore: 30, minSalesrank: 125000, maxSalesrank: 200000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 10, alwaysReject: false,
        ceiling1: C1_OFF },
      { name: '06', skipEScore: true, minEScore: 7, maxEScore: 15, minSalesrank: 200001, maxSalesrank: 250000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 10, alwaysReject: false,
        ceiling1: C1_OFF },
      { name: '07', skipEScore: true, minEScore: 3, maxEScore: 6, minSalesrank: 250001, maxSalesrank: 300000, usedSlot: 1, amazonOffPercentage: 18, targetProfit: 15, alwaysReject: false,
        ceiling1: C1_OFF },
      { name: '08', skipEScore: true, minEScore: 1, maxEScore: 2, minSalesrank: 300000, maxSalesrank: 400000, usedSlot: 1, amazonOffPercentage: 20, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: C1_OFF },
      { name: '09', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 400000, maxSalesrank: 999999999999, usedSlot: 1, amazonOffPercentage: 30, targetProfit: 9999999, alwaysReject: true,
        ceiling1: C1_OFF },
    ],
  },

  Video: {
    fba: [
      { name: '01', skipEScore: true, minEScore: 150, maxEScore: 180, minSalesrank: 1, maxSalesrank: 10000, fbaSlot: 4, usedSlot: 15, bbCompare: true, amazonOffPercentage: 5, targetProfit: 1.2, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 5 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '02', skipEScore: true, minEScore: 120, maxEScore: 150, minSalesrank: 10001, maxSalesrank: 25000, fbaSlot: 3, usedSlot: 10, bbCompare: true, amazonOffPercentage: 8, targetProfit: 1.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 5 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '03', skipEScore: true, minEScore: 90, maxEScore: 120, minSalesrank: 25001, maxSalesrank: 50000, fbaSlot: 3, usedSlot: 10, bbCompare: true, amazonOffPercentage: 10, targetProfit: 1.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '04', skipEScore: true, minEScore: 60, maxEScore: 90, minSalesrank: 50001, maxSalesrank: 75000, fbaSlot: 2, usedSlot: 3, bbCompare: true, amazonOffPercentage: 10, targetProfit: 2, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '05', skipEScore: true, minEScore: 45, maxEScore: 60, minSalesrank: 75000, maxSalesrank: 100000, fbaSlot: 2, usedSlot: 3, bbCompare: true, amazonOffPercentage: 20, targetProfit: 2.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 8 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '06', skipEScore: true, minEScore: 24, maxEScore: 45, minSalesrank: 100001, maxSalesrank: 150000, fbaSlot: 1, usedSlot: 2, bbCompare: true, amazonOffPercentage: 20, targetProfit: 3, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 8 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '07', skipEScore: true, minEScore: 10, maxEScore: 24, minSalesrank: 150001, maxSalesrank: 200000, fbaSlot: 1, usedSlot: 2, bbCompare: true, amazonOffPercentage: 20, targetProfit: 8, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '08', skipEScore: true, minEScore: 6, maxEScore: 10, minSalesrank: 200001, maxSalesrank: 250000, fbaSlot: 1, usedSlot: 3, bbCompare: true, amazonOffPercentage: 15, targetProfit: 25, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 15 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '09', skipEScore: true, minEScore: 3, maxEScore: 6, minSalesrank: 250000, maxSalesrank: 300000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 20 },
        primeLess: { enabled: true, options: '2nd Lowest Used Offer', bumpUpDollars: 0, bumpUpPercentage: 0 },
        ceiling2: C2_OFF },
      { name: '10', skipEScore: true, minEScore: 1, maxEScore: 3, minSalesrank: 300001, maxSalesrank: 375000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: C1_OFF,
        primeLess: { enabled: true, options: 'Lowest Used Offer', bumpUpDollars: 0, bumpUpPercentage: 0 },
        ceiling2: C2_OFF },
      { name: '10b', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 375001, maxSalesrank: 450000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 25, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: C1_OFF,
        primeLess: { enabled: true, options: 'Lowest Used Offer', bumpUpDollars: 0, bumpUpPercentage: 0 },
        ceiling2: C2_OFF },
      { name: '11', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 450001, maxSalesrank: 999999999, fbaSlot: null, usedSlot: null, bbCompare: false, amazonOffPercentage: 30, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: C1_OFF, primeLess: PL_OFF, ceiling2: C2_OFF },
    ],
    mf: [
      { name: '01', skipEScore: true, minEScore: 120, maxEScore: 180, minSalesrank: 1, maxSalesrank: 10000, usedSlot: 10, amazonOffPercentage: 5, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 7 } },
      { name: '02', skipEScore: true, minEScore: 90, maxEScore: 120, minSalesrank: 10001, maxSalesrank: 25000, usedSlot: 10, amazonOffPercentage: 10, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 8 } },
      { name: '03', skipEScore: true, minEScore: 60, maxEScore: 90, minSalesrank: 25001, maxSalesrank: 50000, usedSlot: 8, amazonOffPercentage: 10, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 8 } },
      { name: '04', skipEScore: true, minEScore: 30, maxEScore: 60, minSalesrank: 50001, maxSalesrank: 75000, usedSlot: 7, amazonOffPercentage: 15, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '05', skipEScore: true, minEScore: 15, maxEScore: 30, minSalesrank: 75001, maxSalesrank: 100000, usedSlot: 4, amazonOffPercentage: 15, targetProfit: 99999999999999, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '06', skipEScore: true, minEScore: 7, maxEScore: 15, minSalesrank: 100001, maxSalesrank: 150000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 7, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '07', skipEScore: true, minEScore: 4, maxEScore: 7, minSalesrank: 150000, maxSalesrank: 200000, usedSlot: 1, amazonOffPercentage: 15, targetProfit: 7, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '08', skipEScore: true, minEScore: 3, maxEScore: 4, minSalesrank: 200001, maxSalesrank: 250000, usedSlot: 1, amazonOffPercentage: 15, targetProfit: 10, alwaysReject: false,
        ceiling1: C1_OFF },
      { name: '09', skipEScore: true, minEScore: 1, maxEScore: 2, minSalesrank: 250001, maxSalesrank: 300000, usedSlot: 1, amazonOffPercentage: 15, targetProfit: 10, alwaysReject: false,
        ceiling1: C1_OFF },
      { name: '10', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 300001, maxSalesrank: 375000, usedSlot: 1, amazonOffPercentage: 25, targetProfit: 15, alwaysReject: true,
        ceiling1: C1_OFF },
      { name: '11', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 375001, maxSalesrank: 450000, usedSlot: 1, amazonOffPercentage: 25, targetProfit: 99999999999999, alwaysReject: true,
        ceiling1: C1_OFF },
      { name: '12', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 450001, maxSalesrank: 9999999999999, usedSlot: 6, amazonOffPercentage: 30, targetProfit: 9999999999, alwaysReject: true,
        ceiling1: C1_OFF },
    ],
  },

  VideoGames: {
    fba: [
      { name: '01', skipEScore: true, minEScore: 115, maxEScore: 180, minSalesrank: 1, maxSalesrank: 5000, fbaSlot: 3, usedSlot: 15, bbCompare: true, amazonOffPercentage: 5, targetProfit: 2, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 5 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 10, bumpUpPercentage: 40 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 10, bumpUpPercentage: 40 } },
      { name: '02', skipEScore: true, minEScore: 46, maxEScore: 114, minSalesrank: 5001, maxSalesrank: 10000, fbaSlot: 2, usedSlot: 15, bbCompare: true, amazonOffPercentage: 10, targetProfit: 2.5, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 7.50, bumpUpPercentage: 30 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 7.50, bumpUpPercentage: 30 } },
      { name: '03', skipEScore: true, minEScore: 13, maxEScore: 45, minSalesrank: 10001, maxSalesrank: 25000, fbaSlot: 1, usedSlot: 3, bbCompare: true, amazonOffPercentage: 10, targetProfit: 4, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 5, bumpUpPercentage: 25 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 5, bumpUpPercentage: 25 } },
      { name: '04', skipEScore: true, minEScore: 6, maxEScore: 12, minSalesrank: 25000, maxSalesrank: 40000, fbaSlot: 1, usedSlot: 2, bbCompare: true, amazonOffPercentage: 15, targetProfit: 6, alwaysReject: false,
        ceiling1: { enabled: true, options: 'New Buy Box', discount: 10 },
        primeLess: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 4, bumpUpPercentage: 20 },
        ceiling2: { enabled: true, options: 'Average of 3 Used Offers', bumpUpDollars: 4, bumpUpPercentage: 20 } },
      { name: '05', skipEScore: true, minEScore: 1, maxEScore: 5, minSalesrank: 40000, maxSalesrank: 80000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 15, targetProfit: 10, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 15 }, primeLess: PL_OFF, ceiling2: C2_OFF },
      { name: '06', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 125001, maxSalesrank: 10000000, fbaSlot: null, usedSlot: 1, bbCompare: false, amazonOffPercentage: 20, targetProfit: 50, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 }, primeLess: PL_OFF, ceiling2: C2_OFF },
    ],
    mf: [
      { name: '01', skipEScore: true, minEScore: 115, maxEScore: 180, minSalesrank: 1, maxSalesrank: 5000, usedSlot: 3, amazonOffPercentage: 5, targetProfit: 1, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 5 } },
      { name: '02', skipEScore: true, minEScore: 46, maxEScore: 114, minSalesrank: 5001, maxSalesrank: 25000, usedSlot: 2, amazonOffPercentage: 10, targetProfit: 1.5, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '03', skipEScore: true, minEScore: 13, maxEScore: 45, minSalesrank: 25001, maxSalesrank: 75000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 8, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '04', skipEScore: true, minEScore: 6, maxEScore: 12, minSalesrank: 75001, maxSalesrank: 100000, usedSlot: 1, amazonOffPercentage: 10, targetProfit: 8, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 10 } },
      { name: '05', skipEScore: true, minEScore: 1, maxEScore: 5, minSalesrank: 100001, maxSalesrank: 200000, usedSlot: 1, amazonOffPercentage: 15, targetProfit: 12, alwaysReject: false,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 15 } },
      { name: '06', skipEScore: true, minEScore: 0, maxEScore: 0, minSalesrank: 200001, maxSalesrank: 10000000, usedSlot: 1, amazonOffPercentage: 20, targetProfit: 50, alwaysReject: true,
        ceiling1: { enabled: true, options: 'Lowest New Price', discount: 20 } },
    ],
  },
};

export function findFbaTrigger(category: string, salesRank: number, eScore: number): FbaTrigger | null {
  const cat = getCategoryKey(category);
  if (!cat) return null;

  const triggers = GAYLORDS_TRIGGERS[cat].fba;
  for (const t of triggers) {
    const rankMatch = salesRank >= t.minSalesrank && salesRank <= t.maxSalesrank;
    const eScoreMatch = t.skipEScore || (eScore >= t.minEScore && eScore <= t.maxEScore);
    if (rankMatch && eScoreMatch) return t;
  }
  return null;
}

export function findMfTrigger(category: string, salesRank: number, eScore: number): MfTrigger | null {
  const cat = getCategoryKey(category);
  if (!cat) return null;

  const triggers = GAYLORDS_TRIGGERS[cat].mf;
  for (const t of triggers) {
    const rankMatch = salesRank >= t.minSalesrank && salesRank <= t.maxSalesrank;
    const eScoreMatch = t.skipEScore || (eScore >= t.minEScore && eScore <= t.maxEScore);
    if (rankMatch && eScoreMatch) return t;
  }
  return null;
}

function getCategoryKey(category: string): keyof GaylordsTriggerConfig | null {
  const lower = category.toLowerCase();
  if (lower.includes('book')) return 'Books';
  if (lower.includes('music') || lower === 'cd') return 'Music';
  if (lower.includes('video game') || lower.includes('videogame')) return 'VideoGames';
  if (lower.includes('video') || lower.includes('dvd') || lower.includes('blu')) return 'Video';
  return null;
}

export function calculateEScore(category: string, salesRank: number, condition: 'new' | 'used' = 'used'): number {
  const cat = getCategoryKey(category);
  if (!cat) return 0;
  const triggers = condition === 'new' ? GAYLORDS_TRIGGERS[cat].fba : GAYLORDS_TRIGGERS[cat].mf;
  for (const t of triggers) {
    if (salesRank >= t.minSalesrank && salesRank <= t.maxSalesrank) {
      const delta = t.maxEScore - t.minEScore;
      const range = t.maxSalesrank - t.minSalesrank;
      if (range === 0) return t.minEScore;
      const ratio = (salesRank - t.minSalesrank) / range;
      return Math.round(t.minEScore + delta * ratio);
    }
  }
  return 0;
}

export function selectTargetPrice(
  category: string,
  salesRank: number,
  initialPrice: number,
  buyBoxNew: number,
  lowestNew: number,
  usedOffers?: { avgOf3?: number; lowest?: number; secondLowest?: number },
  condition: 'new' | 'used' = 'used'
): number {
  const cat = getCategoryKey(category);
  if (!cat) return 0;
  const triggers = condition === 'new' ? GAYLORDS_TRIGGERS[cat].fba : GAYLORDS_TRIGGERS[cat].mf;
  for (const t of triggers) {
    if (salesRank >= t.minSalesrank && salesRank <= t.maxSalesrank) {
      let price = initialPrice;

      const fbaTrigger = t as FbaTrigger;
      if (fbaTrigger.primeLess?.enabled) {
        const pl = fbaTrigger.primeLess;
        if (pl.options === 'Average of 3 Used Offers' && usedOffers?.avgOf3 != null) {
          const bump = pl.bumpUpDollars + usedOffers.avgOf3 * (pl.bumpUpPercentage / 100);
          const floor = Math.round((usedOffers.avgOf3 + bump) * 100) / 100;
          price = Math.max(price, floor);
        } else if (pl.options === '2nd Lowest Used Offer' && usedOffers?.secondLowest != null) {
          const floor = usedOffers.secondLowest + pl.bumpUpDollars + usedOffers.secondLowest * (pl.bumpUpPercentage / 100);
          price = Math.max(price, Math.round(floor * 100) / 100);
        } else if (pl.options === 'Lowest Used Offer' && usedOffers?.lowest != null) {
          const floor = usedOffers.lowest + pl.bumpUpDollars + usedOffers.lowest * (pl.bumpUpPercentage / 100);
          price = Math.max(price, Math.round(floor * 100) / 100);
        }
      }

      if (t.ceiling1?.enabled) {
        const ref = t.ceiling1.options === 'New Buy Box' ? buyBoxNew : lowestNew;
        const cap = Math.round(ref * (1 - t.ceiling1.discount / 100) * 100) / 100;
        price = price < cap ? price : ref;
      }

      if (fbaTrigger.ceiling2?.enabled) {
        const c2 = fbaTrigger.ceiling2;
        if (c2.options === 'Average of 3 Used Offers' && usedOffers?.avgOf3 != null) {
          const bump = c2.bumpUpDollars + usedOffers.avgOf3 * (c2.bumpUpPercentage / 100);
          const floor = Math.round((usedOffers.avgOf3 + bump) * 100) / 100;
          price = Math.max(price, floor);
        } else if (c2.options === '2nd Lowest Used Offer' && usedOffers?.secondLowest != null) {
          const floor = usedOffers.secondLowest + c2.bumpUpDollars + usedOffers.secondLowest * (c2.bumpUpPercentage / 100);
          price = Math.max(price, Math.round(floor * 100) / 100);
        } else if (c2.options === 'Lowest Used Offer' && usedOffers?.lowest != null) {
          const floor = usedOffers.lowest + c2.bumpUpDollars + usedOffers.lowest * (c2.bumpUpPercentage / 100);
          price = Math.max(price, Math.round(floor * 100) / 100);
        }
      }

      return price;
    }
  }
  return 0;
}

export function determineRoute(
  category: string,
  salesRank: number,
  eScore: number,
  fbaProfit: number,
  mfProfit: number
): any {
  const fbaTrigger = findFbaTrigger(category, salesRank, eScore);
  const mfTrigger = findMfTrigger(category, salesRank, eScore);

  const fbaAccept = fbaTrigger && !fbaTrigger.alwaysReject && fbaProfit >= fbaTrigger.targetProfit;
  const mfAccept = mfTrigger && !mfTrigger.alwaysReject && mfProfit >= mfTrigger.targetProfit;

  return {
    fbaAccept,
    mfAccept
  }
}
