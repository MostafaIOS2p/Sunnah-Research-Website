import { Router, type IRouter } from "express";
import { ListNewsResponse } from "@workspace/api-zod";
import { getAliftaNews } from "../lib/alifta-news";

const router: IRouter = Router();

router.get("/news", async (_req, res): Promise<void> => {
  const feed = await getAliftaNews();
  res.json(ListNewsResponse.parse(feed));
});

export default router;