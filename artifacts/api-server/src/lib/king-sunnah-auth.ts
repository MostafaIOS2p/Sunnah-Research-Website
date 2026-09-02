import { logger } from "./logger";

// The mobile app's real backend. It sends no CORS headers (confirmed via a
// manual preflight check), so the browser can never call it directly — every
// auth call must be relayed through this server.
const AUTH_BASE_URL = "https://testportal.alifta.gov.sa/sunnah/auth";
const REQUEST_TIMEOUT_MS = 15_000;

export type AuthProxyResult = {
  status: number;
  body: unknown;
};

/**
 * Forwards a JSON body to one of the external auth endpoints and relays
 * back its status + body as-is. Deliberately thin: this server does not
 * interpret the response shape (token field names, etc.) — that is left to
 * the frontend, which treats it defensively since the real response schema
 * has not been confirmed yet.
 */
export async function forwardAuthRequest(
  path: "register" | "login" | "external/google" | "external/apple",
  payload: unknown,
): Promise<AuthProxyResult> {
  const url = `${AUTH_BASE_URL}/${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    logger.warn({ err, path }, "King Sunnah auth upstream request failed");
    return {
      status: 502,
      body: {
        message:
          "تعذّر الاتصال بخدمة تسجيل الدخول حالياً. يرجى المحاولة لاحقاً.",
      },
    };
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      // Upstream didn't return JSON (e.g. an IIS error page) — surface a
      // safe, generic message instead of raw HTML.
      logger.warn(
        { path, status: response.status },
        "King Sunnah auth upstream returned a non-JSON response",
      );
      body = {
        message: "استجابة غير متوقعة من خدمة تسجيل الدخول.",
      };
    }
  }

  return { status: response.status, body };
}
