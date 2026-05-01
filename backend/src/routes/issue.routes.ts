import { Router } from "express";
import {
  assignIssue,
  createIssue,
  getIssueById,
  getSocietyIssues,
  updateIssueStatus,
  toggleReporter
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

// Update issue status (member/admin)
router.patch("/:id", protect, authorize("member", "admin"), updateIssueStatus);

// Assign issue (admin only)
router.patch("/:id/assign", protect, authorize("admin"), assignIssue);

// Increase/Decrease report count
router.patch("/:id/report", protect, toggleReporter);

export default router;