import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "@/services/auth.service";
import { ENV } from "@/config/env";

const isProd = process.env.NODE_ENV === "production";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, profilePic, gender } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields (name, username, email, password)" });
    }

    const { newUser, token } = await AuthService.signup({ name, username, email, password, profilePic, gender });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic || "",
        gender: newUser.gender || "male",
        platformRole: newUser.platformRole,
      },
      token,
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);
    res.status(400).json({ message: error.message || "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginIdentifier = identifier || email || username;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const { authUser, token } = await AuthService.login({ identifier: loginIdentifier, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: authUser,
      token,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    res.status(400).json({ message: error.message || "Login failed" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
    const authUser = await AuthService.buildAuthUser(decoded.id);

    if (!authUser) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: authUser });
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  res.json({ message: "Logout successful" });
};