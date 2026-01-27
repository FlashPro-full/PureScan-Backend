import express from "express";
import {
  getInventoryListHandler,
  updateInventoryHandler,
  deleteInventoryHandler,
  createInventoryHandler,
} from "../controllers/inventory.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getInventoryListHandler);
router.post("/", authenticate, createInventoryHandler);
router.put("/:id", authenticate, updateInventoryHandler);
router.delete("/:id", authenticate, deleteInventoryHandler);

export default router;
