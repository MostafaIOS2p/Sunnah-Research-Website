import { KeyRound } from 'lucide-react';
import { ComingSoon } from '@/components/coming-soon';

export default function ForgotPassword() {
  return (
    <ComingSoon
      icon={KeyRound}
      title="استعادة كلمة المرور قريباً"
      description="نعمل حالياً على تفعيل هذه الخدمة. في الوقت الحالي، يمكنك التواصل مع الدعم لاستعادة الوصول إلى حسابك."
      backHref="/login"
      backLabel="العودة لتسجيل الدخول"
    />
  );
}
