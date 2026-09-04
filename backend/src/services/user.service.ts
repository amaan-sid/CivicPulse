import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import { AuthService } from "@/services/auth.service";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export class UserService {
  static async getUsersBySocietyAndRole(societyId: string, role?: string) {
    const query: any = { societyId };
    if (role) {
      query.role = role;
    }
    return Membership.find(query).populate("userId", "_id name email profilePic role gender");
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const authUser = await AuthService.buildAuthUser(userId);
    return authUser;
  }

  static async updateProfile(
    userId: string,
    data: { name?: string; username?: string; profilePic?: string; gender?: "male" | "female" }
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (data.username) {
      const normalizedUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (!normalizedUsername) {
        throw new Error("Username cannot be empty and must contain alphanumeric characters or underscores");
      }

      const existingUser = await User.findOne({
        username: normalizedUsername,
        _id: { $ne: userId }
      });

      if (existingUser) {
        throw new Error("Username is already taken");
      }

      user.username = normalizedUsername;
    }

    if (data.name && data.name.trim()) {
      user.name = data.name.trim();
    }

    if (data.gender !== undefined) {
      user.gender = data.gender === "female" ? "female" : "male";
    }

    if (data.profilePic !== undefined) {
      if (data.profilePic && data.profilePic.startsWith("data:image")) {
        try {
          if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
            const uploadRes = await cloudinary.uploader.upload(data.profilePic, {
              folder: "civicpulse/avatars",
              transformation: [{ width: 400, height: 400, crop: "fill" }]
            });
            user.profilePic = uploadRes.secure_url;
          } else {
            user.profilePic = data.profilePic;
          }
        } catch (uploadError) {
          console.error("Cloudinary profile pic upload error:", uploadError);
          user.profilePic = data.profilePic;
        }
      } else {
        user.profilePic = data.profilePic;
      }
    }

    await user.save();

    const updatedAuthUser = await AuthService.buildAuthUser(userId);
    return updatedAuthUser;
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
      throw new Error("Both current and new passwords are required");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password changed successfully" };
  }
}
