import { Router, type IRouter } from "express";
import healthRouter from "./health";
import topicsRouter from "./topics";
import articlesRouter from "./articles";
import trainingRouter from "./training";
import datasetsRouter from "./datasets";

const router: IRouter = Router();

router.use(healthRouter);
router.use(topicsRouter);
router.use(articlesRouter);
router.use(trainingRouter);
router.use(datasetsRouter);

export default router;
