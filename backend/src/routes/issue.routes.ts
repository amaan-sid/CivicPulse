import { Router } from "express";
import {
  assignIssue,
  createIssue,
  getIssueById,
  getSocietyIssues,
  updateIssueStatus,
  toggleReporter
} from "@/controllers/issue.controller";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";

const router = Router();

// Create issue (any society user)
router.post("/", protect, authorize("resident", "member", "staff", "admin"), createIssue);

// Get issues of logged-in user's society
router.get("/", protect, getSocietyIssues);

// Get issue by id
router.get("/:id", protect, getIssueById);

// Update issue status (member/staff/admin)
router.patch("/:id", protect, authorize("member", "staff", "admin"), updateIssueStatus);

// Assign issue (admin/member)
router.patch("/:id/assign", protect, authorize("admin", "member"), assignIssue);

// Increase/Decrease report count
router.patch("/:id/report", protect, toggleReporter);

export default router;