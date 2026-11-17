import { Router } from "express";
import {
  assignIssue,
  createIssue,
  getSocietyIssues,
  updateIssueStatus,
  getIssueById
} from "../controllers/issue.controller";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// Create issue (resident only)
router.post("/", protect, authorize("resident"), createIssue);

// Get issues of logged-in user's society
router.get("/", protect, getSocietyIssues);

// Get issue by id
router.get("/:id", protect, getIssueById);

// Update issue status (staff/admin)
router.patch("/:id", protect, authorize("staff", "admin"), updateIssueStatus);

// Assign issue (admin only)
router.patch("/:id/assign", protect, authorize("admin"), assignIssue);

export default router;