import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assessmentsRouter from "./assessments";
import adminRouter from "./admin";
import productsRouter from "./products";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessmentsRouter);
router.use(adminRouter);
router.use(productsRouter);

export default router;
