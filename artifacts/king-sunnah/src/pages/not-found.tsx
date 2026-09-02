import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-destructive/40 font-display text-2xl text-destructive">
          ؟
        </div>
        <h1 className="font-display text-4xl font-semibold text-foreground">لا توجد قاعة بهذا الاسم</h1>
        <p className="text-lg text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى رابط آخر.
        </p>
        <Link href="/" className="mt-4 inline-flex h-10 items-center justify-center whitespace-nowrap bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
