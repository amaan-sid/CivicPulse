import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { Membership } from "@/models/membership.model";
import { ENV } from "@/config/env";

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
      email: user.email,
      platformRole: user.platformRole || "USER",
      currentSocietyId: currentSocietyId?.toString(),
      memberships,
      role: currentMembership?.role,
    };
  }

  static async signup({ name, email, password }: Record<string, string>) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      platformRole: isFirstUser ? "SUPER_ADMIN" : "USER",
    });

    const token = jwt.sign({ id: newUser._id }, ENV.JWT_SECRET, { expiresIn: "7d" });

    return { newUser, token };
  }

  static async login({ email, password }: Record<string, string>) {
    const user = await User.findOne({ email }).select("+password");
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
