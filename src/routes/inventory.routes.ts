import express from "express";
import {
  getInventoryListHandler,
  deleteInventoryHandler,
} from "../controllers/inventory.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getInventoryListHandler);
router.delete("/:id", authenticate, deleteInventoryHandler);

export default router;
