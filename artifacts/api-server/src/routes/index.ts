import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hadithsRouter from "./hadiths";
import newsRouter from "./news";
import authRouter from "./auth";
import homeFeedRouter from "./home-feed";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hadithsRouter);
router.use(newsRouter);
router.use(authRouter);
router.use(homeFeedRouter);

export default router;
