export class FeeCalculatorService {
  calculateFBAFees(
    price: number,
    dimensions: { length: number; width: number; height: number },
    weightOz: number
  ): {
    fulfillmentFee: number;
    storageFee: number;
    referralFee: number;
    closingFee: number;
    total: number;
  } {
    const referralFee = price * 0.15;
    const closingFee = 1.8;

    const totalDimensions = dimensions.length + dimensions.width + dimensions.height;
    let fulfillmentFee = 0;

    if (totalDimensions <= 15 && weightOz <= 12) {
      fulfillmentFee = weightOz <= 6 ? 2.7 : 3.4;
    } else if (totalDimensions <= 18 && dimensions.length <= 18 && dimensions.width <= 14 && dimensions.height <= 8 && weightOz <= 20 * 16) {
      const weightLb = weightOz / 16;
      fulfillmentFee = 4.75 + (weightLb > 1 ? (weightLb - 1) * 0.38 : 0);
    } else {
      fulfillmentFee = 8.26 + ((weightOz / 16) - 1) * 0.38;
    }

    const cubicFeet = (dimensions.length * dimensions.width * dimensions.height) / 1728;
    const storageFee = cubicFeet * 0.75;

    return {
      fulfillmentFee: Math.round(fulfillmentFee * 100) / 100,
      storageFee: Math.round(storageFee * 100) / 100,
      referralFee: Math.round(referralFee * 100) / 100,
      closingFee,
      total: Math.round((fulfillmentFee + storageFee + referralFee + closingFee) * 100) / 100,
    };
  }

  calculateMFFees(price: number): {
    referralFee: number;
    closingFee: number;
    total: number;
  } {
    const referralFee = price * 0.15;
    const closingFee = 1.8;

    return {
      referralFee: Math.round(referralFee * 100) / 100,
      closingFee,
      total: Math.round((referralFee + closingFee) * 100) / 100,
    };
  }

  calculateFBAProfit(
    buyBoxPrice: number,
    fees: { fulfillmentFee: number; storageFee: number; referralFee: number; closingFee: number; total: number },
    inboundShipping: number = 1.2
  ): number {
    return Math.round((buyBoxPrice - fees.total - inboundShipping) * 100) / 100;
  }

  calculateMFProfit(
    lowestMfPrice: number,
    fees: { referralFee: number; closingFee: number; total: number },
    outboundShipping: number = 3.75
  ): number {
    return Math.round((lowestMfPrice - fees.total - outboundShipping) * 100) / 100;
  }
}

export const feeCalculatorService = new FeeCalculatorService();

