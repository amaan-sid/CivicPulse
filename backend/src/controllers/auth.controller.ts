import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Society } from "../models/society.model";

const JWT_SECRET = process.env.JWT_SECRET as string;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, flatNumber, society } = req.body;

    if (!name || !email || !password ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email});
    if (existingUser) {
      return res.status(400).json({ message: "User already exists in this society" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    //if the provided name for society matches that of any society in the database then we can assign that society's object Id to the current user
    const societyDoc = await Society.findOne({ name: society }, '_id');

    const societyId = societyDoc?._id;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "resident",
      flatNumber,
      society: societyId
    });

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        society: newUser.society
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};


// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        society: user.society
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};


// LOGOUT
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  res.json({ message: "Logout successful" });
};