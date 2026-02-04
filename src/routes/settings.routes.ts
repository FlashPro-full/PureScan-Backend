import express from "express";
import {
  getSubscription,
  exportData,
} from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/subscription", getSubscription);
router.get("/export", exportData);

export default router;
