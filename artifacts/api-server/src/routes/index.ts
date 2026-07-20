import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assessmentsRouter from "./assessments";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessmentsRouter);
router.use(adminRouter);

export default router;
