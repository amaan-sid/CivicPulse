import { Router } from "express";
import { changeCurrentSociety, createSociety, getSocieties, getSocietyById, getSocietyIssues, joinSociety } from "../controllers/society.controller";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// Create society 
router.post("/create", createSociety);

// Join society
router.post("/join", joinSociety);

// Change active society
router.post("/current", changeCurrentSociety);

// Get all societies
router.get("/", getSocieties);

// Get a specific Society
router.get("/:id", getSocietyById)

router.get("/:id/issues", getSocietyIssues)

export default router;