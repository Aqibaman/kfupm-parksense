"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, LayoutDashboard, MapPinned, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parking", label: "Parking", icon: MapPinned },
  { href: "/buses", label: "Buses", icon: Bus },
  { href: "/guidance", label: "Smart", icon: Sparkles },
  { href: "/rules", label: "Policy", icon: ShieldCheck },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,89,70,0.96)_0%,rgba(4,76,59,0.98)_100%)] px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[58px] flex-col items-center justify-center rounded-2xl px-1 py-2 text-center text-[10px] font-medium leading-tight text-white transition",
                active ? "text-white shadow-[0_12px_24px_rgba(0,62,81,0.18)]" : "text-white"
              )}
              style={active ? { background: "linear-gradient(135deg,#0b4362 0%, color-mix(in srgb, var(--category-primary) 38%, #0b6e56 62%) 100%)" } : { background: "transparent" }}
            >
              <Icon className="mb-1 h-4 w-4 text-white" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
