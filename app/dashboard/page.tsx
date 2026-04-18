"use client";

import Link from "next/link";
import { CarFront, ChevronRight, LogIn, MapPinned, ShieldAlert, Sparkles, UserRound, UserPlus } from "lucide-react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { MetricCard, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { getPermissionWindow } from "@/lib/engines/rules";
import { buildDashboardSnapshot } from "@/lib/services/query";

const overviewLinks = [
  { href: "/parking", label: "Parking", helper: "See allowed lots, active space counts, and special-rule lots.", icon: CarFront },
  { href: "/buses", label: "Buses", helper: "Open the live route board and gender-specific shuttle network.", icon: MapPinned },
  { href: "/guidance", label: "Smart Guidance", helper: "See AI recommendations, violation warnings, and next-step alerts in one place.", icon: Sparkles },
  { href: "/rules", label: "Rules", helper: "Read permit rules, lot restrictions, and special notices before parking.", icon: ShieldAlert },
  { href: "/profile", label: "Profile", helper: "Edit account details, permit category, and favorite buildings.", icon: UserRound }
];

const journeySteps = [
  {
    title: "Create Account",
    text: "Student registers, selects the permit category, and saves preferred academic buildings.",
    icon: UserPlus,
    tone: "bg-[#e8f5ee] text-[#008540]"
  },
  {
    title: "Login",
    text: "Student enters the platform and the selected permit controls what they can see next.",
    icon: LogIn,
    tone: "bg-[#edf7f2] text-[#0b5b72]"
  },
  {
    title: "Dashboard",
    text: "The dashboard gives one quick overview of parking, buses, guidance, rules, and profile tools.",
    icon: Sparkles,
    tone: "bg-[#eef5fb] text-[#0b5b72]"
  },
  {
    title: "Parking",
    text: "Parking shows only legal lots, floor restrictions, slot availability, and active parked-session controls.",
    icon: CarFront,
    tone: "bg-[#e8f5ee] text-[#008540]"
  },
  {
    title: "Buses",
    text: "Buses shows the correct male or female route network with live route movement and stop guidance.",
    icon: MapPinned,
    tone: "bg-[#edf7f2] text-[#0b5b72]"
  },
  {
    title: "Smart Guidance",
    text: "Smart Guidance keeps helping during the parked session with nearest bus stop and preferred-building advice.",
    icon: Sparkles,
    tone: "bg-[#eef8f2] text-[#008540]"
  },
  {
    title: "Rules + Profile",
    text: "Rules explains permit logic while Profile lets the student update category, favorites, and alerts.",
    icon: UserRound,
    tone: "bg-[#f2fbf6] text-[#0b5b72]"
  }
];

export default function DashboardPage() {
  const { user } = useStudentProfile();
  const snapshot = buildDashboardSnapshot(user);
  const permissionWindow = getPermissionWindow(snapshot.user);

  return (
    <AppShell
      title={`Welcome back, ${snapshot.user.name.split(" ")[0]}`}
      eyebrow="Student Services"
      description="Access parking availability, bus routes, active parking session timing, smart recommendations, and violation warnings from one connected KFUPM mobility dashboard."
    >
      <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b4362_0%,#0a5f5a_52%,#0b7b5b_100%)] px-6 py-6 text-white shadow-[0_30px_90px_rgba(0,62,81,0.18)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#0b6f58]">
              Student Services
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Mobility overview for today</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/85">
              This dashboard brings together the next decisions you need to make right now: where you can park, which route fits your trip, how long you can stay, and what action to take before a rule becomes a violation.
            </p>
          </div>
          <div className="space-y-3 rounded-[28px] border border-white/15 bg-white/8 p-4 backdrop-blur">
            <CategoryBadge category={snapshot.user.userCategory} />
            <p className="text-sm text-white/80">Preferred buildings: {snapshot.user.favoriteBuildings.join(", ") || "Not selected yet"}</p>
          </div>
        </div>
      </section>

      <SectionGrid cols="md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Allowed lots now" value={String(snapshot.allowedLots.length)} helper="Computed from your permit, prohibitions, and Building 64 logic." />
        <MetricCard label="Safe until" value={permissionWindow.safeUntil.split("T")[1].slice(0, 5)} helper={permissionWindow.summary} />
        <MetricCard label="Visible routes" value={String(snapshot.routes.filter((route) => route.networkType === snapshot.user.gender).length)} helper="Only the relevant male or female network is shown." />
        <MetricCard label="Unread warnings" value={String(snapshot.notifications.filter((notification) => !notification.readAt).length)} helper="Push-style notifications are armed for rule cutoffs and route reminders." />
      </SectionGrid>

      <section>
        <h3 className="text-2xl font-semibold text-[#111827]">How to use this system</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Follow the connected student flow below to understand how registration, login, and the main mobility pages work together.
        </p>
        <Card className="mt-5 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
          <div className="grid gap-4 xl:grid-cols-7">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === journeySteps.length - 1;

              return (
                <div key={step.title} className="relative rounded-[24px] border border-[#dbe9e1] bg-white p-4 shadow-[0_10px_30px_rgba(0,62,81,0.05)]">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-[#0f172a]">{step.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
                  {!isLast ? (
                    <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 xl:flex">
                      <div className="flex items-center rounded-full border border-[#dbe9e1] bg-[#f5faf7] px-2 py-1 text-[#008540] shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-[#111827]">Overview tiles</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Jump directly into the five main student pages used across the mobility platform.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
        </div>
      </section>
    </AppShell>
  );
}
