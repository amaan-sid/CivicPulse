import { Router } from "express";
import authRoutes from "./auth.routes";
import societyRoutes from "./society.routes";
import issueRoutes from "./issue.routes";
import auditRoutes from "./audit.routes";
import dashboardRoutes from "./dashboard.routes";
import userRoutes from "./user.routes";
import superAdminRoutes from "./superadmin.routes";
import { protect } from "@/middlewares/auth.middleware";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/society", protect, societyRoutes);
apiRouter.use("/issues", issueRoutes);
apiRouter.use("/issues", auditRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/super-admin", superAdminRoutes);

export default apiRouter;
