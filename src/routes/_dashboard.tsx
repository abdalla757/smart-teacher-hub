import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarNav } from "@/components/layout/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { FullPageLoader } from "@/components/layout/FullPageLoader";

export const Route = createFileRoute("/_dashboard")({
  // Session lives in browser storage, so the gate runs client-side only.
  ssr: false,
  // getSession() waits for the client to finish restoring the stored session
  // (and refreshing an expired token) before we decide. Only a confirmed
  // missing session redirects; a network hiccup no longer logs the teacher out.
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login", replace: true });
    return { user: data.session.user };
  },
  pendingMs: 0,
  pendingComponent: () => <FullPageLoader />,
  component: DashboardLayout,
});

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <SidebarNav />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">القائمة</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur md:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="فتح القائمة">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="الإشعارات">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-secondary text-primary">م</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
