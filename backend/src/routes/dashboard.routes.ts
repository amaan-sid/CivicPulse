import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.get("/", protect, authorize("admin"), getDashboardStats);

export default router;