import { Router } from "express";
import {
  changeCurrentSociety,
  createSociety,
  getCurrentSociety,
  getMyAdminOrganizations,
  getResidents,
  getSocietyById,
  getSocietyIssues,
  updateResident,
  updateSociety,
  removeResident,
  joinSociety,
  deleteSociety,
  getMyJoinedSocieties
} from "@/controllers/society.controller";
import { protect } from "@/middlewares/auth.middleware";
import { authorize, authorizePlatform } from "@/middlewares/authorize.middleware";

const router = Router();

// Apply protect middleware to all society routes
router.use(protect);

// Create society (Super Admin only)
router.post("/create", authorizePlatform("SUPER_ADMIN"), createSociety);

// Join society
router.post("/join", joinSociety);

// Change active society
router.post("/current", changeCurrentSociety);

// Get active society info
router.get("/current", getCurrentSociety);

// Get all joined societies for current user
router.get("/my-joined-societies", getMyJoinedSocieties);

// Get all organizations managed by current admin
router.get("/my-admin-organizations", authorize("admin"), getMyAdminOrganizations);

// Get all residents of active society (for admin, member, staff, resident)
router.get("/residents", authorize("admin", "member", "staff", "resident"), getResidents);

// Update info of active society
router.patch("/update", authorize("admin"), updateSociety);

// Update info of resident by Id
router.put("/residents/:id", authorize("admin"), updateResident);

// Delete resident membership by Id
router.delete("/residents/:id", authorize("admin"), removeResident);

// Delete active society
router.delete("/", authorize("admin"), deleteSociety);

// Get all issues of active society
router.get("/:id/issues", getSocietyIssues);

// Get all info about society of given Id
router.get("/:id", getSocietyById);

export default router;