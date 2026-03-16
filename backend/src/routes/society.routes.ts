import { Router } from "express";
import {
  createSociety,
  getSocieties,
  getSocietyById,
  getSocietyIssues,
  listPublicSocieties
} from "../controllers/society.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.get("/public", listPublicSocieties);

// Create society (admin only)
router.post("/", protect, authorize("admin"), createSociety);

// Get all societies (admin only)
router.get("/", protect, authorize("admin"), getSocieties);

// Get a specific Society
router.get("/:id", protect, authorize("admin"), getSocietyById)

router.get("/:id/issues", protect, getSocietyIssues)

export default router;
