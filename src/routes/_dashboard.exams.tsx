import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_dashboard/exams")({
  head: () => ({
    meta: [
      { title: "الاختبارات | المعلم الذكي" },
      { name: "description", content: "إنشاء الاختبارات وإدارتها." },
      { property: "og:title", content: "الاختبارات | المعلم الذكي" },
      { property: "og:description", content: "إنشاء الاختبارات وإدارتها." },
    ],
  }),
  component: () => <PlaceholderPage title="الاختبارات" description="إنشاء الاختبارات وإدارتها." icon={FileText} />,
});
