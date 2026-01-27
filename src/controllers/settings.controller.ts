import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { findScanListByUserId } from "../services/scan.service";
import { findInventoryListByUserId } from "../services/inventory.service";
import { findSubscriptionByUserId } from "../services/subscription.service";

export const getSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    let subscription = await findSubscriptionByUserId(Number(userId));

    res.status(200).json({
      result: true,
      subscription: subscription,
    });
  } catch (error: any) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get subscription",
    });
  }
};

export const exportData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type } = req.query;

    if (type === "scans") {
      const scanList = await findScanListByUserId(Number(userId));

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="scans-${Date.now()}.json"`
      );
      res.status(200).json({
        result: true,
        scanList: scanList,
      });
    } else if (type === "inventory") {
      const inventoryList = await findInventoryListByUserId(Number(userId));

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="inventory-${Date.now()}.json"`
      );
      res.status(200).json({
        result: true,
        inventoryList: inventoryList,
      });
    } else {
      return res.status(400).json({
        result: false,
        error: "Invalid export type",
      });
    }
  } catch (error: any) {
    console.error("Export data error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to export data",
    });
  }
};
