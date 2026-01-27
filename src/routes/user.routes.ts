import express from "express";
import {
  getTeam,
  getPreferences,
  updatePreferences,
} from "../controllers/user.controller";

import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/team", authenticate, requireAdmin, getTeam);
router.get("/preferences", authenticate, getPreferences);
router.put("/preferences", authenticate, updatePreferences);

export default router;
