import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center px-5">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 font-display text-2xl font-light text-destructive">
          ؟
        </div>
        <h1 className="font-display text-4xl font-thin text-foreground">لا توجد صفحة بهذا الاسم</h1>
        <p className="text-lg font-light text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى رابط آخر.
        </p>
        <Link href="/" className="mt-4 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
