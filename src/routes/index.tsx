import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { FullPageLoader } from "@/components/layout/FullPageLoader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "المعلم الذكي | منصة إدارة الفصول" },
      { name: "description", content: "منصة المعلم الذكي لإدارة الطلاب والمجموعات والحضور والاختبارات." },
      { property: "og:title", content: "المعلم الذكي | منصة إدارة الفصول" },
      { property: "og:description", content: "منصة المعلم الذكي لإدارة الطلاب والمجموعات والحضور والاختبارات." },
    ],
  }),
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    throw redirect({ to: data.session ? "/dashboard" : "/login", replace: true });
  },
  pendingMs: 0,
  pendingComponent: () => <FullPageLoader />,
});
