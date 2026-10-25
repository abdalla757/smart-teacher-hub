import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_dashboard/students")({
  head: () => ({
    meta: [
      { title: "الطلاب | المعلم الذكي" },
      { name: "description", content: "إدارة بيانات الطلاب وملفاتهم." },
      { property: "og:title", content: "الطلاب | المعلم الذكي" },
      { property: "og:description", content: "إدارة بيانات الطلاب وملفاتهم." },
    ],
  }),
  component: () => <PlaceholderPage title="الطلاب" description="إدارة بيانات الطلاب وملفاتهم." icon={Users} />,
});
