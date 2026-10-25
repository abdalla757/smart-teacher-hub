import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_dashboard/attendance")({
  head: () => ({
    meta: [
      { title: "الحضور | المعلم الذكي" },
      { name: "description", content: "متابعة حضور الطلاب وغيابهم." },
      { property: "og:title", content: "الحضور | المعلم الذكي" },
      { property: "og:description", content: "متابعة حضور الطلاب وغيابهم." },
    ],
  }),
  component: () => <PlaceholderPage title="الحضور" description="متابعة حضور الطلاب وغيابهم." icon={CalendarCheck} />,
});
