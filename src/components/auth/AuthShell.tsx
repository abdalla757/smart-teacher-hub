import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-hero p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-bold">المعلم الذكي</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-snug">نظّم فصولك بذكاء،<br />وركّز على التعليم.</h1>
          <p className="mt-4 max-w-md opacity-85">منصة واحدة لإدارة الطلاب والمجموعات والحضور والدرجات.</p>
        </div>
        <p className="text-sm opacity-70">© المعلم الذكي</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-soft">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}
