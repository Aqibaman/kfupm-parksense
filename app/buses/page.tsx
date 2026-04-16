import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { RouteTimeline } from "@/components/cards/route-timeline";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { buses, busRoutes, busStops } from "@/lib/data/kfupm-data";

export default function BusesPage() {
  const maleRoute = busRoutes.find((route) => route.id === "route-m1")!;
  const femaleRoute = busRoutes.find((route) => route.id === "route-f2")!;
  const maleBus = buses.find((bus) => bus.routeId === maleRoute.id)!;
  const femaleBus = buses.find((bus) => bus.routeId === femaleRoute.id)!;

  return (
    <AppShell
      title="Bus Tracking and Route Assistance"
      eyebrow="Transit Layer"
      description="Separate male and female route systems, current bus positions, nearby stop guidance, and Building 64 transfer support are integrated with the parking layer."
    >
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <BusETAWidget bus={maleBus} route={maleRoute} stop={busStops.find((stop) => stop.id === maleBus.currentStopId)!} />
        <BusETAWidget bus={femaleBus} route={femaleRoute} stop={busStops.find((stop) => stop.id === femaleBus.currentStopId)!} />
      </SectionGrid>
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <RouteTimeline route={maleRoute} stops={busStops.filter((stop) => maleRoute.stopIds.includes(stop.id))} />
        <RouteTimeline route={femaleRoute} stops={busStops.filter((stop) => femaleRoute.stopIds.includes(stop.id))} />
      </SectionGrid>
      <InfoPanel
        title="Where is my bus?"
        subtitle="Search support can later be wired to route handlers and live GPS feeds."
        items={[
          { label: "Lot 64 nearest stop", value: "Station 316" },
          { label: "Suggested male option", value: "M3 DTV shuttle or M1 loop depending on destination" },
          { label: "Suggested female option", value: "F2 loop or F8 shuttle depending on destination" },
          { label: "If walking is faster", value: "Surface direct walking recommendation instead of bus" }
        ]}
      />
    </AppShell>
  );
}
