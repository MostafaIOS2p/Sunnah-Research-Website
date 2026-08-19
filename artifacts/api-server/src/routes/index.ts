import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hadithsRouter from "./hadiths";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hadithsRouter);

export default router;
