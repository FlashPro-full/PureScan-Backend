import express from "express";
import {
  getSubscriptionHandler,
  exportDataHandler,
  getPreferencesHandler,
  updatePreferencesHandler,
  updateSubscriptionHandler,
} from "../controllers/settings.controller";

const router = express.Router();

router.get("/subscription", getSubscriptionHandler);
router.put("/subscription", updateSubscriptionHandler);
router.get("/export", exportDataHandler);
router.get("/preferences", getPreferencesHandler);
router.put("/preferences", updatePreferencesHandler);

export default router;
