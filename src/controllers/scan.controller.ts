import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { saveScan, findScanListByUserId } from "../services/scan.service";
import {
  findInventoryByCondition,
  saveInventory,
} from "../services/inventory.service";
import { Rating } from "../entities/inventory.entity";

export const createScan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type, title, barcode, metadata } = req.body;

    if (!barcode || !title) {
      return res.status(400).json({
        result: false,
        error: "Barcode and title are required",
      });
    }

    const scan: any = {
      userId,
      barcode,
      title,
      category: metadata?.category || null,
      itemType: type || "other",
      currentPrice: metadata?.currentPrice || null,
      suggestedPrice: metadata?.suggestedPrice || null,
      profit: metadata?.profit || null,
      recommendation: metadata?.recommendation || "discard",
      metadata,
      scannedAt: new Date(),
    };

    const savedScan = await saveScan(scan);

    if (metadata?.recommendation === "keep") {
      const existingInventory = await findInventoryByCondition({
        user: { id: Number(userId) },
        barcode,
      });

      if (!existingInventory) {
        const inventoryItem = {
          userId,
          barcode,
          title,
          author: metadata?.author || null,
          category: metadata?.category || null,
          image: metadata?.image || null,
          scannedPrice: metadata?.currentPrice || 0,
          rating: Rating.FBA,
          timestamp: new Date(),
        };
        await saveInventory(inventoryItem);
      }
    }

    res.status(201).json({
      result: true,
      scan: savedScan,
    });
  } catch (error: any) {
    console.error("Create scan error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to create scan",
    });
  }
};

export const getScanList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const scans = await findScanListByUserId(Number(userId));

    res.status(200).json({
      result: true,
      scanList: scans,
    });
  } catch (error: any) {
    console.error("Get scans error:", error);
    res.status(500).json({
      result: true,
      error: "Failed to get scans",
    });
  }
};
