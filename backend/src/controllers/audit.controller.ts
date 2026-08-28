import { Request, Response } from "express";
import { AuditService } from "@/services/audit.service";

export const getIssueLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AuditService.getIssueLogs(req.params.id as string);
    res.json(logs);
  } catch (error) {
    console.error("GET ISSUE LOGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};