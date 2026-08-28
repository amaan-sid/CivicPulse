import { Request, Response } from "express";
import { SuperAdminService } from "@/services/superadmin.service";
import { SocietyService } from "@/services/society.service";
import { User } from "@/models/user.model";

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const stats = await SuperAdminService.getPlatformStats();
    res.json(stats);
  } catch (error) {
    console.error("GET PLATFORM STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch platform stats" });
  }
};

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await SuperAdminService.getAllOrganizations();
    res.json(orgs);
  } catch (error) {
    console.error("GET ALL ORGANIZATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch organizations" });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, type, address, city, state, totalFlats, adminName, adminEmail, adminPassword } = req.body;

    if (!name || !address || !city || !state || !totalFlats || !adminEmail) {
      return res.status(400).json({ message: "Missing required organization details" });
    }

    const result = await SuperAdminService.createOrganization({
      name,
      type,
      address,
      city,
      state,
      totalFlats,
      adminName,
      adminEmail,
      adminPassword,
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization: result.organization,
      admin: result.admin,
    });
  } catch (error: any) {
    console.error("CREATE ORGANIZATION ERROR:", error);
    res.status(error.message ? 400 : 500).json({
      message: error.message || "Failed to create organization",
    });
  }
};

export const toggleOrganizationStatus = async (req: Request, res: Response) => {
  try {
    const society = await SuperAdminService.toggleOrganizationStatus(req.params.id as string);
    res.json({
      message: `Organization ${society.isActive ? "activated" : "suspended"} successfully`,
      isActive: society.isActive,
    });
  } catch (error: any) {
    console.error("TOGGLE ORG STATUS ERROR:", error);
    res.status(error.message === "Organization not found" ? 404 : 500).json({
      message: error.message || "Failed to toggle organization status",
    });
  }
};

export const promoteSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await SuperAdminService.promoteSuperAdmin(email);
    res.json({ message: `Super Admin status transferred to ${user.name} (${user.email}) successfully` });
  } catch (error: any) {
    console.error("TRANSFER SUPER ADMIN ERROR:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      message: error.message || "Failed to transfer Super Admin status",
    });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const orgId = req.params.id as string;
    await SocietyService.deleteSociety(user.id, orgId);
    res.json({ message: "Organization deleted successfully" });
  } catch (error: any) {
    console.error("DELETE ORGANIZATION ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete organization" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await SuperAdminService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await SuperAdminService.getAllIssues();
    res.json(issues);
  } catch (error) {
    console.error("GET ALL ISSUES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};
