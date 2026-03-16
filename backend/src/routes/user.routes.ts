import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.get("/", protect, authorize("admin"), getAllUsers);

export default router;