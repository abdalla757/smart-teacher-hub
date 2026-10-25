import { createFileRoute } from "@tanstack/react-router";
import { Users, UsersRound, CalendarCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_dashboard/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | المعلم الذكي" },
      { name: "description", content: "نظرة عامة على الطلاب والمجموعات والحضور." },
      { property: "og:title", content: "لوحة التحكم | المعلم الذكي" },
      { property: "og:description", content: "نظرة عامة على الطلاب والمجموعات والحضور." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <div className="mb-8 rounded-2xl bg-hero p-6 text-primary-foreground shadow-soft md:p-8">
        <h1 className="text-2xl font-bold md:text-3xl">أهلًا بك، أستاذ 👋</h1>
        <p className="mt-2 opacity-90">هذه نظرة عامة على نشاطك التعليمي.</p>
      </div>
      <PageHeader title="الإحصائيات" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الطلاب" value="—" icon={Users} />
        <StatCard label="المجموعات" value="—" icon={UsersRound} />
        <StatCard label="نسبة الحضور" value="—" icon={CalendarCheck} />
        <StatCard label="الاختبارات" value="—" icon={FileText} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {["آخر النشاطات", "الحصص القادمة"].map((t) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle className="text-lg">{t}</CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-muted-foreground">
              لا توجد بيانات بعد
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
