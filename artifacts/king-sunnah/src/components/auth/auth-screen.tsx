import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Apple,
  ChevronDown,
  Eye,
  EyeOff,
  Facebook,
  Landmark,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth, type UserRole, ROLE_OPTIONS } from '@/lib/auth';
import { RolePicker } from '@/components/auth/role-picker';
import { GoogleIcon } from '@/components/auth/google-icon';

type AuthMode = 'login' | 'register';

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
  const [role, setRole] = useState<UserRole | null>(null);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const goToMode = (next: AuthMode) => {
    clearError();
    setFormError(null);
    setLocation(next === 'login' ? '/login' : '/register');
  };

  const handleGuest = () => setLocation('/');

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
  const roleLabel = role ? ROLE_OPTIONS.find((o) => o.value === role)?.label : null;

  return (
    <div className="animate-in fade-in duration-500">
      {/* ── Hero band ─────────────────────────────────────────────── */}
      <section className="relative bg-primary px-6 pb-20 pt-10 text-primary-foreground md:px-10 md:pt-14">
        <div className="mx-auto flex max-w-md items-center justify-between md:max-w-lg">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/10">
            <Landmark className="h-7 w-7" />
          </div>
          <button
            type="button"
            onClick={handleGuest}
            className="rounded-full border border-primary-foreground/30 px-4 py-1.5 text-sm font-medium text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
          >
            الدخول كزائر
          </button>
        </div>
        <div className="mx-auto mt-8 max-w-md md:max-w-lg">
          <h1 className="font-display text-[1.75rem] font-thin leading-tight md:text-4xl">
            اهلاً بك في جامع خادم الحرمين الشريفين
          </h1>
          <p className="mt-2 text-sm font-light text-primary-foreground/75 md:text-base">
            الملك عبدالله بن عبد العزيز للسنة النبوية المطهرة.
          </p>
        </div>
      </section>

      {/* ── Form card ─────────────────────────────────────────────── */}
      <div className="relative mx-auto -mt-10 max-w-md px-5 pb-16 md:-mt-12 md:max-w-lg">
        <div className="surface-card p-6 md:p-8">
          <div className="mb-6 flex items-center gap-1 rounded-full bg-foreground/[0.04] p-1">
            <button
              type="button"
              onClick={() => goToMode('login')}
              className={cn(
                'flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
                mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground',
              )}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => goToMode('register')}
              className={cn(
                'flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
                mode === 'register' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground',
              )}
            >
              إنشاء حساب جديد
            </button>
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
                <button
                  type="button"
                  onClick={() => setRolePickerOpen(true)}
                  className={cn(
                    fieldClass,
                    'flex items-center justify-between text-right',
                    !roleLabel && 'text-muted-foreground',
                  )}
                >
                  <span>{roleLabel || 'اختر صفتك : مثل طالب علم'}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </button>
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

      <RolePicker
        open={rolePickerOpen}
        onOpenChange={setRolePickerOpen}
        value={role}
        onSelect={setRole}
      />
    </div>
  );
}
