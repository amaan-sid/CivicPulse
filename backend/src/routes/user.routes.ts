import { Router } from "express";
import {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
} from "@/controllers/user.controller";
import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/", protect, authorize("admin", "member"), getAllUsers);

export default router;