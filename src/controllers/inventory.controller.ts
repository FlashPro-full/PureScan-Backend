import { Request, Response } from "express";
import { deleteScan, findScanListGroupByProductId } from "../services/scan.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getInventoryListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = Number(req.user!.id);

    const items = await findScanListGroupByProductId(userId);

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
