"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, BusFront, CarFront, CircleUserRound, Cpu, Gauge, Home, LogOut, Map, ShieldCheck, Sparkles } from "lucide-react";
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
  "Policy Guide": ShieldCheck,
  Profile: CircleUserRound,
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
  titleMeta,
  eyebrow,
  description,
  admin = false
}: {
  children: ReactNode;
  title: string;
  titleMeta?: ReactNode;
  eyebrow: string;
  description: string;
  admin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const primaryItems = admin ? adminNavigation : mainNavigation;
  const { signOut } = useStudentProfile();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#edf6f1_0%,#ffffff_38%,#f4faf6_100%)] pb-20 lg:pb-0">
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
        <main className="min-w-0 space-y-6 overflow-x-hidden">
          <section className="rounded-[32px] border border-white/20 bg-[linear-gradient(135deg,#0b4362_0%,#0a5e59_54%,#0b7a5c_100%)] px-5 py-6 text-white shadow-[0_24px_80px_rgba(0,62,81,0.12)] lg:px-7">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d8f6e3]">{eyebrow}</p>
            <div className="mt-3">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h2>
                    {titleMeta ? <div className="mt-2 text-sm font-medium text-white/78">{titleMeta}</div> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      router.push("/login");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,62,81,0.14)] backdrop-blur transition hover:bg-white/12"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
                <div className="mt-4 w-full max-w-4xl rounded-[26px] border border-white/14 bg-white/8 px-5 py-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.30em] text-[#d8f6e3]">What This Page Helps You Do</p>
                  <p className="mt-3 text-sm leading-7 text-white/84 lg:text-base">{description}</p>
                </div>
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
        "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        active ? "text-white" : "text-white/84 hover:text-white",
        compact && "py-2.5 text-[13px]"
      )}
      style={
        active
          ? {
              background: "linear-gradient(135deg, #0b4362 0%, color-mix(in srgb, var(--category-primary) 38%, #0b6e56 62%) 100%)",
              boxShadow: "0 10px 24px rgba(0, 62, 81, 0.12), inset 0 1px 0 rgba(255,255,255,0.08)"
            }
          : { backgroundColor: "transparent" }
      }
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {active ? <span className="h-3 w-3 rounded-full bg-[#59f0d0] shadow-[0_0_14px_rgba(89,240,208,0.32)]" /> : null}
    </Link>
  );
}
