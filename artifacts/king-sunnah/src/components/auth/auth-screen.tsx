import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Facebook,
  GraduationCap,
  Microscope,
  PenLine,
  Plus,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth, type UserRole, ROLE_OPTIONS } from '@/lib/auth';
import { GoogleIcon } from '@/components/auth/google-icon';

type AuthMode = 'login' | 'register';

const ROLE_ICONS: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  teacher: PenLine,
  researcher: Microscope,
  enthusiast: User,
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-foreground/80">
      {children}
      {required && <span className="mr-1 text-destructive">*</span>}
    </label>
  );
}

const fieldClass =
  'h-12 w-full rounded-2xl border border-border/60 bg-transparent px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50';

function PasswordField({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="current-password"
        className={cn(fieldClass, 'pl-11')}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border/60 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.03]"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const [, setLocation] = useLocation();
  const { login, register, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const goToMode = (next: AuthMode) => {
    clearError();
    setFormError(null);
    setLocation(next === 'login' ? '/login' : '/register');
  };

  const handleSocial = (provider: string) => {
    toast({
      title: 'قريباً',
      description: `تسجيل الدخول عبر ${provider} غير متاح بعد، وسيتم تفعيله قريباً.`,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);
    if (!loginEmail.trim() || !loginPassword) {
      setFormError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }
    const success = await login(loginEmail.trim(), loginPassword);
    if (success) {
      toast({ title: 'تم تسجيل الدخول بنجاح' });
      setLocation('/');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    if (!fullName.trim() || !role || !registerEmail.trim() || !registerPassword) {
      setFormError('يرجى تعبئة جميع الحقول المطلوبة، بما في ذلك صفتك.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setFormError('كلمتا المرور غير متطابقتين.');
      return;
    }

    const success = await register({
      fullName: fullName.trim(),
      role,
      email: registerEmail.trim(),
      password: registerPassword,
    });
    if (success) {
      toast({ title: 'تم إنشاء الحساب بنجاح' });
      setLocation('/');
    }
  };

  const displayedError = formError || error;

  return (
    <div className="animate-in fade-in duration-500 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {/* ── Brand panel ───────────────────────────────────────────── */}
      <aside className="flex flex-col justify-between bg-primary px-6 py-8 text-primary-foreground md:px-12 md:py-10 lg:py-14">
        <Link href="/">
          <span className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
            <ArrowRight className="h-4 w-4" />
            العودة للرئيسية
          </span>
        </Link>

        <div className="flex flex-1 flex-col justify-center py-10 lg:py-0">
          <img
            src="/images/king-sunnah-mark.svg"
            alt=""
            className="h-12 w-12 opacity-90"
          />
          <h1 className="mt-8 max-w-sm font-display text-3xl font-thin leading-tight md:text-4xl">
            بوابتك الموثقة لدراسة السنة النبوية
          </h1>
          <p className="mt-4 max-w-sm text-base font-light leading-relaxed text-primary-foreground/75">
            سجّل الدخول لحفظ بحثك ومحفوظاتك، ومتابعتها من أي جهاز تستخدمه.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/60">
          مجموعة الملك عبدالعزيز للسنة النبوية · دار الإفتاء
        </p>
      </aside>

      {/* ── Form panel ────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-5 py-12 md:px-10 lg:px-16 lg:py-0">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="surface-card flex items-center gap-1 p-1">
              <button
                type="button"
                onClick={() => goToMode('login')}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground',
                )}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => goToMode('register')}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  mode === 'register' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground',
                )}
              >
                إنشاء حساب
              </button>
            </div>
            <Link href="/">
              <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                تصفّح كزائر
              </span>
            </Link>
          </div>

          {displayedError && (
            <div role="alert" className="mb-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {displayedError}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <FieldLabel required>البريد الإلكتروني</FieldLabel>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="مثل: ahmed1234@gmail.com"
                  autoComplete="email"
                  dir="ltr"
                  className={cn(fieldClass, 'text-left placeholder:text-right')}
                />
              </div>
              <div>
                <FieldLabel required>كلمة المرور</FieldLabel>
                <PasswordField
                  id="login-password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  placeholder="ادخل كلمة المرور"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-foreground/70">
                  <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
                  تذكرني
                </label>
                <button
                  type="button"
                  onClick={() => setLocation('/forgot-password')}
                  className="text-sm text-primary transition-colors hover:text-primary/80"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                {!isLoading && <ArrowLeft className="h-4 w-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <FieldLabel required>الاسم ثلاثي</FieldLabel>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثل: أحمد عبدالله السعيد"
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>
              <div>
                <FieldLabel>صفتك</FieldLabel>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className={cn(fieldClass, 'flex [&>span]:text-right')}>
                    <SelectValue placeholder="اختر صفتك : مثل طالب علم" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = ROLE_ICONS[option.value];
                      return (
                        <SelectItem key={option.value} value={option.value} className="pl-8 pr-2">
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-foreground/50" />
                            {option.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel required>البريد الإلكتروني</FieldLabel>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="مثل: ahmed1234@gmail.com"
                  autoComplete="email"
                  dir="ltr"
                  className={cn(fieldClass, 'text-left placeholder:text-right')}
                />
              </div>
              <div>
                <FieldLabel required>كلمة المرور</FieldLabel>
                <PasswordField
                  id="register-password"
                  value={registerPassword}
                  onChange={setRegisterPassword}
                  placeholder="ادخل كلمة المرور"
                />
              </div>
              <div>
                <FieldLabel required>تأكيد كلمة المرور</FieldLabel>
                <PasswordField
                  id="register-confirm-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="ادخل كلمة المرور مرة أخرى"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
                {!isLoading && <Plus className="h-4 w-4" />}
              </button>
            </form>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground">
              {mode === 'login' ? 'أو الدخول عبر' : 'أو إنشاء حساب عبر'}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SocialButton
              icon={<Facebook className="h-4 w-4 text-[#1877F2]" />}
              label="فيسبوك"
              onClick={() => handleSocial('فيسبوك')}
            />
            <SocialButton
              icon={<GoogleIcon className="h-4 w-4" />}
              label="جوجل"
              onClick={() => handleSocial('جوجل')}
            />
            <SocialButton
              icon={<Apple className="h-4 w-4" />}
              label="آبل"
              onClick={() => handleSocial('آبل')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
