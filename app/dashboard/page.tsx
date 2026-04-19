"use client";

import Link from "next/link";
import { CarFront, ChevronRight, LogIn, MapPinned, ShieldAlert, Sparkles, SquareArrowOutUpRight, UserRound, UserPlus } from "lucide-react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SectionGrid } from "@/components/layout/sections";
import { useParkingSession } from "@/components/providers/parking-session-provider";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { parkingLocations } from "@/lib/data/parking-locations";
import { normalizeLotId } from "@/lib/engines/preferred-building-guidance";
import { buildDashboardSnapshot } from "@/lib/services/query";

const overviewLinks = [
  { href: "/parking", label: "Parking", helper: "See allowed lots, active space counts, and special-rule lots.", icon: CarFront },
  { href: "/buses", label: "Buses", helper: "Open the live route board and gender-specific shuttle network.", icon: MapPinned },
  { href: "/guidance", label: "Smart Guidance", helper: "See AI recommendations, violation warnings, and next-step alerts in one place.", icon: Sparkles },
  { href: "/rules", label: "Policy Guide", helper: "Read permit rules, lot restrictions, and special notices before parking.", icon: ShieldAlert },
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
    title: "Smart Guidance",
    text: "Follow alerts, destination guidance, and permit-aware next steps during the trip.",
    icon: Sparkles
  },
  {
    title: "Policy Guide",
    text: "Review permit rules, lot restrictions, and key notices before parking.",
    icon: ShieldAlert
  },
  {
    title: "Profile",
    text: "Update category, preferred buildings, and account details in one place.",
    icon: UserRound
  }
];

export default function DashboardPage() {
  const { user } = useStudentProfile();
  const { activeSession, parkingPageData, now, stopSession } = useParkingSession();
  const snapshot = buildDashboardSnapshot(user);
  const activeLotName = activeSession
    ? parkingLocations.find((lot) => normalizeLotId(lot.id) === normalizeLotId(activeSession.canonicalLotId))?.name ?? activeSession.lotId
    : null;

  return (
    <AppShell
      title={`Welcome back, ${snapshot.user.name.split(" ")[0]}`}
      titleMeta={`Student ID: ${snapshot.user.studentId}`}
      eyebrow="Student Services"
      description="ParkWise brings your parking decisions, shuttle routes, permit guidance, and next-step actions into one connected KFUPM mobility workspace, so you can move through campus with more clarity and fewer violations."
    >
      <section className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.30em] text-[#0b5b72]">ParkWise overview</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              ParkWise helps you see where you can park, which shuttle network fits your route, and what permit rules matter before a restriction becomes a violation.
            </p>
          </div>
          <div className="space-y-3 rounded-[24px] border border-[#dbe9e1] bg-[#f8fbf9] px-4 py-4">
            <CategoryBadge category={snapshot.user.userCategory} />
            <p className="text-sm text-slate-600">Preferred buildings: {snapshot.user.favoriteBuildings.join(", ") || "Not selected yet"}</p>
          </div>
        </div>
      </section>

      {activeSession && parkingPageData ? (
        <section>
          <SectionGrid cols="md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Parking lot</p>
              <h4 className="mt-4 text-2xl font-semibold text-[#0f172a]">{activeLotName}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">Current active lot for your parked session.</p>
            </div>
            <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Reserved slot</p>
              <h4 className="mt-4 text-2xl font-semibold text-[#0f172a]">{activeSession.slotId}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{activeSession.floorKey ?? "Ground / open area"} selected for the active session.</p>
            </div>
            <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Time parked</p>
              <h4 className="mt-4 text-2xl font-semibold text-[#003E51]">{formatElapsed(activeSession.parkedAt, now)}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">This timer stays live until you click I left.</p>
            </div>
            <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Leave by</p>
              <h4 className="mt-4 text-2xl font-semibold text-[#008540]">{parkingPageData.ruleResult.leaveByTime ?? "No time limit"}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {parkingPageData.ruleResult.permitStatus === "unauthorized" ? "This parked session needs attention." : "Use this deadline to leave on time and avoid a violation."}
              </p>
            </div>
            <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-5 shadow-[0_18px_50px_rgba(0,62,81,0.07)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Permit status</p>
              <h4 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {parkingPageData.ruleResult.permitStatus === "allowed"
                  ? "Allowed"
                  : parkingPageData.ruleResult.permitStatus === "restricted"
                    ? "Restricted"
                    : "Unauthorized"}
              </h4>
              <button
                type="button"
                onClick={stopSession}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#d94b5a] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(217,75,90,0.18)] transition hover:bg-[#c73b4a]"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
                I left
              </button>
            </div>
          </SectionGrid>
        </section>
      ) : null}

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
        <Card className="mt-5 overflow-hidden border-[#cae5d9] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_52%,#eef8f2_100%)] p-5 lg:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardFlow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className="relative h-full rounded-[30px] border border-[#dbe9e1] bg-white px-5 py-4 shadow-[0_18px_42px_rgba(0,62,81,0.06)]">
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-[30px] bg-[linear-gradient(90deg,#0b5b72_0%,#008540_100%)]" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#dff6e7_0%,#eef8f2_100%)] text-[#008540] shadow-[0_14px_30px_rgba(0,133,64,0.10)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="shrink-0 rounded-full bg-[#eef8f2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0b5b72]">
                        Step {index + 1}
                      </span>
                    </div>
                    <h4 className="mt-4 text-[1.15rem] font-semibold leading-7 text-[#0f172a]">{step.title}</h4>
                    <p className="mt-2 text-[13px] leading-6 text-slate-600">{step.text}</p>
                  </div>
                  {index !== dashboardFlow.length - 1 ? (
                    <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#dbe9e1] bg-white text-[#008540] shadow-[0_10px_24px_rgba(0,62,81,0.08)] xl:flex">
                      <ChevronRight className="h-4 w-4" />
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

function formatElapsed(startedAt: string, now: Date) {
  const elapsed = Math.max(now.getTime() - new Date(startedAt).getTime(), 0);
  const totalSeconds = Math.floor(elapsed / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
