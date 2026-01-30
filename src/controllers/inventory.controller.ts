import { Request, Response } from "express";
import { deleteScan, findScanListByUserId, updateScan } from "../services/scan.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getInventoryListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = Number(req.user!.id);

    const items = await findScanListByUserId(userId);

    res.status(200).json({
      result: true,
      inventoryList: items,
    });
  } catch (error: any) {
    console.error("Get inventory error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get inventory",
    });
  }
};

export const updateInventoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await updateScan(Number(id), updates);

    res.status(200).json({
      result: true,
      message: "Inventory updated successfully",
    });
  } catch (error: any) {
    console.error("Update inventory error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to update inventory",
    });
  }
};

export const deleteInventoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await deleteScan(Number(id));

    res.status(200).json({
      result: true,
      message: "Inventory deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete inventory error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to delete inventory",
    });
  }
};
