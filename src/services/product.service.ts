import { FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/product.entity';
import { ProductPricing } from '../entities/pricing.entity';

const productRepo = AppDataSource.getRepository(Product);
const pricingRepo = AppDataSource.getRepository(ProductPricing);

export const findProductByCondition = async (condition: FindOptionsWhere<Product>) => {
    let result = null;

    result = await productRepo.findOne({
        where: condition,
        relations: ['pricing'],
    });

    return result;
}

export const saveProduct = async (product: Partial<Product>) => {
    let result = null;

    result = await productRepo.save(product);

    return result;
}

export const savePricing = async (pricing: Partial<ProductPricing>) => {
    let result = null;

    result = await pricingRepo.save(pricing);

    return result;
}