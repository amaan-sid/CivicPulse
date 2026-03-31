import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, type IUser } from "../models/user.model";
import { Society } from "../models/society.model";

const JWT_COOKIE_NAME = "token";
const JWT_EXPIRES_IN = "7d";
const JWT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const ALLOWED_ROLES = new Set(["resident", "staff", "admin"]);

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: IUser["role"];
  flatNumber?: string;
  societyLabel?: string;
  society?: string;
  societyResolved: boolean;
};

const normalizeEmail = (email: unknown) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const normalizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isProduction = process.env.NODE_ENV === "production";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return process.env.JWT_SECRET;
};

const toSafeUser = (user: IUser): SafeUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  flatNumber: user.flatNumber,
  societyLabel: user.societyLabel,
  society: user.society?.toString(),
  societyResolved: Boolean(user.society)
});

const setAuthCookie = (res: Response, user: IUser) => {
  const token = jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      society: user.society?.toString()
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: JWT_MAX_AGE_MS
  });
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const firstValidationError = Object.values(error.errors)[0];
    return firstValidationError?.message || fallback;
  }

  if (error instanceof mongoose.Error.CastError) {
    return `Invalid ${error.path} value.`;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return "An account with this email already exists.";
  }

  return fallback;
};

const getErrorStatus = (error: unknown) => {
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return 400;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return 409;
  }

  return 500;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveSocietyId = async (societyInput: string) => {
  if (!societyInput) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(societyInput)) {
    const societyById = await Society.findById(societyInput).select("_id");

    if (societyById) {
      return societyById._id.toString();
    }
  }

  const exactMatchPattern = new RegExp(`^${escapeRegex(societyInput)}$`, "i");
  const societyByCodeOrName = await Society.findOne({
    $or: [{ code: exactMatchPattern }, { name: exactMatchPattern }]
  }).select("_id");

  return societyByCodeOrName?._id.toString() ?? null;
};

export const signup = async (req: Request, res: Response) => {
  try {
    const name = normalizeString(req.body?.name);
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const role = normalizeString(req.body?.role) || "resident";
    const flatNumber = normalizeString(req.body?.flatNumber);
    const society = normalizeString(req.body?.society);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (!ALLOWED_ROLES.has(role)) {
      return res.status(400).json({ message: "Invalid role supplied." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    if ((role === "resident" || role === "staff") && !society) {
      return res.status(400).json({ message: "Society ID is required for resident and staff accounts." });
    }

    if (role === "resident" && !flatNumber) {
      return res.status(400).json({ message: "Flat number is required for resident accounts." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    let resolvedSocietyId = "";

    if (society) {
      const societyId = await resolveSocietyId(society);

      if (!societyId) {
        resolvedSocietyId = "";
      }
      else {
        resolvedSocietyId = societyId;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(flatNumber ? { flatNumber } : {}),
      ...(society ? { societyLabel: society } : {}),
      ...(resolvedSocietyId ? { society: resolvedSocietyId } : {})
    });

    setAuthCookie(res, newUser);

    return res.status(201).json({
      message: resolvedSocietyId
        ? "User created successfully."
        : "User created successfully. Your society will need to be linked before society-specific features are available.",
      user: toSafeUser(newUser)
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res
      .status(getErrorStatus(error))
      .json({ message: getErrorMessage(error, "Signup failed.") });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account is inactive." });
    }

    setAuthCookie(res, user);

    return res.status(200).json({
      message: "Login successful.",
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed." });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction
  });

  return res.status(200).json({ message: "Logout successful." });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch current user." });
  }
};
