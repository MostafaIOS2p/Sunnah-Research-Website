import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'researcher' | 'enthusiast';

export type AuthUser = {
  displayName: string;
  email: string;
};

type StoredAuth = {
  token: string | null;
  user: AuthUser;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (params: {
    fullName: string;
    role: UserRole;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'ks-auth';

const ROLE_LABELS: Record<UserRole, string> = {
  student: 'طالب علم',
  teacher: 'شيخ/معلم',
  researcher: 'باحث في السنة النبوية',
  enthusiast: 'شخص عادي مهتم بالسنة النبوية',
};

/** Encodes the role into DisplayName since the register endpoint has no
 * dedicated role field — "الاسم (الصفة)", e.g. "أحمد عبدالله (طالب علم)". */
export function buildDisplayName(fullName: string, role: UserRole): string {
  return `${fullName.trim()} (${ROLE_LABELS[role]})`;
}

function readStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAuth>;
    if (!parsed || typeof parsed !== 'object' || !parsed.user) return null;
    return {
      token: typeof parsed.token === 'string' ? parsed.token : null,
      user: parsed.user as AuthUser,
    };
  } catch {
    return null;
  }
}

function writeStoredAuth(value: StoredAuth | null) {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // localStorage can be unavailable (private browsing, cleared mid-session).
  }
}

/**
 * The real backend's success response shape isn't confirmed yet. This is
 * the single place that reads it, so updating it once the actual shape is
 * known (e.g. from ApiDog) is a one-function edit — everything else in the
 * app only ever sees the normalized { token, user } shape below.
 */
function extractAuthPayload(
  body: unknown,
  fallback: { displayName: string; email: string },
): StoredAuth {
  const record = (body ?? {}) as Record<string, unknown>;

  const token =
    (typeof record.token === 'string' && record.token) ||
    (typeof record.accessToken === 'string' && record.accessToken) ||
    (typeof record.jwt === 'string' && record.jwt) ||
    (typeof record.Token === 'string' && record.Token) ||
    null;

  const userRecord = (record.user ?? record.User ?? record) as Record<string, unknown>;
  const displayName =
    (typeof userRecord.displayName === 'string' && userRecord.displayName) ||
    (typeof userRecord.DisplayName === 'string' && userRecord.DisplayName) ||
    fallback.displayName;
  const email =
    (typeof userRecord.email === 'string' && userRecord.email) ||
    (typeof userRecord.Email === 'string' && userRecord.Email) ||
    fallback.email;

  return { token, user: { displayName, email } };
}

// The real backend returns RFC 7807 problem-details errors, e.g.:
// { type, title: "Users.InvalidCredentials", detail: "...", status: 401 }
// (confirmed via a live login attempt with a throwaway, non-existent email —
// no account was created or real credentials used).
const KNOWN_ERROR_TITLES: Record<string, string> = {
  'Users.InvalidCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'Users.AlreadyExists': 'هذا البريد الإلكتروني مسجّل بالفعل.',
  'Users.EmailAlreadyExists': 'هذا البريد الإلكتروني مسجّل بالفعل.',
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      title?: unknown;
      detail?: unknown;
      message?: unknown;
      Message?: unknown;
    };
    if (typeof body?.title === 'string' && KNOWN_ERROR_TITLES[body.title]) {
      return KNOWN_ERROR_TITLES[body.title];
    }
    if (typeof body?.detail === 'string' && body.detail) return body.detail;
    if (typeof body?.message === 'string' && body.message) return body.message;
    if (typeof body?.Message === 'string' && body.Message) return body.Message;
  } catch {
    // Non-JSON error body — fall through to the generic message below.
  }
  if (response.status === 401 || response.status === 400) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  }
  if (response.status === 409) {
    return 'هذا البريد الإلكتروني مسجّل بالفعل.';
  }
  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (!response.ok) {
        setError(await readErrorMessage(response));
        return false;
      }

      const body = await response.json();
      const payload = extractAuthPayload(body, { displayName: email, email });
      setUser(payload.user);
      setToken(payload.token);
      writeStoredAuth(payload);
      return true;
    } catch {
      setError('تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async ({
      fullName,
      role,
      email,
      password,
    }: {
      fullName: string;
      role: UserRole;
      email: string;
      password: string;
    }) => {
      setIsLoading(true);
      setError(null);
      const displayName = buildDisplayName(fullName, role);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email: email, Password: password, DisplayName: displayName }),
        });

        if (!response.ok) {
          setError(await readErrorMessage(response));
          return false;
        }

        const body = await response.json();
        const payload = extractAuthPayload(body, { displayName, email });
        setUser(payload.user);
        setToken(payload.token);
        writeStoredAuth(payload);
        return true;
      } catch {
        setError('تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    writeStoredAuth(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: user !== null,
        isLoading,
        error,
        clearError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'student', label: ROLE_LABELS.student },
  { value: 'teacher', label: ROLE_LABELS.teacher },
  { value: 'researcher', label: ROLE_LABELS.researcher },
  { value: 'enthusiast', label: ROLE_LABELS.enthusiast },
];
