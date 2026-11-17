import { AuditLog } from "../models/audit.model";
import { Request, Response } from "express";

export const getIssueLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AuditLog.find({ issue: req.params.id })
      .populate("performedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error("GET ISSUE LOGS ERROR:",error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};