import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "./PageHeader";

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card className="border-dashed shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <Icon className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold">قريبًا</h2>
          <p className="max-w-sm text-muted-foreground">
            هذا القسم قيد الإنشاء وسيتوفر في الإصدارات القادمة.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
