"use client";

import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { BusNetworkMap } from "@/components/cards/bus-network-map";
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
  const relevantStops = busStops.filter((stop) => filteredRoutes.some((route) => route.stopIds.includes(stop.id)));

  return (
    <AppShell
      title="Bus Tracking and Route Assistance"
      eyebrow="Transit Layer"
      description="Students only see the bus network relevant to their category. Male students get the male route map, female students get the female route map, with Building 64 transfer guidance kept visible."
    >
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge category={user.userCategory} />
        <span className="rounded-full border border-[#dbe9e1] bg-[#f8fbf9] px-4 py-2 text-sm font-medium text-slate-700">
          Showing the {networkType} network only
        </span>
      </div>

      <BusNetworkMap networkLabel={networkType === "male" ? "Male" : "Female"} routes={filteredRoutes} stops={relevantStops} activeBuses={filteredBuses} />

      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        {filteredBuses.map((bus) => {
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
        title="Where do I go after parking?"
        subtitle="Quick transfer guidance from lots into the shuttle network."
        items={[
          { label: "Lot 64 nearest stop", value: networkType === "male" ? "Station 316 for M3 or M4" : "Station 316 then F8 connector" },
          { label: "Housing-side transfer", value: networkType === "male" ? "Stations 301 to 306" : "Parking 900 and Station 404" },
          { label: "If walking is faster", value: "The recommendation engine can suggest walking instead of a shuttle transfer" }
        ]}
      />
    </AppShell>
  );
}
