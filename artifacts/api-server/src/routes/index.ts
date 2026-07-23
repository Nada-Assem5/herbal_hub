import { Router } from "express";
import healthRouter from "./health";
import assessmentsRouter from "./assessments";
import adminRouter from "./admin/index";
import productsRouter from "./products";

const router = Router();

router.use(healthRouter);
router.use(assessmentsRouter);
router.use(adminRouter);
router.use(productsRouter);

export default router;
