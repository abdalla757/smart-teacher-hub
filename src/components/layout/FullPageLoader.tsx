import { Loader2 } from "lucide-react";

export function FullPageLoader({ label = "جارٍ التحقق من الجلسة..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}
