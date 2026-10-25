import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FormError } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage, AUTH_MESSAGES } from "@/lib/auth-errors";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | المعلم الذكي" },
      { name: "description", content: "سجّل دخولك إلى منصة المعلم الذكي لإدارة فصولك." },
      { property: "og:title", content: "تسجيل الدخول | المعلم الذكي" },
      { property: "og:description", content: "سجّل دخولك إلى منصة المعلم الذكي لإدارة فصولك." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch {
      setError(AUTH_MESSAGES.network);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="تسجيل الدخول" subtitle="أدخل بياناتك للمتابعة">
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate={false}>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" required autoComplete="email" dir="ltr" placeholder="teacher@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" type="password" required autoComplete="current-password" dir="ltr"
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        </div>
        <FormError message={error} />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الدخول...</>) : "دخول"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">إنشاء حساب معلم</Link>
        </p>
      </form>
    </AuthShell>
  );
}
