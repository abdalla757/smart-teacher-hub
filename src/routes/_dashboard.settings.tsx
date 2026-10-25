import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_dashboard/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات | المعلم الذكي" },
      { name: "description", content: "تخصيص إعدادات الحساب والمنصة." },
      { property: "og:title", content: "الإعدادات | المعلم الذكي" },
      { property: "og:description", content: "تخصيص إعدادات الحساب والمنصة." },
    ],
  }),
  component: () => <PlaceholderPage title="الإعدادات" description="تخصيص إعدادات الحساب والمنصة." icon={Settings} />,
});
