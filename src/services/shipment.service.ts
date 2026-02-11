import { Not, Between } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Shipment } from '../entities/shipment.entity';

const shipmentRepo = AppDataSource.getRepository(Shipment);

export const saveShipment = async (shipment: Partial<Shipment>) => {
    let result = null;

    result = await shipmentRepo.save(shipment);

    return result;
}

export const findShipmentListByUserId = async (userId: number) => {
    let result = null;

    result = await shipmentRepo.find({
        where: { user: { id: userId } }
    });

    return result;
}

export const getDailyIncrementId = async (userId: number, module: string, date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const count = await shipmentRepo.count({
        where: {
            user: { id: userId },
            module: module,
            createdAt: Between(start, end)
        }
    });

    return count + 1;
}

export const updateCurrentShipment = async (module: string, id: number) => {
    let result = null;

    await shipmentRepo.update(
        {
            module: module,
            id: Not(id)
        },
        { current: false }
    )

    result = await shipmentRepo.update(
        { id: id },
        { current: true }
    )

    return result;
}

export const deleteShipmentById = async (id: number) => {
    let result = null;

    result = await shipmentRepo.delete({ id: id });

    return result;
}