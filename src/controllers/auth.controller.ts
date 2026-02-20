import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByCondition,
  saveUser,
  updateUser,
} from "../services/user.service";
import { createSubscription } from "../services/subscription.service";
import {
  sendPasswordResetEmail,
  isSMTPConfigured,
} from "../third-party/email.service";
import { savePreference } from "../services/preference.service";

const resetCodes = new Map<string, { code: string; expiresAt: number }>();

const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const cleanupExpiredCodes = () => {
  const now = Date.now();
  for (const [email, data] of resetCodes.entries()) {
    if (data.expiresAt < now) {
      resetCodes.delete(email);
    }
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        result: false,
        error: "Email and password are required",
      });
    }

    const existingUser = await findUserByCondition({ email });

    if (existingUser) {
      return res.status(400).json({
        result: false,
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email: email,
      password: hashedPassword,
      name: name || email.split("@")[0],
    };

    const savedUser = await saveUser(user);
    await createSubscription(savedUser.id);
    await savePreference(savedUser.id);

    res.status(200).json({
      result: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      result: false,
      error: "Registration failed",
    });
  }
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        result: false,
        error: "Email is required",
      });
    }

    if (!isSMTPConfigured()) {
      return res.status(501).json({
        result: false,
        error: "Not Implemented",
      });
    }

    cleanupExpiredCodes();

    const user = await findUserByCondition({ email });

    if (!user) {
      return res.status(404).json({
        result: false,
        error: "User not found",
      });
    }

    const code = generateResetCode();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    resetCodes.set(email.toLowerCase(), { code, expiresAt });

    try {
      await sendPasswordResetEmail(email, code);
    } catch (error: any) {
      console.error("Failed to send email:", error);
      resetCodes.delete(email.toLowerCase());
      return res
        .status(500)
        .json({ error: "Failed to send reset code. Please try again later." });
    }

    res.status(200).json({
      result: true,
      message: "If the email exists, a reset code has been sent",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to process password reset request",
    });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        result: false,
        error: "Email and code are required",
      });
    }

    if (!isSMTPConfigured()) {
      return res.status(501).json({
        result: false,
        error: "Not Implemented",
      });
    }

    cleanupExpiredCodes();

    const storedData = resetCodes.get(email.toLowerCase());

    if (!storedData) {
      return res.status(400).json({
        result: false,
        error: "Invalid or expired verification code",
      });
    }

    if (storedData.expiresAt < Date.now()) {
      resetCodes.delete(email.toLowerCase());
      return res.status(400).json({
        result: false,
        error: "Verification code has expired",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        result: false,
        error: "Invalid verification code",
      });
    }

    const user = await findUserByCondition({ email });

    if (!user) {
      return res.status(404).json({
        result: false,
        error: "User not found",
      });
    }

    resetCodes.delete(email.toLowerCase());

    res.status(200).json({
      result: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Verify error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to verify email",
    });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        result: false,
        error: "Email and password are required"
      });
    }

    const user = await findUserByCondition({ email });

    if (!user) {
      return res.status(404).json({
        result: false,
        error: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        result: false,
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: rememberMe ? "30d" : "7d",
      }
    );

    res.status(200).json({
      result: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      result: false,
      error: "Login failed",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await findUserByCondition({ id: userId });

    if (!user) {
      return res.status(404).json({
        result: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      result: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to get user",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        result: false,
        error: "Email, code, and new password are required",
      });
    }

    if (!isSMTPConfigured()) {
      return res.status(501).json({
        result: false,
        error: "Not Implemented",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        result: false,
        error: "Password must be at least 8 characters long",
      });
    }

    cleanupExpiredCodes();

    const storedData = resetCodes.get(email.toLowerCase());

    if (!storedData) {
      return res.status(400).json({
        result: false,
        error: "Invalid or expired reset code",
      });
    }

    if (storedData.expiresAt < Date.now()) {
      resetCodes.delete(email.toLowerCase());
      return res.status(400).json({
        result: false,
        error: "Reset code has expired",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        result: false,
        error: "Invalid reset code",
      });
    }

    const user = await findUserByCondition({ email });

    if (!user) {
      return res.status(404).json({
        result: false,
        error: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await updateUser({ id: Number(user.id), password: hashedPassword });

    resetCodes.delete(email.toLowerCase());

    res.status(200).json({
      result: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({
      result: false,
      error: "Failed to reset password",
    });
  }
};
