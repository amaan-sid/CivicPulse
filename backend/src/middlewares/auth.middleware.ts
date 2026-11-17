import { Request, Response, NextFunction } from "express";
import { User } from "@/models/user.model";
import { Membership } from "@/models/membership.model";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;

    const user = await User.findById(decoded.id).select("_id currentSocietyId platformRole");

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
      platformRole: user.platformRole || "USER",
    };

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
