"use client";

import Link from "next/link";
import { ArrowRight, CarFront, ChevronRight, LogIn, MapPinned, Route, ShieldAlert, Sparkles, UserRound, UserPlus } from "lucide-react";
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

const journeyHighlights = [
  {
    title: "Permit-aware entry",
    text: "Registration and login immediately shape the lots, routes, and rules the student sees.",
    icon: UserPlus
  },
  {
    title: "Live mobility layer",
    text: "Parking, buses, and guidance stay synchronized while the student moves through campus.",
    icon: Route
  },
  {
    title: "Safer decisions",
    text: "Rules, alerts, and profile preferences work together to prevent violations before they happen.",
    icon: ShieldAlert
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
        <Card className="mt-5 overflow-hidden border-[#cae5d9] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_52%,#eef8f2_100%)] p-0">
          <div className="border-b border-[#dbe9e1] bg-[radial-gradient(circle_at_top_left,rgba(0,133,64,0.13),transparent_38%),radial-gradient(circle_at_top_right,rgba(11,91,114,0.14),transparent_42%),linear-gradient(135deg,#f8fcfa_0%,#eef8f2_100%)] px-6 py-6">
            <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.30em] text-[#008540]">Connected student journey</p>
                <h4 className="mt-3 text-3xl font-semibold tracking-tight text-[#0f172a]">From account setup to confident parking decisions</h4>
                <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
                  The dashboard is the student’s command center. It begins with permit setup, then continuously connects parking visibility, route guidance, live alerts, and profile preferences into one experience.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {journeyHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="min-w-[220px] flex-1 rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-[0_16px_35px_rgba(0,62,81,0.06)] backdrop-blur">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dff6e7_0%,#eef8f2_100%)] text-[#008540]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-base font-semibold text-[#0f172a]">{item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_35px_rgba(0,62,81,0.06)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0b5b72]">Experience map</p>
                <div className="mt-5 space-y-3">
                  {[
                    "Register permit and preferred buildings",
                    "Login and unlock category-aware campus view",
                    "Use dashboard to jump into the right tool",
                    "Park, ride, and monitor rules without switching systems"
                  ].map((line, index) => (
                    <div key={line} className="flex items-start gap-3 rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-sm font-semibold text-[#008540]">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-slate-600">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative px-6 py-6">
            <div className="pointer-events-none absolute left-10 right-10 top-[78px] hidden h-[2px] bg-[linear-gradient(90deg,rgba(0,133,64,0.12)_0%,rgba(0,133,64,0.45)_20%,rgba(11,91,114,0.28)_50%,rgba(0,133,64,0.45)_80%,rgba(0,133,64,0.12)_100%)] xl:block" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
              {journeySteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === journeySteps.length - 1;

                return (
                  <div
                    key={step.title}
                    className="group relative overflow-hidden rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfa_100%)] p-5 shadow-[0_14px_40px_rgba(0,62,81,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(0,62,81,0.10)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0b5b72_0%,#008540_100%)] opacity-80" />
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(0,133,64,0.12)_0%,transparent_72%)]" />
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-[20px] ${step.tone} shadow-[0_14px_30px_rgba(0,133,64,0.10)]`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xl font-semibold text-[#0f172a]">{step.title}</p>
                      <span className="rounded-full bg-[#eef8f2] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b5b72]">
                        Step {index + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
                    {!isLast ? (
                      <div className="mt-5 flex items-center justify-end xl:hidden">
                        <div className="flex items-center rounded-full border border-[#dbe9e1] bg-white px-2.5 py-1.5 text-[#008540] shadow-sm">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    ) : null}
                    {!isLast ? (
                      <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 xl:flex">
                        <div className="flex items-center rounded-full border border-[#dbe9e1] bg-white px-2.5 py-1.5 text-[#008540] shadow-[0_10px_24px_rgba(0,62,81,0.08)]">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
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
