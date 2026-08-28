import { Request, Response } from "express";
import { UserService } from "@/services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role = "resident" } = req.query;
    const user = req.user;

    const users = await UserService.getUsersBySocietyAndRole(
      user.society,
      role as string
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};