"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bus, LayoutDashboard, MapPinned, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/parking", label: "Parking", icon: MapPinned },
  { href: "/buses", label: "Buses", icon: Bus },
  { href: "/recommendations", label: "AI", icon: Sparkles },
  { href: "/notifications", label: "Alerts", icon: Bell }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-medium", active ? "bg-slate-950 text-white" : "text-slate-500")}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
