import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Membership } from "../models/membership.model";
import jwt from "jsonwebtoken";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findById(decoded.id).select("_id currentSocietyId");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const memberships = await Membership.find({ userId: user._id }).select("societyId role");
    const currentMembership =
      memberships.find((membership) => (
        membership.societyId.toString() === user.currentSocietyId?.toString()
      )) || memberships[0];

    req.user = {
      id: user._id.toString(),
      society: currentMembership?.societyId.toString(),
      role: currentMembership?.role,
    };

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
