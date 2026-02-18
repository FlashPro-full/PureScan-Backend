export const defaultConfig = {
    Books: {
        fba: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 125000,
                fbaSlot: 3,
                usedSlot: 15,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 5
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 125001,
                maxSalesrank: 500000,
                fbaSlot: 3,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 1.25,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 8,
                    bumpUpPercentage: 35
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 8,
                    bumpUpPercentage: 35
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 25,
                maxEScore: 45,
                minSalesrank: 500001,
                maxSalesrank: 900000,
                fbaSlot: 2,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 1.75,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7,
                    bumpUpPercentage: 30
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7,
                    bumpUpPercentage: 30
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 24,
                minSalesrank: 900001,
                maxSalesrank: 1400000,
                fbaSlot: 2,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 6,
                    bumpUpPercentage: 30
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 6,
                    bumpUpPercentage: 30
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 1400001,
                maxSalesrank: 2100000,
                fbaSlot: 1,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 3.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 3,
                maxEScore: 5,
                minSalesrank: 2100001,
                maxSalesrank: 3000000,
                usedSlot: 2,
                amazonOffPercentage: 10,
                targetProfit: 7.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: false
            },
            {
                name: "07",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 2,
                minSalesrank: 3000001,
                maxSalesrank: 6000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 15,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: false
            },
            {
                name: "08",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 6000001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                primeLess: false,
                bbCompare: false,
                alwaysReject: false
            },
            {
                name: "09",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 10000001,
                maxSalesrank: 30000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 100,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: true
            }
        ],
        mf: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 125000,
                usedSlot: 3,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 5
                },
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 125001,
                maxSalesrank: 500000,
                usedSlot: 3,
                amazonOffPercentage: 10,
                targetProfit: 1.25,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },                
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 25,
                maxEScore: 45,
                minSalesrank: 500001,
                maxSalesrank: 900000,
                usedSlot: 2,
                amazonOffPercentage: 10,
                targetProfit: 1.75,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 24,
                minSalesrank: 900001,
                maxSalesrank: 1400000,
                usedSlot: 2,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 1400001,
                maxSalesrank: 2100000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 3.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 3,
                maxEScore: 5,
                minSalesrank: 2100001,
                maxSalesrank: 3000000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 7.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "07",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 2,
                minSalesrank: 3000001,
                maxSalesrank: 6000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 15,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                alwaysReject: false
            },
            {
                name: "08",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 6000001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                alwaysReject: false
            },
            {
                name: "09",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 10000001,
                maxSalesrank: 30000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 100,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                alwaysReject: true
            }
        ]
    },
    Music: {
        fba: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 10000,
                fbaSlot: 3,
                usedSlot: 15,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 5
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 10001,
                maxSalesrank: 125000,
                fbaSlot: 2,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 1.25,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7.5,
                    bumpUpPercentage: 30
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7.5,
                    bumpUpPercentage: 30
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 45,
                minSalesrank: 125001,
                maxSalesrank: 250000,
                fbaSlot: 1,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 2,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 250001,
                maxSalesrank: 500000,
                fbaSlot: 1,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 15
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 4,
                    bumpUpPercentage: 20
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 4,
                    bumpUpPercentage: 20
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 5,
                minSalesrank: 500001,
                maxSalesrank: 750000,
                usedSlot: 2,
                amazonOffPercentage: 15,
                targetProfit: 6,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 15
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 750001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: true
            }
        ],
        mf: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 10000,
                usedSlot: 3,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 5
                },
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 10001,
                maxSalesrank: 125000,
                usedSlot: 2,
                amazonOffPercentage: 10,
                targetProfit: 1.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },                
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 45,
                minSalesrank: 125001,
                maxSalesrank: 250000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 2,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 250001,
                maxSalesrank: 500000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            }
        ]
    },
    Videos: {
        fba: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 25000,
                fbaSlot: 3,
                usedSlot: 15,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 5
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 25001,
                maxSalesrank: 125000,
                fbaSlot: 2,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 1.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7.5,
                    bumpUpPercentage: 30
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7.5,
                    bumpUpPercentage: 30
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 45,
                minSalesrank: 125001,
                maxSalesrank: 225000,
                fbaSlot: 1,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 2,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 225001,
                maxSalesrank: 300000,
                fbaSlot: 1,
                usedSlot: 10,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 4,
                    bumpUpPercentage: 20
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 4,
                    bumpUpPercentage: 20
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 5,
                minSalesrank: 300001,
                maxSalesrank: 400000,
                usedSlot: 2,
                amazonOffPercentage: 15,
                targetProfit: 5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 15
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 400001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: true
            }
        ],
        mf: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 25000,
                usedSlot: 3,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 5
                },
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 25001,
                maxSalesrank: 125000,
                usedSlot: 2,
                amazonOffPercentage: 10,
                targetProfit: 1.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },                
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 45,
                minSalesrank: 125001,
                maxSalesrank: 225000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 2,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 225001,
                maxSalesrank: 300000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 5,
                minSalesrank: 300001,
                maxSalesrank: 400000,
                usedSlot: 1,
                amazonOffPercentage: 15,
                targetProfit: 5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 15
                },
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 3,
                maxEScore: 5,
                minSalesrank: 400001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                alwaysReject: true
            }
        ]
    },
    VideoGames: {
        fba: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 5000,
                fbaSlot: 3,
                usedSlot: 15,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 5
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 10,
                    bumpUpPercentage: 40
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 5001,
                maxSalesrank: 25000,
                fbaSlot: 2,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 1.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7.5,
                    bumpUpPercentage: 30
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 7.5,
                    bumpUpPercentage: 30
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 45,
                minSalesrank: 25001,
                maxSalesrank: 75000,
                fbaSlot: 1,
                usedSlot: 15,
                amazonOffPercentage: 10,
                targetProfit: 2,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 5,
                    bumpUpPercentage: 25
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 75001,
                maxSalesrank: 100000,
                fbaSlot: 1,
                usedSlot: 10,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "New Buy Box",
                    discount: 10
                },
                primeLess: true,
                primeLessOptions: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 4,
                    bumpUpPercentage: 20
                },
                ceiling2: true,
                ceiling2Options: {
                    option: "Average of 3 Used Offers",
                    bumpUpDollars: 4,
                    bumpUpPercentage: 20
                },
                bbCompare: true,
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 5,
                minSalesrank: 100001,
                maxSalesrank: 125000,
                usedSlot: 2,
                amazonOffPercentage: 15,
                targetProfit: 5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 15
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 0,
                maxEScore: 0,
                minSalesrank: 125001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                primeLess: false,
                ceiling2: false,
                bbCompare: false,
                alwaysReject: false
            }
        ],
        mf: [
            {
                name: "01",
                skipEScore: false,
                minEScore: 115,
                maxEScore: 999,
                minSalesrank: 1,
                maxSalesrank: 5000,
                usedSlot: 3,
                amazonOffPercentage: 5,
                targetProfit: 1,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 5
                },
                alwaysReject: false
            },
            {
                name: "02",
                skipEScore: false,
                minEScore: 46,
                maxEScore: 114,
                minSalesrank: 5001,
                maxSalesrank: 25000,
                usedSlot: 2,
                amazonOffPercentage: 10,
                targetProfit: 1.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },                
                alwaysReject: false
            },
            {
                name: "03",
                skipEScore: false,
                minEScore: 13,
                maxEScore: 45,
                minSalesrank: 25001,
                maxSalesrank: 75000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 2,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "04",
                skipEScore: false,
                minEScore: 6,
                maxEScore: 12,
                minSalesrank: 75001,
                maxSalesrank: 100000,
                usedSlot: 1,
                amazonOffPercentage: 10,
                targetProfit: 2.5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 10
                },
                alwaysReject: false
            },
            {
                name: "05",
                skipEScore: false,
                minEScore: 1,
                maxEScore: 5,
                minSalesrank: 100001,
                maxSalesrank: 125000,
                usedSlot: 1,
                amazonOffPercentage: 15,
                targetProfit: 5,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 15
                },
                alwaysReject: false
            },
            {
                name: "06",
                skipEScore: false,
                minEScore: 3,
                maxEScore: 5,
                minSalesrank: 125001,
                maxSalesrank: 10000000,
                usedSlot: 1,
                amazonOffPercentage: 20,
                targetProfit: 50,
                ceiling1: true,
                ceiling1Options: {
                    option: "Lowest New Price",
                    discount: 20
                },
                alwaysReject: true
            }
        ]    
    }
}