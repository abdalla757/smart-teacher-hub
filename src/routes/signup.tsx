import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FormError } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage, AUTH_MESSAGES } from "@/lib/auth-errors";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب معلم | المعلم الذكي" },
      { name: "description", content: "أنشئ حساب معلم جديد على منصة المعلم الذكي." },
      { property: "og:title", content: "إنشاء حساب معلم | المعلم الذكي" },
      { property: "og:description", content: "أنشئ حساب معلم جديد على منصة المعلم الذكي." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    const name = fullName.trim();
    if (name.length < 2 || name.length > 100) {
      setError("أدخل الاسم الكامل (من 2 إلى 100 حرف).");
      return;
    }
    if (password.length < 8) {
      setError(AUTH_MESSAGES.weakPassword);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      // With email confirmation on, an existing email returns a user with no identities.
      if (data.user && data.user.identities?.length === 0) {
        setError(AUTH_MESSAGES.duplicateEmail);
        return;
      }
      if (data.session) navigate({ to: "/dashboard", replace: true });
      else setCheckEmail(true);
    } catch {
      setError(AUTH_MESSAGES.network);
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <AuthShell title="تحقّق من بريدك الإلكتروني" subtitle="خطوة أخيرة لتفعيل حسابك">
        <div className="mt-6 space-y-4 text-center">
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <p className="text-sm">أرسلنا رابط تأكيد إلى <span dir="ltr" className="font-medium">{email}</span>. افتح الرابط ثم سجّل الدخول.</p>
          <Button asChild variant="outline" className="w-full"><Link to="/login">العودة لتسجيل الدخول</Link></Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="إنشاء حساب معلم" subtitle="ابدأ بتنظيم فصولك في دقائق">
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="full_name">الاسم الكامل</Label>
          <Input id="full_name" required maxLength={100} autoComplete="name"
            value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" required maxLength={255} autoComplete="email" dir="ltr" placeholder="teacher@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" type="password" required minLength={8} autoComplete="new-password" dir="ltr"
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          <p className="text-xs text-muted-foreground">8 أحرف على الأقل.</p>
        </div>
        <FormError message={error} />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> جارٍ إنشاء الحساب...</>) : "إنشاء الحساب"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">تسجيل الدخول</Link>
        </p>
      </form>
    </AuthShell>
  );
}
