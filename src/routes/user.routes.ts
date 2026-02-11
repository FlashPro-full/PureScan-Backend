import express from "express";
import {
  getTrialStatus,
  acknowledgeTrial,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/trial-status", getTrialStatus);
router.post('/acknowledge-trial', acknowledgeTrial)

export default router;
