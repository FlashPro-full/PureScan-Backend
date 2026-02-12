type ProductCondition = "new" | "used";

let productCondition: ProductCondition = "used";

export const getProductCondition = (): ProductCondition => productCondition;

export const toggleProductCondition = (): void => {
  if (productCondition === "new") {
    productCondition = "used";
  } else {
    productCondition = "new";
  }
};
