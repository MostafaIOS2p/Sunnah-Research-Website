import { Router, type IRouter, type Request, type Response } from "express";
import {
  fetchCompoundMatn,
  fetchMostNarratedRawys,
  fetchMutoon,
} from "../lib/king-sunnah-home-feed";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

router.get("/home/most-narrators", async (req: Request, res: Response) => {
  const page = parsePositiveInt(req.query.page, 1);
  const pageSize = parsePositiveInt(req.query.pageSize, 8);
  try {
    const data = await fetchMostNarratedRawys(page, pageSize);
    res.json(data);
  } catch (err) {
    logger.warn({ err }, "most-narrators request failed");
    res.status(502).json({ message: "تعذّر تحميل قائمة الرواة حالياً." });
  }
});

router.get("/home/compound-matn", async (req: Request, res: Response) => {
  const page = parsePositiveInt(req.query.page, 1);
  const pageSize = parsePositiveInt(req.query.pageSize, 8);
  try {
    const data = await fetchCompoundMatn(page, pageSize);
    res.json(data);
  } catch (err) {
    logger.warn({ err }, "compound-matn request failed");
    res.status(502).json({ message: "تعذّر تحميل المتون المجمعة حالياً." });
  }
});

router.get("/home/mutoon", async (_req: Request, res: Response) => {
  try {
    const data = await fetchMutoon();
    res.json(data);
  } catch (err) {
    logger.warn({ err }, "mutoon request failed");
    res.status(502).json({ message: "تعذّر تحميل كتب المتون حالياً." });
  }
});

export default router;
