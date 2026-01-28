import { AppDataSource } from '../data-source';
import { Amazon } from '../entities/amazon.entity';

const amazonRepo = AppDataSource.getRepository(Amazon);

export const getTotalAmazonCount = async () => {
    let result = 0;

    result = await amazonRepo.count()

    return result;
}

export const saveAmazon = async (amazon: Partial<Amazon>) => {
    let result = null;

    result = await amazonRepo.save(amazon);

    return result;
}

export const findAmazonByUserId = async (userId: number) => {
    let result = null;

    result = await amazonRepo.findOne({
        where: { user: { id: userId } }
    });

    return result;
}

export const updateAmazonById = async (id: number, amazon: Partial<Amazon>) => {
    let result = null;

    result = await amazonRepo.update({ id: id }, amazon);

    return result;
}

export const deleteAmazonById = async (id: number) => {
    let result = null;

    result = await amazonRepo.delete(id);

    return result;
}