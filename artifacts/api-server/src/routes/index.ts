import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import assessmentsRouter from "./assessments.js";
import adminRouter from "./admin/index.js";
import productsRouter from "./products.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessmentsRouter);
router.use(adminRouter);
router.use(productsRouter);

export default router;
