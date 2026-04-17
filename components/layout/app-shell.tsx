"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BusFront, CarFront, Cpu, Gauge, Home, Map, ShieldCheck, Sparkles } from "lucide-react";
import { adminNavigation, appName, mainNavigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useStudentProfile } from "@/components/providers/student-profile-provider";

const iconMap: Record<string, typeof Home> = {
  Dashboard: Home,
  Parking: CarFront,
  Buses: BusFront,
  "Smart Guidance": Sparkles,
  Rules: ShieldCheck,
  Profile: Gauge,
  Overview: Home,
  Sensors: Cpu,
  Lots: Map,
  "Rules Engine": ShieldCheck,
  "Bus Ops": BusFront,
  Analytics: Gauge,
  "How It Works": Sparkles,
  Architecture: Cpu,
  Implementation: Gauge,
  "Competition Insights": ShieldCheck
};

export function AppShell({
  children,
  title,
  eyebrow,
  description,
  admin = false
}: {
  children: ReactNode;
  title: string;
  eyebrow: string;
  description: string;
  admin?: boolean;
}) {
  const pathname = usePathname();
  const primaryItems = admin ? adminNavigation : mainNavigation;
  useStudentProfile();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#edf6f1_0%,#ffffff_38%,#f4faf6_100%)] pb-20 lg:pb-0">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#0b6e56_0%,#08755c_44%,#05684b_100%)] p-5 text-white shadow-[0_30px_120px_rgba(0,62,81,0.18)] lg:block">
          <div className="rounded-3xl border border-white/15 bg-[linear-gradient(180deg,rgba(11,79,108,0.92)_0%,rgba(10,109,91,0.9)_100%)] p-5 text-white">
            <div className="inline-flex rounded-[28px] bg-white px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
              <BrandLogo compact />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.32em] text-[#d8f6e3]">KFUPM Mobility</p>
            <h1 className="mt-3 text-2xl font-semibold">{appName}</h1>
            <p className="mt-3 text-sm leading-7 text-white/82">
              A permit-aware mobility workspace that helps students find legal parking, follow the right bus network, and avoid violations before they happen.
            </p>
          </div>
          <nav className="mt-6 space-y-2">
            {primaryItems.map((item) => (
              <SidebarLink key={item.href} href={item.href} label={item.label} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </nav>
        </aside>
        <main className="space-y-6">
          <section className="rounded-[32px] border border-white/20 bg-[linear-gradient(135deg,#0b4362_0%,#0a5e59_54%,#0b7a5c_100%)] px-5 py-6 text-white shadow-[0_24px_80px_rgba(0,62,81,0.12)] lg:px-7">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d8f6e3]">{eyebrow}</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h2>
                <div className="mt-4 max-w-3xl rounded-[26px] border border-white/14 bg-white/8 px-5 py-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.30em] text-[#d8f6e3]">What This Page Helps You Do</p>
                  <p className="mt-3 text-sm leading-7 text-white/84 lg:text-base">{description}</p>
                </div>
              </div>
              <div className="rounded-[26px] border border-white/14 bg-white/8 px-5 py-4 text-sm leading-7 text-white/82 backdrop-blur">
                Each screen is connected to the same permit rules, parking data, bus network logic, and mobility guidance used across the platform.
              </div>
            </div>
          </section>
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function SidebarLink({
  href,
  label,
  active,
  compact = false
}: {
  href: string;
  label: string;
  active: boolean;
  compact?: boolean;
}) {
  const Icon = iconMap[label] ?? Home;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        active ? "text-white" : "text-white/84 hover:text-white",
        compact && "py-2.5 text-[13px]"
      )}
      style={active ? { background: "linear-gradient(135deg, #0b4362 0%, color-mix(in srgb, var(--category-primary) 38%, #0b6e56 62%) 100%)", boxShadow: "0 18px 40px rgba(0, 62, 81, 0.16)" } : { backgroundColor: "transparent" }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
