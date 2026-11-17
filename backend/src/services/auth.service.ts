import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { Membership } from "@/models/membership.model";
import { ENV } from "@/config/env";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export class AuthService {
  static async buildAuthUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) return null;

    const memberships = await Membership.find({
      userId: user._id,
    })
      .select("societyId role")
      .populate("societyId", "name code");

    const currentMembership =
      memberships.find((membership) => {
        const societyId = (membership.societyId as any)._id || membership.societyId;
        return societyId.toString() === user.currentSocietyId?.toString();
      }) || memberships[0];

    const currentSocietyId = currentMembership
      ? (currentMembership.societyId as any)._id || currentMembership.societyId
      : user.currentSocietyId;

    return {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || "",
      gender: user.gender || "male",
      platformRole: user.platformRole || "USER",
      currentSocietyId: currentSocietyId?.toString(),
      memberships,
      role: currentMembership?.role,
    };
  }

  static async signup({ name, username, email, password, profilePic, gender }: Record<string, string>) {
    if (!username || !username.trim()) {
      throw new Error("Username is required");
    }

    const cleanedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!cleanedUsername) {
      throw new Error("Username must contain alphanumeric characters or underscores");
    }

    if (cleanedUsername.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    const existingUsername = await User.findOne({ username: cleanedUsername });
    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    let finalProfilePic = "";
    if (profilePic && profilePic.trim()) {
      if (profilePic.startsWith("data:image")) {
        try {
          if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
            const uploadRes = await cloudinary.uploader.upload(profilePic, {
              folder: "civicpulse/avatars",
              transformation: [{ width: 400, height: 400, crop: "fill" }],
            });
            finalProfilePic = uploadRes.secure_url;
          } else {
            finalProfilePic = profilePic;
          }
        } catch (uploadError) {
          console.error("Cloudinary signup profile pic upload error (falling back to direct image):", uploadError);
          finalProfilePic = profilePic;
        }
      } else {
        finalProfilePic = profilePic;
      }
    }

    const normalizedGender = gender === "female" ? "female" : "male";

    const newUser = await User.create({
      name: name.trim(),
      username: cleanedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      profilePic: finalProfilePic,
      gender: normalizedGender,
      platformRole: isFirstUser ? "SUPER_ADMIN" : "USER",
    });

    const token = jwt.sign({ id: newUser._id }, ENV.JWT_SECRET, { expiresIn: "7d" });

    return { newUser, token };
  }

  static async login({ email, identifier, password }: Record<string, string>) {
    const rawIdentifier = (identifier || email || "").toLowerCase().trim();
    if (!rawIdentifier || !password) {
      throw new Error("Missing credentials");
    }

    const user = await User.findOne({
      $or: [
        { email: rawIdentifier },
        { username: rawIdentifier }
      ]
    }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: "7d" });
    const authUser = await this.buildAuthUser(user._id.toString());

    return { authUser, token };
  }
}
