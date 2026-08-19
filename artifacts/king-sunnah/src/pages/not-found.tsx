import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-destructive opacity-80" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">الصفحة غير موجودة</h1>
        <p className="text-lg text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى رابط آخر.
        </p>
        <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors mt-4">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
