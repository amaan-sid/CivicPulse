import { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.platformRole === "SUPER_ADMIN" || (req.user.role && roles.includes(req.user.role))) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  };
};

export const authorizePlatform = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.platformRole || "USER")) {
      return res.status(403).json({ message: "Access denied. Super Admin required." });
    }
    next();
  };
};