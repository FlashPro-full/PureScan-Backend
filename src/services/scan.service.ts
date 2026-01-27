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
        order: { scannedAt: 'DESC' },
        take: 100,
    });

    return result;
}