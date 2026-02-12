import express from "express";
import {
  getSubscriptionHandler,
  exportDataHandler,
  getPreferencesHandler,
  updatePreferencesHandler,
  updateSubscriptionHandler,
  getProductConditionHandler,
  setProductConditionHandler,
} from "../controllers/settings.controller";

const router = express.Router();

router.get("/subscription", getSubscriptionHandler);
router.put("/subscription", updateSubscriptionHandler);
router.get("/export", exportDataHandler);
router.get("/preferences", getPreferencesHandler);
router.put("/preferences", updatePreferencesHandler);
router.get("/condition", getProductConditionHandler);
router.put("/condition", setProductConditionHandler);

export default router;
