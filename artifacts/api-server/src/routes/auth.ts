import { Router, type IRouter, type Request, type Response } from "express";
import { forwardAuthRequest } from "../lib/king-sunnah-auth";

const router: IRouter = Router();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

router.post("/auth/register", async (req: Request, res: Response) => {
  const { Email, Password, DisplayName } = req.body ?? {};

  if (
    !isNonEmptyString(Email) ||
    !isNonEmptyString(Password) ||
    !isNonEmptyString(DisplayName)
  ) {
    res.status(400).json({
      message: "البريد الإلكتروني وكلمة المرور والاسم مطلوبة جميعاً.",
    });
    return;
  }

  const { status, body } = await forwardAuthRequest("register", {
    Email,
    Password,
    DisplayName,
  });
  res.status(status).json(body);
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const { Email, Password } = req.body ?? {};

  if (!isNonEmptyString(Email) || !isNonEmptyString(Password)) {
    res.status(400).json({
      message: "البريد الإلكتروني وكلمة المرور مطلوبان.",
    });
    return;
  }

  const { status, body } = await forwardAuthRequest("login", {
    Email,
    Password,
  });
  res.status(status).json(body);
});

export default router;
