import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | المعلم الذكي" },
      { name: "description", content: "منصة المعلم الذكي لإدارة الطلاب والمجموعات والحضور والاختبارات." },
      { property: "og:title", content: "تسجيل الدخول | المعلم الذكي" },
      { property: "og:description", content: "منصة المعلم الذكي لإدارة الطلاب والمجموعات والحضور والاختبارات." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-hero p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-bold">المعلم الذكي</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-snug">نظّم فصولك بذكاء،<br />وركّز على التعليم.</h1>
          <p className="mt-4 max-w-md opacity-85">منصة واحدة لإدارة الطلاب والمجموعات والحضور والدرجات.</p>
        </div>
        <p className="text-sm opacity-70">© المعلم الذكي</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-soft">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold">تسجيل الدخول</h2>
            <p className="mt-1 text-sm text-muted-foreground">أدخل بياناتك للمتابعة</p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/dashboard" });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="teacher@example.com" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" dir="ltr" />
              </div>
              <Button type="submit" className="w-full" size="lg">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
