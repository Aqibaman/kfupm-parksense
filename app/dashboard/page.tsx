"use client";

import Link from "next/link";
import { ArrowDown, CarFront, ChevronRight, LogIn, MapPinned, ShieldAlert, Sparkles, UserRound, UserPlus } from "lucide-react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
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

const dashboardFlow = [
  {
    title: "Create Account",
    text: "Register, select the permit category, and save preferred buildings.",
    icon: UserPlus
  },
  {
    title: "Login",
    text: "Enter the platform and unlock the permit-aware student experience.",
    icon: LogIn
  },
  {
    title: "Dashboard",
    text: "See the five connected tools that support the full mobility journey.",
    icon: Sparkles
  },
  {
    title: "Parking",
    text: "Pick legal lots, check slot visibility, and start a parked session.",
    icon: CarFront
  },
  {
    title: "Buses",
    text: "Open the relevant route network and track the next movement layer.",
    icon: MapPinned
  },
  {
    title: "Smart Guidance + Rules",
    text: "Follow active alerts, guidance, and profile-based rule decisions until the trip is complete.",
    icon: ShieldAlert
  }
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

      <section>
        <h3 className="text-2xl font-semibold text-[#111827]">How to use this system</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Follow the connected student flow below to understand how the platform works from entry to action.</p>
        <Card className="mt-5 overflow-hidden border-[#cae5d9] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_52%,#eef8f2_100%)] p-6">
          <div className="relative space-y-5">
            <div className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-[4px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(11,91,114,0.10)_0%,rgba(0,133,64,0.45)_18%,rgba(11,91,114,0.18)_50%,rgba(0,133,64,0.45)_82%,rgba(11,91,114,0.08)_100%)] lg:block" />
            {dashboardFlow.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === dashboardFlow.length - 1;
              return (
                <div
                  key={step.title}
                  className={`relative mx-auto max-w-5xl lg:grid lg:grid-cols-2 ${index % 2 === 0 ? "lg:[&>*:first-child]:col-start-1" : "lg:[&>*:first-child]:col-start-2"}`}
                >
                  <div className="relative rounded-[30px] border border-[#dbe9e1] bg-white p-6 shadow-[0_18px_42px_rgba(0,62,81,0.06)] lg:max-w-[440px] lg:w-full lg:justify-self-center">
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-[30px] bg-[linear-gradient(90deg,#0b5b72_0%,#008540_100%)]" />
                    <div
                      className={`pointer-events-none absolute top-1/2 hidden h-[2px] w-12 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(11,91,114,0.2)_0%,rgba(0,133,64,0.55)_100%)] lg:block ${
                        index % 2 === 0 ? "right-[-3rem]" : "left-[-3rem] rotate-180"
                      }`}
                    />
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#dff6e7_0%,#eef8f2_100%)] text-[#008540] shadow-[0_14px_30px_rgba(0,133,64,0.10)]">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-[#eef8f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b5b72]">
                        Step {index + 1}
                      </span>
                    </div>
                    <h4 className="mt-5 text-3xl font-semibold text-[#0f172a]">{step.title}</h4>
                    <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600">{step.text}</p>
                  </div>
                  {!isLast ? (
                    <div className="flex justify-center py-2 lg:col-span-2">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#dbe9e1] bg-white text-[#008540] shadow-[0_10px_24px_rgba(0,62,81,0.08)]">
                        <ArrowDown className="h-5 w-5" />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
