import { Router } from "express";
import { createSociety, getSocieties, getSocietyById, getSocietyIssues, joinSociety } from "../controllers/society.controller";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// Create society 
router.post("/create", createSociety);

// Join society
router.post("/join", joinSociety);

// Get all societies
router.get("/", getSocieties);

// Get a specific Society
router.get("/:id", getSocietyById)

router.get("/:id/issues", getSocietyIssues)

export default router;