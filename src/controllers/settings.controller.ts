import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { selectScanListByFromTo } from "../services/scan.service";
import { findSubscriptionByUserId, updateSubscription } from "../services/subscription.service";
import { findPreferenceByUserId, updatePreference } from "../services/preference.service";

export const getSubscriptionHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    let subscription = await findSubscriptionByUserId(Number(userId));

    res.status(200).json({
      result: true,
      subscription: subscription,
    });
  } catch (error: any) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get subscription",
    });
  }
};

export const updateSubscriptionHandler = async (req: Request, res: Response) => {
  try {
    const { subscription } = req.body;

    await updateSubscription(subscription);

    res.status(200).json({
      result: true,
      message: "Subscription updated successfully",
    });
  }
  catch (error: any) {
    console.error("Update subscription error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to update subscription",
    });
  }
};

export const exportDataHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fromDate, toDate } = req.body;

    const scanList = await selectScanListByFromTo(Number(userId), new Date(fromDate), new Date(toDate));

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="scans-${Date.now()}.json"`
    );
    res.status(200).json({
      result: true,
      scanList: scanList,
    });
  } catch (error: any) {
    console.error("Export data error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to export data",
    });
  }
};

export const getPreferencesHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const preference = await findPreferenceByUserId(Number(userId));

    res.status(200).json({
      result: true,
      preference
    });
  }
  catch (error: any) {
    console.error("Get preferences error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get preferences",
    });
  }
};

export const updatePreferencesHandler = async (req: Request, res: Response) => {
  try {
    const { preference } = req.body;

    await updatePreference(preference);

    res.status(200).json({
      result: true,
      message: "Preferences updated successfully",
    });
  }
  catch (error: any) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to update preferences",
    });
  }
};