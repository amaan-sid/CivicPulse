import { Router } from "express";
import { changeCurrentSociety, createSociety, getCurrentSociety,getResidents, getSocietyById, getSocietyIssues, updateResident, updateSociety,removeResident ,joinSociety } from "../controllers/society.controller";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// Create society 
router.post("/create", createSociety);

// Join society
router.post("/join", joinSociety);

// Change active society
router.post("/current", changeCurrentSociety);

// Get active society info
router.get("/current", getCurrentSociety)

//get all residents of active society
router.get("/residents", getResidents)

//get all issues of active society
router.get("/:id/issues", getSocietyIssues)

//get all info about  society of goven Id
router.get("/:id", getSocietyById)

//Update info of active society
router.patch("/update", updateSociety)

//update info of the resident of the given Id
router.put("/residents/:id", updateResident)

//delete the membership object of the resident of the given id
router.delete("/residents/:id", removeResident)

export default router;