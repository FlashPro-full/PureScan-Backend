import { Between } from 'typeorm';
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

export const selectScanListByFromTo = async (userId: number, from: Date, to: Date) => {
    let result = null;

    result = await scanRepo.find({
        where: { 
            user: { id: userId },
            createdAt: Between(from, to)
        },
    });

    return result;
}

export const deleteScanById = async (id: number) => {
    let result = null;

    result = await scanRepo.delete({ id: id });

    return result;
}