import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { GraduationCap, Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { navItems } from "./nav-items";

export function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-lg font-bold leading-tight">المعلم الذكي</p>
        <p className="text-xs opacity-70">Smart Teacher</p>
      </div>
    </div>
  );
}

const SIGN_OUT_TIMEOUT_MS = 8000;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function handleSignOut() {
    if (inFlight.current) return; // one request at a time, even on fast double-clicks
    inFlight.current = true;
    setSigningOut(true);
    setSignOutError(null);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeout = new Promise<{ error: Error }>((resolve) => {
        timer = setTimeout(() => resolve({ error: new Error("timeout") }), SIGN_OUT_TIMEOUT_MS);
      });
      const { error } = await Promise.race([supabase.auth.signOut(), timeout]);
      if (error) throw error;
      queryClient.cancelQueries();
      queryClient.clear();
      onNavigate?.();
      navigate({ to: "/login", replace: true });
    } catch {
      setSignOutError("تعذّر تسجيل الخروج. تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.");
      setSigningOut(false);
      inFlight.current = false;
    } finally {
      clearTimeout(timer);
    }
  }
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground">
      <Brand />
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = path === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      {signOutError && (
        <div role="alert" className="rounded-lg bg-destructive/15 p-3 text-xs leading-relaxed">
          <p>{signOutError}</p>
          <button type="button" onClick={handleSignOut} className="mt-2 font-semibold underline">
            إعادة المحاولة
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        aria-busy={signingOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm opacity-80 transition-opacity hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        {signingOut ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
      </button>
    </div>
  );
}
