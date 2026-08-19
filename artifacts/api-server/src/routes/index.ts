import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hadithsRouter from "./hadiths";
import newsRouter from "./news";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hadithsRouter);
router.use(newsRouter);

export default router;
