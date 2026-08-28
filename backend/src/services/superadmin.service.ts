import { Society } from "@/models/society.model";
import { User } from "@/models/user.model";
import { Membership } from "@/models/membership.model";
import { Issue } from "@/models/issue.model";
import codeGen from "@/utils/codeGenerator";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export class SuperAdminService {
  static async getPlatformStats() {
    const totalOrganizations = await Society.countDocuments();
    const activeOrganizations = await Society.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: "resolved" });
    const breachedIssues = await Issue.countDocuments({ isEscalated: true });

    const orgTypeDistribution = await Society.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalOrganizations,
      activeOrganizations,
      totalUsers,
      totalIssues,
      resolvedIssues,
      breachedIssues,
      orgTypeDistribution,
    };
  }

  static async getAllOrganizations() {
    const organizations = await Society.find().sort({ createdAt: -1 });

    return Promise.all(
      organizations.map(async (org) => {
        const memberCount = await Membership.countDocuments({ societyId: org._id });
        const issueCount = await Issue.countDocuments({ society: org._id });
        const adminMembership = await Membership.findOne({
          societyId: org._id,
          role: "admin",
        }).populate("userId", "name email");

        return {
          _id: org._id,
          name: org.name,
          type: org.type || "SOCIETY",
          address: org.address,
          city: org.city,
          state: org.state,
          totalFlats: org.totalFlats,
          code: org.code,
          isActive: org.isActive !== false,
          memberCount,
          issueCount,
          admin: adminMembership?.userId || null,
          createdAt: org.createdAt,
        };
      })
    );
  }

  static async createOrganization(data: {
    name: string;
    type?: string;
    address: string;
    city: string;
    state: string;
    totalFlats: number;
    adminName?: string;
    adminEmail: string;
    adminPassword?: string;
  }) {
    const adminEmail = data.adminEmail.toLowerCase().trim();
    let adminUser = await User.findOne({ email: adminEmail }).select("+password");

    if (adminUser && adminUser.platformRole === "SUPER_ADMIN") {
      throw new Error("Super Admin cannot be appointed as an organization admin");
    }

    if (!adminUser) {
      if (!data.adminName || !data.adminPassword) {
        throw new Error("Admin name and password required for new admin creation");
      }
    } else {
      if (data.adminPassword) {
        const isMatch = await bcrypt.compare(data.adminPassword, adminUser.password);
        if (!isMatch) {
          throw new Error("Invalid admin password for existing user account");
        }
      }

      if (data.adminName && data.adminName.trim().toLowerCase() !== adminUser.name.trim().toLowerCase()) {
        throw new Error("Admin name does not match existing user account");
      }
    }

    const code = await codeGen();
    let society: any;

    try {
      society = await Society.create({
        name: data.name,
        type: data.type || "SOCIETY",
        address: data.address,
        city: data.city,
        state: data.state,
        totalFlats: Number(data.totalFlats),
        code,
      });

      if (!adminUser) {
        const hashedPassword = await bcrypt.hash(data.adminPassword!, SALT_ROUNDS);
        adminUser = await User.create({
          name: data.adminName,
          email: adminEmail,
          password: hashedPassword,
          currentSocietyId: society._id as any,
        });
      } else {
        if (!adminUser.currentSocietyId) {
          adminUser.currentSocietyId = society._id as any;
          await adminUser.save();
        }
      }

      await Membership.create({
        societyId: society._id,
        userId: adminUser._id,
        role: "admin",
      });
    } catch (error) {
      if (society?._id) {
        await Society.findByIdAndDelete(society._id);
      }
      throw error;
    }

    return {
      organization: society,
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
      },
    };
  }

  static async toggleOrganizationStatus(orgId: string) {
    const society = await Society.findById(orgId);
    if (!society) {
      throw new Error("Organization not found");
    }

    society.isActive = !society.isActive;
    await society.save();
    return society;
  }

  static async promoteSuperAdmin(email: string) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new Error("User not found");
    }

    await User.updateMany({ platformRole: "SUPER_ADMIN" }, { platformRole: "USER" });
    user.platformRole = "SUPER_ADMIN";
    await user.save();
    return user;
  }

  static async getAllUsers() {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return Promise.all(
      users.map(async (user) => {
        const memberships = await Membership.find({ userId: user._id }).populate("societyId", "name code type");

        const societies = memberships.map((m: any) => ({
          societyId: m.societyId?._id,
          societyName: m.societyId?.name || "Unassigned",
          societyCode: m.societyId?.code || "N/A",
          societyType: m.societyId?.type || "SOCIETY",
          role: m.role
        }));

        const primaryRole = user.platformRole === "SUPER_ADMIN"
          ? "SUPER_ADMIN"
          : (memberships[0]?.role || "resident");

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          platformRole: user.platformRole,
          primaryRole,
          isActive: user.isActive !== false,
          societies,
          createdAt: user.createdAt
        };
      })
    );
  }

  static async getAllIssues() {
    const issues = await Issue.find()
      .populate("society", "name code type")
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return issues;
  }
}
