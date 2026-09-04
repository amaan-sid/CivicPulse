import { Society } from "@/models/society.model";
import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import { Issue } from "@/models/issue.model";
import codeGen from "@/utils/codeGenerator";
import { Types } from "mongoose";

export class SocietyService {
  static async createSociety(userId: string, data: { name: string; address: string; city: string; state: string; totalFlats: number; type?: "SOCIETY" | "HOSTEL" | "CAMPUS" }) {
    const code = await codeGen();

    const society = await Society.create({
      type: data.type || "SOCIETY",
      ...data,
      code,
    });

    await Membership.create({
      societyId: society._id as Types.ObjectId,
      userId,
      role: "admin",
    });

    await User.findByIdAndUpdate(userId, {
      currentSocietyId: society._id,
    });

    const memberships = await Membership.find({ userId })
      .select("societyId role")
      .populate("societyId", "name code");

    return {
      currentSocietyId: society.id,
      memberships,
    };
  }

  static async joinSociety(userId: string, societyCode: string) {
    const society = await Society.findOne({ code: societyCode });
    if (!society) {
      throw new Error("Society not found");
    }

    const existing = await Membership.findOne({
      userId,
      societyId: society._id,
    });

    if (existing) {
      throw new Error("You are already joined in this organization");
    }

    await Membership.create({
      userId,
      societyId: society._id,
      role: "resident",
    });

    await User.findByIdAndUpdate(userId, {
      currentSocietyId: society._id,
    });

    const memberships = await Membership.find({ userId })
      .select("societyId role")
      .populate("societyId", "name code");

    return {
      isExisting: Boolean(existing),
      currentSocietyId: society.id,
      memberships,
    };
  }

  static async changeCurrentSociety(userId: string, societyId: string) {
    const membership = await Membership.findOne({
      userId,
      societyId,
    });

    if (!membership) {
      throw new Error("You are not part of this society");
    }

    await User.findByIdAndUpdate(userId, {
      currentSocietyId: societyId,
    });

    const memberships = await Membership.find({ userId })
      .select("societyId role")
      .populate("societyId", "name code");

    return {
      currentSocietyId: societyId,
      role: membership.role,
      memberships,
    };
  }

  static async getResidents(societyId: string) {
    const memberships = await Membership.find({ societyId }).populate("userId", "name email profilePic gender");

    return memberships
      .filter((m) => m.userId != null)
      .map((m) => {
        const u = m.userId as any;
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          profilePic: u.profilePic || "",
          gender: u.gender || "male",
          role: m.role,
          flatNumber: (m as any).flatNumber || "",
        };
      });
  }

  static async updateSociety(societyId: string, updates: Record<string, any>) {
    return Society.findByIdAndUpdate(societyId, updates, { new: true });
  }

  static async updateResidentRole(userId: string, targetUserId: string, societyId: string, role: string) {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      throw new Error("Resident user not found");
    }

    if (targetUser.platformRole === "SUPER_ADMIN" && role === "admin") {
      throw new Error("Super Admin cannot be appointed as an organization admin");
    }

    const membership = await Membership.findOne({
      userId: targetUserId,
      societyId,
    });

    if (!membership) {
      throw new Error("Resident not found");
    }

    if (targetUserId === userId && role && role !== "admin") {
      throw new Error("You cannot demote yourself");
    }

    if (role) membership.role = role as any;
    await membership.save();
    return membership;
  }

  static async removeResident(userId: string, targetUserId: string, societyId: string) {
    if (targetUserId === userId) {
      throw new Error("You cannot remove yourself");
    }

    const membership = await Membership.findOne({
      userId: targetUserId,
      societyId,
    });

    if (!membership) {
      throw new Error("Resident not found");
    }

    await membership.deleteOne();
  }

  static async deleteSociety(userId: string, societyId: string) {
    await Society.findByIdAndDelete(societyId);
    await Membership.deleteMany({ societyId });
    await Issue.deleteMany({ society: societyId });
    await User.findByIdAndUpdate(userId, { $unset: { currentSocietyId: 1 } });
  }
}
