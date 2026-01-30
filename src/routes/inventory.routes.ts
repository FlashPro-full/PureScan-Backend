import express from "express";
import {
  getInventoryListHandler,
  updateInventoryHandler,
  deleteInventoryHandler,
} from "../controllers/inventory.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getInventoryListHandler);
router.delete("/:productId", authenticate, deleteInventoryHandler);

export default router;
