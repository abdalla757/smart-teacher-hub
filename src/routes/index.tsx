import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "المعلم الذكي | منصة إدارة الفصول" },
      { name: "description", content: "منصة المعلم الذكي لإدارة الطلاب والمجموعات والحضور والاختبارات." },
      { property: "og:title", content: "المعلم الذكي | منصة إدارة الفصول" },
      { property: "og:description", content: "منصة المعلم الذكي لإدارة الطلاب والمجموعات والحضور والاختبارات." },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
