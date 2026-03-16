import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized." });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      role: string;
      society?: string;
    };

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive." });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      society: user.society?.toString() ?? "",
      societyLabel: user.societyLabel
    };

    return next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
};
