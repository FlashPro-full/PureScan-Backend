import { AppDataSource } from '../data-source';
import { Scan } from '../entities/scan.entity';

const scanRepo = AppDataSource.getRepository(Scan);

export const saveScan = async (scan: Partial<Scan>) => {
    let result = null;

    result = await scanRepo.save(scan);

    return result;
}

export const findScanListByUserId = async (userId: number) => {
    let result = null;

    result = await scanRepo.find({
        where: { user: { id: userId } },
        relations: ['product'],
        order: { createdAt: 'DESC' },
        take: 100,
    });

    return result;
}

export const findScanListGroupByProductId = async (userId: number) => {
    let result = null;

    result = await scanRepo
        .createQueryBuilder('scan')
        .innerJoinAndSelect('scan.product', 'product')
        .where('scan.userId = :userId', { userId })
        .groupBy('product.id')
        .getMany();

    return result;
}

export const updateScan = async (id: number, scan: Partial<Scan>) => {
    let result = null;

    result = await scanRepo.update({ id: id }, scan);

    return result;
}

export const deleteScan = async (id: number) => {
    let result = null;

    result = await scanRepo.delete({ id: id });

    return result;
}