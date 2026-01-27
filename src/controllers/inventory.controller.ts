import { Response } from "express";
import {
  saveInventory,
  findInventoryByCondition,
  findInventoryListByUserId,
  updateInventory,
  deleteInventory,
} from "../services/inventory.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { Rating } from "../entities/inventory.entity";

export const createInventoryHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { barcode, title, author, category, image, scannedPrice, rating } =
      req.body;

    if (!barcode || !title || scannedPrice === undefined) {
      return res.status(400).json({
        result: false,
        error: "Barcode, title, and scannedPrice are required",
      });
    }

    const inventory: any = {
      user: { id: Number(userId) },
      barcode: barcode || "",
      title: title || "",
      author: author || "",
      category: category || "",
      image: image || "",
      scannedPrice: parseFloat(scannedPrice) || 0,
      rating: rating || Rating.FBA,
    };

    const item = await saveInventory(inventory);

    res.status(201).json({
      result: true,
      inventory: item,
    });
  } catch (error: any) {
    console.error("Create inventory error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to create inventory item",
    });
  }
};

export const getInventoryListHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const items = await findInventoryListByUserId(Number(userId));

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
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await findInventoryByCondition({
      id: Number(id),
    });

    if (!item) {
      return res.status(404).json({
        result: false,
        error: "Inventory not found",
      });
    }

    await updateInventory(Number(id), updates);

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
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const item = await findInventoryByCondition({
      id: Number(id),
    });

    if (!item) {
      return res.status(404).json({
        result: false,
        error: "Inventory not found",
      });
    }

    await deleteInventory(Number(id));

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
