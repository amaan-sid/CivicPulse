import { Request, Response } from "express";
import { User } from "../models/user.model";

const ALLOWED_ROLES = new Set(["resident", "staff", "admin"]);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const role = typeof req.query.role === "string" ? req.query.role.trim().toLowerCase() : "";
    const filter = role && ALLOWED_ROLES.has(role) ? { role } : {};

    const users = await User.find(filter)
      .select("-password")
      .populate("society", "name code")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
