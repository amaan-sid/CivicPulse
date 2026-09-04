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

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await UserService.getProfile(userId);
    res.json(profile);
  } catch (error: any) {
    console.error("GET PROFILE ERROR:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      message: error.message || "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, username, profilePic, gender } = req.body;

    const updatedUser = await UserService.updateProfile(userId, {
      name,
      username,
      profilePic,
      gender,
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(error.message?.includes("Username") ? 400 : 500).json({
      message: error.message || "Failed to update profile",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    const result = await UserService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.json(result);
  } catch (error: any) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(
      error.message?.includes("password") || error.message?.includes("required")
        ? 400
        : 500
    ).json({
      message: error.message || "Failed to change password",
    });
  }
};