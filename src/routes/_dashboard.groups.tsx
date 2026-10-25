import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_dashboard/groups")({
  head: () => ({
    meta: [
      { title: "المجموعات | المعلم الذكي" },
      { name: "description", content: "تنظيم الطلاب في مجموعات دراسية." },
      { property: "og:title", content: "المجموعات | المعلم الذكي" },
      { property: "og:description", content: "تنظيم الطلاب في مجموعات دراسية." },
    ],
  }),
  component: () => <PlaceholderPage title="المجموعات" description="تنظيم الطلاب في مجموعات دراسية." icon={UsersRound} />,
});
