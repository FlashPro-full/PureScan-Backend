import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  findTeam,
  findUserByCondition,
  updateUser,
} from "../services/user.service";
import { findSubscriptionByUserId } from "../services/subscription.service";

export const getTeam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const team = await findTeam(Number(userId));

    res.status(200).json({
      result: true,
      team: team,
    });
  } catch (error: any) {
    console.error("Get team error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get team",
    });
  }
};

export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    let preferences = await findUserByCondition({
      id: Number(userId),
    });

    res.status(200).json({
      result: true,
      preferences: preferences,
    });
  } catch (error: any) {
    console.error("Get preferences error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get preferences",
    });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updates = req.body;

    await updateUser({ id: Number(userId), ...updates });

    res.status(200).json({
      result: true,
      message: "Preferences updated successfully",
    });
  } catch (error: any) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to update preferences",
    });
  }
};

export const getTrialStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const subscription = await findSubscriptionByUserId(Number(userId));

    if (!subscription) {
      return res.status(200).json({ status: "expired" });
    }

    const now = new Date();
    const subStatus = (subscription.status || "").toLowerCase();

    if (subStatus === "trialing" && subscription.expiresAt) {
      const end = new Date(subscription.expiresAt);
      if (end > now) {
        const daysLeft = Math.ceil(
          (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return res.status(200).json({ status: "trialing", daysLeft });
      }
      return res.status(200).json({ status: "expired" });
    }

    if (subStatus === "active" || subStatus === "past_due") {
      return res.status(200).json({ status: "active" });
    }

    if (subscription.expiresAt && new Date(subscription.expiresAt) <= now) {
      return res.status(200).json({ status: "expired" });
    }

    return res.status(200).json({ status: "expired" });
  } catch (error: any) {
    console.error("Get trial status error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get trial status",
    });
  }
};
