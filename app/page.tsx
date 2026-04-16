import Link from "next/link";
import { ArrowRight, Bus, Cpu, MapPinned, ShieldAlert, Sparkles } from "lucide-react";
import { appDescription, appName, hardwareInventory, systemPipeline } from "@/lib/constants";
import { challengeThemes, parkingLots, violationHotspots } from "@/lib/data/kfupm-data";
import { CTAGroup, SectionGrid } from "@/components/layout/sections";
import { Card, CardTitle } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#e2e8f0_45%,#f8fafc_100%)] px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-slate-950 text-white shadow-[0_30px_120px_rgba(15,23,42,0.45)]">
          <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-sky-200">KFUPM Mobility Solutions Challenge</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight lg:text-7xl">{appName}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{appDescription}</p>
              <div className="mt-8">
                <CTAGroup
                  items={[
                    { href: "/register", label: "Register demo account" },
                    { href: "/login", label: "Login to platform", variant: "light" },
                    { href: "/dashboard", label: "Explore dashboard", variant: "light" }
                  ]}
                />
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Tracked parking lots", value: String(parkingLots.length) },
                  { label: "Challenge mentions analyzed", value: "445" },
                  { label: "Violation records studied", value: "3,149" },
                  { label: "IoT sensor pathway", value: "Edge-ready" }
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/10 text-white backdrop-blur">
                <CardTitle title="Smart mobility control loop" subtitle="Prepared for live hardware later, fully demoable now." />
                <div className="space-y-3">
                  {systemPipeline.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 text-sm font-semibold text-sky-100">{index + 1}</span>
                      <span className="text-sm text-slate-100">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="bg-white/10 text-white backdrop-blur">
                <CardTitle title="Competition-ready focus" subtitle="Problem understanding, feasibility, and operational fit are built into the product story." />
                <Link href="/competition-insights" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200">
                  Read challenge insights <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        <SectionGrid cols="lg:grid-cols-3">
          {[
            {
              icon: MapPinned,
              title: "Live parking intelligence",
              body: "Students can see free lots, free slots, legal access, and parking pressure before they start driving."
            },
            {
              icon: Bus,
              title: "Bus route assistance",
              body: "Male and female bus systems are linked to parking decisions, ETA cards, and route-to-building guidance."
            },
            {
              icon: ShieldAlert,
              title: "Rule-aware alerts",
              body: "The platform warns before a violation happens, especially for 10:00 PM commuter cutoffs and Building 64 restrictions."
            },
            {
              icon: Sparkles,
              title: "Explainable AI guidance",
              body: "Recommendations are scored using legal access, occupancy, bus proximity, walking convenience, and violation risk."
            },
            {
              icon: Cpu,
              title: "IoT-ready architecture",
              body: "Every slot can connect to a sensor node, ESP32 collector, Raspberry Pi gateway, and cloud-friendly API layer."
            },
            {
              icon: ArrowRight,
              title: "Operations dashboard",
              body: "Admins can monitor lot utilization, sensor health, bus status, rule changes, and violation hotspots from one workspace."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </Card>
            );
          })}
        </SectionGrid>

        <SectionGrid cols="xl:grid-cols-[1.1fr_0.9fr]">
          <ChartBars title="Student pain points from the shared report" subtitle="Seeded from the challenge survey summary." items={challengeThemes} tone="bg-fuchsia-500" />
          <ChartBars title="Top violation hotspots" subtitle="Building 64 is the largest operational tension point in the analytics." items={violationHotspots} tone="bg-rose-500" />
        </SectionGrid>

        <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardTitle title="Hardware and implementation realism" subtitle="This project treats feasibility as a core design requirement, not an afterthought." />
            <div className="grid gap-3">
              {hardwareInventory.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle title="Core product pages" subtitle="Full student, admin, and competition storytelling flows are included." />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "/dashboard",
                "/parking",
                "/buses",
                "/recommendations",
                "/notifications",
                "/rules",
                "/architecture",
                "/implementation"
              ].map((href) => (
                <Link key={href} href={href} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
                  {href}
                </Link>
              ))}
            </div>
          </Card>
        </SectionGrid>
      </div>
    </main>
  );
}
