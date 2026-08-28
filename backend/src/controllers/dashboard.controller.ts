import { Request, Response } from "express";
import { DashboardService } from "@/services/dashboard.service";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { society } = req.user!;
    const stats = await DashboardService.getStats(society);
    res.json(stats);
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};