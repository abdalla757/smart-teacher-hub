import {
  LayoutDashboard,
  Users,
  UsersRound,
  CalendarCheck,
  FileText,
  GraduationCap,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  to:
    | "/dashboard"
    | "/students"
    | "/groups"
    | "/attendance"
    | "/exams"
    | "/grades"
    | "/settings";
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "لوحة التحكم", to: "/dashboard", icon: LayoutDashboard },
  { title: "الطلاب", to: "/students", icon: Users },
  { title: "المجموعات", to: "/groups", icon: UsersRound },
  { title: "الحضور", to: "/attendance", icon: CalendarCheck },
  { title: "الاختبارات", to: "/exams", icon: FileText },
  { title: "الدرجات", to: "/grades", icon: GraduationCap },
  { title: "الإعدادات", to: "/settings", icon: Settings },
];
