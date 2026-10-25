import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_dashboard/grades")({
  head: () => ({
    meta: [
      { title: "الدرجات | المعلم الذكي" },
      { name: "description", content: "تسجيل درجات الطلاب ومتابعة تقدمهم." },
      { property: "og:title", content: "الدرجات | المعلم الذكي" },
      { property: "og:description", content: "تسجيل درجات الطلاب ومتابعة تقدمهم." },
    ],
  }),
  component: () => <PlaceholderPage title="الدرجات" description="تسجيل درجات الطلاب ومتابعة تقدمهم." icon={GraduationCap} />,
});
