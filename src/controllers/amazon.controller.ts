import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    getTotalAmazonCount,
    saveAmazon,
    findAmazonByUserId,
    updateAmazonById,
    deleteAmazonById
} from '../services/amazon.service';

export const createAmazonHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const { clientId, clientSecret, refreshToken } = req.body;

        if (!clientId || !clientSecret || !refreshToken) {
            return res.status(400).json({
                result: false,
                error: "Client ID, client secret, and refresh token are required",
            });
        }

        const amazon = await findAmazonByUserId(userId);

        if (amazon) {
            return res.status(400).json({
                result: false,
                error: "Amazon already exists",
            });
        }

        const newAmazon: any = {
            user: { id: userId },
            clientId,
            clientSecret,
            refreshToken
        };

        const newItem = await saveAmazon(newAmazon);

        res.status(201).json({
            result: true,
            amazon: newItem,
        });

    } catch (error: any) {
        console.error("Create Amazon error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to create Amazon",
        });
    }
}

export const getIsLimitedHandler = async (_req: Request, res: Response) => {
    try {
        const totalAmazonCount = await getTotalAmazonCount();

        const IsLimited = totalAmazonCount > 10 ? true : false;

        res.status(200).json({
            result: true,
            limit: IsLimited,
        });
    } catch (error: any) {
        console.error("Get total Amazon count error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to get total Amazon count",
        });
    }
}

export const getIsConnectedByUserHandler = async (req: AuthRequest, res: Response) => {
    try {
        const count = await getTotalAmazonCount()

        const isConnected = count > 0 ? true : false;

        res.status(200).json({
            result: true,
            connect: isConnected,
        });
    } catch (error: any) {
        console.error("Get Amazon is connected error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to get Amazon is connected",
        });
    }
}

export const getIsConnectedByAdminHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const amazon = await findAmazonByUserId(userId);

        if (!amazon) {
            return res.status(200).json({
                result: true,
                connect: false,
            });
        }

        res.status(200).json({
            result: true,
            connect: true,
        });
    } catch (error: any) {
        console.error("Get Amazon is connected by admin error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to get Amazon is connected by admin",
        });
    }
}

export const getAmazonHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const amazon = await findAmazonByUserId(userId);

        if (!amazon) {
            return res.status(404).json({
                result: false,
                error: "Amazon not found",
            });
        }

        res.status(200).json({
            result: true,
            amazon: amazon,
        });
    } catch (error: any) {
        console.error("Get Amazon error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to get Amazon",
        });
    }
}

export const updateAmazonHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { clientId, clientSecret, refreshToken } = req.body;

        if (!clientId || !clientSecret || !refreshToken) {
            return res.status(400).json({
                result: false,
                error: "Client ID, client secret, and refresh token are required",
            });
        }

        const updatedAmazon: any = {
            clientId,
            clientSecret,
            refreshToken
        };

        const updatedItem = await updateAmazonById(Number(id), updatedAmazon);

        res.status(200).json({
            result: true,
            amazon: updatedItem,
        });
    } catch (error: any) {
        console.error("Update Amazon error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to update Amazon",
        });
    }
}

export const deleteAmazonHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteAmazonById(Number(id));

        res.status(200).json({
            result: true,
            message: "Amazon deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete Amazon error:", error);
        res.status(500).json({
            result: false,
            error: "Failed to delete Amazon",
        });
    }
}