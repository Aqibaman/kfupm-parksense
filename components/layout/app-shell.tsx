"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BusFront, CarFront, Cpu, Gauge, Home, Map, ShieldCheck, Sparkles } from "lucide-react";
import { adminNavigation, appName, mainNavigation, projectSections } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useStudentProfile } from "@/components/providers/student-profile-provider";

const iconMap: Record<string, typeof Home> = {
  Dashboard: Home,
  Parking: CarFront,
  Buses: BusFront,
  "AI Guide": Sparkles,
  Alerts: Bell,
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f5faf7_48%,#ffffff_100%)] pb-20 lg:pb-0">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(0,62,81,0.08)] lg:block">
          <div className="rounded-3xl border border-[#d7e8de] bg-[linear-gradient(180deg,#ffffff_0%,#f4faf6_100%)] p-5 text-[#003E51]">
            <BrandLogo compact />
            <p className="mt-4 text-xs uppercase tracking-[0.32em]" style={{ color: "color-mix(in srgb, var(--category-primary) 62%, #003E51 38%)" }}>KFUPM Mobility</p>
            <h1 className="mt-3 text-2xl font-semibold">{appName}</h1>
            <p className="mt-3 text-sm text-slate-700">Rule-aware parking, bus guidance, and IoT operations in one academic-grade control surface.</p>
          </div>
          <nav className="mt-6 space-y-2">
            {primaryItems.map((item) => (
              <SidebarLink key={item.href} href={item.href} label={item.label} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </nav>
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Competition</p>
            <div className="space-y-2">
              {projectSections.map((item) => (
                <SidebarLink key={item.href} href={item.href} label={item.label} active={pathname === item.href} compact />
              ))}
            </div>
          </div>
        </aside>
        <main className="space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-white px-5 py-6 text-black shadow-[0_24px_80px_rgba(0,62,81,0.08)] lg:px-7">
            <p className="text-xs uppercase tracking-[0.32em]" style={{ color: "color-mix(in srgb, var(--category-primary) 62%, #003E51 38%)" }}>{eyebrow}</p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 lg:text-base">{description}</p>
              </div>
              <div className="rounded-3xl border border-[#d9e8e0] bg-[#f7fbf8] px-4 py-3 text-sm text-slate-700">
                Mobile, tablet, and laptop layouts are all tuned from the same mock platform data.
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
        active ? "text-white" : "text-slate-700 hover:text-[#003E51]",
        compact && "py-2.5 text-[13px]"
      )}
      style={active ? { background: "linear-gradient(135deg, #003E51 0%, color-mix(in srgb, var(--category-primary) 28%, #003E51 72%) 100%)" } : { backgroundColor: "transparent" }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
