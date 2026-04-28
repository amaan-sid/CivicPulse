import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Membership } from "../models/membership.model";

const JWT_SECRET = process.env.JWT_SECRET as string;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const isProd = process.env.NODE_ENV === "production";

const buildAuthUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) return null;

  const memberships = await Membership.find({
    userId: user._id
  }).select("societyId role").populate("societyId", "name code");

  const currentMembership = memberships.find((membership) => {
    const societyId = (membership.societyId as any)._id || membership.societyId;
    return societyId.toString() === user.currentSocietyId?.toString();
  }) || memberships[0];

  const currentSocietyId = currentMembership
    ? ((currentMembership.societyId as any)._id || currentMembership.societyId)
    : user.currentSocietyId;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    currentSocietyId: currentSocietyId?.toString(),
    memberships,
    role: currentMembership?.role
  };
};

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password} = req.body;

    if (!name || !email || !password ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email});
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
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
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const authUser = await buildAuthUser(user._id.toString());

    res.json({
      message: "Login successful",
      user: authUser
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};


// ME
export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const authUser = await buildAuthUser(decoded.id);

    if (!authUser) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: authUser });
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};


// LOGOUT
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  });

  res.json({ message: "Logout successful" });
};