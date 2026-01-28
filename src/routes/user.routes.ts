import express from "express";
import {
  getTeam,
  getPreferences,
  updatePreferences,
  getTrialStatus,
  acknowledgeTrial,
} from "../controllers/user.controller";

import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/team", authenticate, requireAdmin, getTeam);
router.get("/preferences", authenticate, getPreferences);
router.put("/preferences", authenticate, updatePreferences);
router.get("/trial-status", authenticate, getTrialStatus);
router.post('/acknowledge-trial', authenticate, acknowledgeTrial)

export default router;
