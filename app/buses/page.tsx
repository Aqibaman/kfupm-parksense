"use client";

import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { RouteTimeline } from "@/components/cards/route-timeline";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { buses, busRoutes, busStops } from "@/lib/data/kfupm-data";

export default function BusesPage() {
  const { user } = useStudentProfile();
  const networkType = user.gender === "male" ? "male" : "female";
  const filteredRoutes = busRoutes.filter((route) => route.networkType === networkType);
  const filteredBuses = buses.filter((bus) => bus.networkType === networkType);

  return (
    <AppShell
      title="Bus Tracking and Route Assistance"
      eyebrow="Transit Layer"
      description="The bus layer now respects the student profile: male students only see the male network and female students only see the female network, while still keeping Building 64 transfer guidance visible."
    >
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge category={user.userCategory} />
        <span className="rounded-full border border-[#003E51]/15 bg-white px-4 py-2 text-sm text-slate-700">
          Showing {networkType} bus routes only
        </span>
      </div>
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        {filteredBuses.slice(0, 2).map((bus) => {
          const route = filteredRoutes.find((item) => item.id === bus.routeId)!;
          const stop = busStops.find((item) => item.id === bus.currentStopId)!;

          return <BusETAWidget key={bus.id} bus={bus} route={route} stop={stop} />;
        })}
      </SectionGrid>
      <div className="grid gap-4 xl:grid-cols-2">
        {filteredRoutes.map((route) => (
          <RouteTimeline key={route.id} route={route} stops={busStops.filter((stop) => route.stopIds.includes(stop.id))} />
        ))}
      </div>
      <InfoPanel
        title="Where is my bus?"
        subtitle="Search support can later be wired to route handlers and live GPS feeds."
        items={[
          { label: "Lot 64 nearest stop", value: "Station 316" },
          { label: "Suggested network", value: networkType === "male" ? "M3 DTV shuttle or M1 loop depending on destination" : "F2 loop or F8 shuttle depending on destination" },
          { label: "If walking is faster", value: "Surface direct walking recommendation instead of bus" }
        ]}
      />
    </AppShell>
  );
}
