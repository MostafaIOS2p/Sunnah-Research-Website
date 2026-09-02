import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hadithsRouter from "./hadiths";
import newsRouter from "./news";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hadithsRouter);
router.use(newsRouter);
router.use(authRouter);

export default router;
