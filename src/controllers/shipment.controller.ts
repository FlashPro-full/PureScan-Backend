import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { User } from "../entities/user.entity";
import { saveShipment, findShipmentListByUserId, updateCurrentShipment, getDailyIncrementId } from "../services/shipment.service";

export const createShipmentHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const { module, date } = req.body;
        const shipmentDate = date ? new Date(date) : new Date();
        const dailyIncrementId = await getDailyIncrementId(userId, module, shipmentDate);

        const shipment = await saveShipment({
            user: { id: userId } as User,
            module: module,
            name: `${module}-${userId}-${dailyIncrementId}-${date}`,
            current: true
        });

        await updateCurrentShipment(module, shipment.id);

        res.status(200).json({
            result: true,
            shipment: shipment
        });
    } catch (error: any) {
        console.error("Create shipment error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to create shipment"
        });
    }
}

export const getShipmentListHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const shipments = await findShipmentListByUserId(userId);

        res.status(200).json({
            result: true,
            shipmentList: shipments
        });
    } catch (error: any) {
        console.error("Get shipment list error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to get shipment list"
        });
    }
}

export const updateCurrentShipmentHandler = async (req: Request, res: Response) => {
    try {
        const { module, id } = req.body;

        await updateCurrentShipment(module, id);

        res.status(200).json({
            result: true,
            message: "Shipment updated successfully"
        });
    } catch (error: any) {
        console.error("Update current shipment error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to update current shipment"
        });
    }
}