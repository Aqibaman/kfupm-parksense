"use client";

import Link from "next/link";
import { CarFront, ChevronRight, MapPinned, ShieldAlert, Sparkles, UserRound } from "lucide-react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { buildDashboardSnapshot } from "@/lib/services/query";

const overviewLinks = [
  { href: "/parking", label: "Parking", helper: "See allowed lots, active space counts, and special-rule lots.", icon: CarFront },
  { href: "/buses", label: "Buses", helper: "Open the live route board and gender-specific shuttle network.", icon: MapPinned },
  { href: "/guidance", label: "Smart Guidance", helper: "See AI recommendations, violation warnings, and next-step alerts in one place.", icon: Sparkles },
  { href: "/rules", label: "Rules", helper: "Read permit rules, lot restrictions, and special notices before parking.", icon: ShieldAlert },
  { href: "/profile", label: "Profile", helper: "Edit account details, permit category, and favorite buildings.", icon: UserRound }
];

export default function DashboardPage() {
  const { user } = useStudentProfile();
  const snapshot = buildDashboardSnapshot(user);

  return (
    <AppShell
      title={`Welcome back, ${snapshot.user.name.split(" ")[0]}`}
      eyebrow="Student Services"
      description="Access parking availability, bus routes, active parking guidance, smart recommendations, and rule-aware decisions from one connected KFUPM mobility dashboard."
    >
      <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b4362_0%,#0a5f5a_52%,#0b7b5b_100%)] px-6 py-6 text-white shadow-[0_30px_90px_rgba(0,62,81,0.18)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#0b6f58]">
              Student Services
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Mobility overview for today</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/85">
              This dashboard brings together the next decisions you need to make right now: where you can park, which route fits your trip, what rules apply to you, and where to go next in the platform.
            </p>
          </div>
          <div className="space-y-3 rounded-[28px] border border-white/15 bg-white/8 p-4 backdrop-blur">
            <CategoryBadge category={snapshot.user.userCategory} />
            <p className="text-sm text-white/80">Preferred buildings: {snapshot.user.favoriteBuildings.join(", ") || "Not selected yet"}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-[#111827]">Overview tiles</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Start directly from the five main student pages used across the mobility platform.</p>
        <SectionGrid cols="md:grid-cols-2 xl:grid-cols-5">
          {overviewLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)] transition hover:-translate-y-0.5 hover:border-[#8ac4a1]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dff6e7_0%,#edf7f2_100%)] text-[#007a4d]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#eff8f3] px-3 py-1 text-xs font-semibold text-[#007a4d]">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <h4 className="mt-5 text-2xl font-semibold text-[#0f172a]">{item.label}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.helper}</p>
              </Link>
            );
          })}
        </SectionGrid>
      </section>
    </AppShell>
  );
}
