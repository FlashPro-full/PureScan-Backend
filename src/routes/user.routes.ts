import express from "express";
import {
  getTeam,
  getPreferences,
  updatePreferences,
  getTrialStatus,
  acknowledgeTrial,
} from "../controllers/user.controller";

import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/team", requireAdmin, getTeam);
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);
router.get("/trial-status", getTrialStatus);
router.post('/acknowledge-trial', acknowledgeTrial)

export default router;
