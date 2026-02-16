import { Between, In } from 'typeorm';
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
        order: { createdAt: 'DESC' },
        take: 100,
    });

    return result;
}

export const findScanListPaginationByUserId = async (
    userId: number,
    page: number = 1,
    limit: number = 50
) => {
    const skip = (page - 1) * limit;
    const [scanList, total] = await scanRepo.findAndCount({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
    });
    return { scanList, total, totalPages: Math.ceil(total / limit) };
}

export const selectExportScanList = async (userId: number, from: Date, to: Date, routeKinds: string[]) => {
    let result = null;

    result = await scanRepo.find({
        where: { 
            user: { id: userId },
            createdAt: Between(from, to),
            route: In(routeKinds)
        },
        order: { createdAt: 'DESC' }
    });

    return result;
}

export const deleteScanById = async (id: number) => {
    let result = null;

    result = await scanRepo.delete({ id: id });

    return result;
}