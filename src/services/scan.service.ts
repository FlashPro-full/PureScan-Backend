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
    const scans = await scanRepo.find({
        where: { user: { id: userId } },
        relations: ['product'],
        order: { createdAt: 'DESC' },
    });

    const byProductId = new Map<number, Scan>();
    for (const scan of scans) {
        if (scan.product?.id != null && !byProductId.has(scan.product.id)) {
            byProductId.set(scan.product.id, scan);
        }
    }

    return Array.from(byProductId.values());
}

export const deleteScan = async (id: number) => {
    let result = null;

    result = await scanRepo.delete({ id: id });

    return result;
}