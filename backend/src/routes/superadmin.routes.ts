import { Router } from "express";
import {
  getPlatformStats,
  getAllOrganizations,
  createOrganization,
  toggleOrganizationStatus,
  deleteOrganization,
  promoteSuperAdmin,
  getAllUsers,
  getAllIssues
} from "@/controllers/superadmin.controller";
import { protect } from "@/middlewares/auth.middleware";
import { authorizePlatform } from "@/middlewares/authorize.middleware";

const router = Router();

// Protect all super admin routes
router.use(protect, authorizePlatform("SUPER_ADMIN"));

router.get("/stats", getPlatformStats);
router.get("/organizations", getAllOrganizations);
router.get("/users", getAllUsers);
router.get("/issues", getAllIssues);
router.post("/organizations", createOrganization);
router.patch("/organizations/:id/status", toggleOrganizationStatus);
router.delete("/organizations/:id", deleteOrganization);
router.post("/promote", promoteSuperAdmin);

export default router;
