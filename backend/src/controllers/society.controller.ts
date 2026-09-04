import { Request, Response } from "express";
import { SocietyService } from "@/services/society.service";
import { IssueService } from "@/services/issue.service";
import { Society } from "@/models/society.model";
import { Issue } from "@/models/issue.model";
import { Membership } from "@/models/membership.model";

export const createSociety = async (req: Request, res: Response) => {
  try {
    const { name, address, city, state, totalFlats, type } = req.body;
    if (!name || !address || !city || !state || !totalFlats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await SocietyService.createSociety(user.id, {
      name,
      address,
      city,
      state,
      totalFlats,
      type,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("CREATE SOCIETY ERROR:", error);
    res.status(500).json({ message: "Failed to create society" });
  }
};

export const joinSociety = async (req: Request, res: Response) => {
  const { societyCode } = req.body;

  try {
    if (!societyCode) {
      return res.status(400).json({ message: "Society code is required" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.platformRole === "SUPER_ADMIN") {
      return res.status(403).json({ message: "Super Admin accounts manage the platform and cannot join organizations as members or appoint themselves as admins." });
    }

    const result = await SocietyService.joinSociety(user.id, societyCode);

    res.json({
      message: "Society Joined",
      currentSocietyId: result.currentSocietyId,
      memberships: result.memberships,
    });
  } catch (error: any) {
    console.error("JOIN SOCIETY ERROR:", error);
    const statusCode =
      error.message === "Society not found"
        ? 404
        : error.message?.includes("already joined")
        ? 400
        : 500;
    res.status(statusCode).json({
      message: error.message || "Failed to join society",
    });
  }
};

export const changeCurrentSociety = async (req: Request, res: Response) => {
  try {
    const { societyId } = req.body;
    if (!societyId) {
      return res.status(400).json({ message: "Society id is required" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await SocietyService.changeCurrentSociety(user.id, societyId);

    res.json(result);
  } catch (error: any) {
    console.error("CHANGE SOCIETY ERROR:", error);
    res.status(error.message === "You are not part of this society" ? 403 : 500).json({
      message: error.message || "Failed to change society",
    });
  }
};

export const getResidents = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const targetSocietyId = (req.query.societyId || req.body?.societyId || user.society) as string;

    if (!targetSocietyId) {
      return res.status(400).json({ message: "No organization selected" });
    }
    const allowedRoles = ["admin", "member", "staff"];
    if (!allowedRoles.includes(user.role || "") && user.platformRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const residents = await SocietyService.getResidents(targetSocietyId);
    res.json(residents);
  } catch (error) {
    console.error("GET RESIDENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch residents" });
  }
};

export const updateSociety = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const targetSocietyId = (req.body.societyId || req.query.societyId || user?.society) as string;

    if (!targetSocietyId) {
      return res.status(400).json({ message: "No organization selected" });
    }
    if (user?.role !== "admin" && user?.platformRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedFields = ["name", "address", "city", "state", "totalFlats"];
    const updates: any = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = key === "totalFlats" ? Number(req.body[key]) : req.body[key];
      }
    }

    const society = await SocietyService.updateSociety(targetSocietyId, updates);
    res.json(society);
  } catch (err) {
    console.error("UPDATE SOCIETY ERROR:", err);
    res.status(500).json({ message: "Failed to update society" });
  }
};

export const updateResident = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, societyId } = req.body;
    const user = req.user;

    const targetSocietyId = (societyId || req.query.societyId || user?.society) as string;

    if (!targetSocietyId) {
      return res.status(400).json({ message: "No organization selected" });
    }
    if (user?.role !== "admin" && user?.platformRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    await SocietyService.updateResidentRole(user.id, id as string, targetSocietyId, role);
    res.json({ message: "Resident updated" });
  } catch (err: any) {
    console.error("UPDATE RESIDENT ERROR:", err);
    res.status(err.message === "You cannot demote yourself" ? 400 : 500).json({
      message: err.message || "Failed to update resident",
    });
  }
};

export const removeResident = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const targetSocietyId = (req.body?.societyId || req.query?.societyId || user?.society) as string;

    if (!targetSocietyId) {
      return res.status(400).json({ message: "No organization selected" });
    }
    if (user?.role !== "admin" && user?.platformRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    await SocietyService.removeResident(user.id, id as string, targetSocietyId);
    res.json({ message: "Resident removed" });
  } catch (err: any) {
    console.error("REMOVE RESIDENT ERROR:", err);
    res.status(err.message === "You cannot remove yourself" ? 400 : 500).json({
      message: err.message || "Failed to remove resident",
    });
  }
};

export const getCurrentSociety = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!user.society) {
      return res.status(400).json({ message: "No society selected" });
    }

    const society = await Society.findById(user.society);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const adminMembership = await Membership.findOne({
      societyId: society._id,
      role: "admin"
    }).populate("userId", "name email profilePic gender");

    const admin = adminMembership && typeof adminMembership.userId === "object" ? adminMembership.userId : null;

    res.json({
      ...society.toObject(),
      admin
    });
  } catch (error) {
    console.error("GET CURRENT SOCIETY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch society" });
  }
};

export const getSocietyIssues = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const issues = await IssueService.getSocietyIssues(id);
    res.json(issues);
  } catch (error) {
    console.error("GET SOCIETY ISSUES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch society issues" });
  }
};

export const getSocietyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const society = await Society.findById(id);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const adminMembership = await Membership.findOne({
      societyId: society._id,
      role: "admin"
    }).populate("userId", "name email profilePic gender");

    const admin = adminMembership && typeof adminMembership.userId === "object" ? adminMembership.userId : null;

    res.json({
      ...society.toObject(),
      admin
    });
  } catch (error) {
    console.error("GET SOCIETY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch society" });
  }
};

export const deleteSociety = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const targetSocietyId = (req.body?.societyId || req.query?.societyId || req.params?.id || user?.society) as string;

    if (!targetSocietyId) {
      return res.status(400).json({ message: "No organization selected" });
    }
    if (user?.role !== "admin" && user?.platformRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    await SocietyService.deleteSociety(user.id, targetSocietyId);
    res.json({ message: "Society deleted successfully" });
  } catch (error) {
    console.error("DELETE SOCIETY ERROR:", error);
    res.status(500).json({ message: "Failed to delete society" });
  }
};

export const getMyAdminOrganizations = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const memberships = await Membership.find({ userId: user.id, role: "admin" }).populate("societyId");

    const orgs = await Promise.all(
      memberships.map(async (m: any) => {
        const soc = m.societyId;
        if (!soc || typeof soc === "string") return null;
        const memberCount = await Membership.countDocuments({ societyId: soc._id });
        const issueCount = await Issue.countDocuments({ society: soc._id });
        return {
          ...soc.toObject(),
          memberCount,
          issueCount,
        };
      })
    );

    res.json(orgs.filter(Boolean));
  } catch (error) {
    console.error("GET MY ADMIN ORGANIZATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch admin organizations" });
  }
};

export const getMyJoinedSocieties = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const memberships = await Membership.find({ userId: user.id }).populate("societyId");

    const orgs = await Promise.all(
      memberships.map(async (m: any) => {
        const soc = m.societyId;
        if (!soc || typeof soc === "string") return null;
        const memberCount = await Membership.countDocuments({ societyId: soc._id });
        const issueCount = await Issue.countDocuments({ society: soc._id });
        const adminMembership = await Membership.findOne({
          societyId: soc._id,
          role: "admin",
        }).populate("userId", "name email profilePic gender");

        const admin = adminMembership && typeof adminMembership.userId === "object" ? adminMembership.userId : null;

        return {
          ...soc.toObject(),
          admin,
          myRole: m.role,
          memberCount,
          issueCount,
        };
      })
    );

    res.json(orgs.filter(Boolean));
  } catch (error) {
    console.error("GET MY JOINED SOCIETIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch joined societies" });
  }
};