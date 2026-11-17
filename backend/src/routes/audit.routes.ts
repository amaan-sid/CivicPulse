import express from "express";
import { getIssueLogs } from "../controllers/audit.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = express.Router();

router.get("/:id/logs", protect, authorize("admin", "staff"), getIssueLogs);

export default router;