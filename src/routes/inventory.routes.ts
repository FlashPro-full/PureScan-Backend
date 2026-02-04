import express from "express";
import {
  getInventoryListHandler,
  deleteInventoryHandler,
} from "../controllers/inventory.controller";

const router = express.Router();

router.get("/", getInventoryListHandler);
router.delete("/:id", deleteInventoryHandler);

export default router;
