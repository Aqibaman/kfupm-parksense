"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { ActiveBusesPanel } from "@/components/cards/active-buses-panel";
import { LiveRouteMap } from "@/components/cards/live-route-map";
import { MapLegend } from "@/components/cards/map-legend";
import { RouteSelector } from "@/components/cards/route-selector";
import { RouteSummaryCard } from "@/components/cards/route-summary-card";
import { RouteTimetableCard } from "@/components/cards/route-timetable-card";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { LIVE_BUS_ROUTES } from "@/lib/data/live-bus-routes";
import {
  buildBusSimulationState,
  formatRouteServiceStatus,
  getRouteById,
  getRouteNetworkForCategory,
  getRoutesForNetwork,
  initializeBusesForRoute,
  tickBusSimulation
} from "@/lib/services/bus-route-simulation";
import type { ActiveBus } from "@/lib/types";

const storageKey = "parkwise-selected-bus-route";

export default function BusesPage() {
  const { user } = useStudentProfile();
  const network = getRouteNetworkForCategory(user.userCategory);
  const routes = useMemo(() => getRoutesForNetwork(network), [network]);
  const [selectedRouteId, setSelectedRouteId] = useState(() => routes[0]?.id ?? LIVE_BUS_ROUTES[0]?.id ?? "");
  const [activeBuses, setActiveBuses] = useState<ActiveBus[]>([]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(`${storageKey}-${network}`);
    const nextRouteId = stored && routes.some((route) => route.id === stored) ? stored : routes[0]?.id ?? "";
    setSelectedRouteId(nextRouteId);
  }, [network, routes]);

  useEffect(() => {
    if (typeof window === "undefined" || !selectedRouteId) return;
    window.localStorage.setItem(`${storageKey}-${network}`, selectedRouteId);
  }, [network, selectedRouteId]);

  const selectedRoute = useMemo(() => getRouteById(selectedRouteId) ?? routes[0], [routes, selectedRouteId]);

  useEffect(() => {
    if (!selectedRoute) return;
    setActiveBuses(initializeBusesForRoute(selectedRoute));
    setNow(new Date());
  }, [selectedRoute]);

  useEffect(() => {
    if (!selectedRoute) return;
    const timer = window.setInterval(() => {
      const nextNow = new Date();
      setNow(nextNow);
      setActiveBuses((current) => tickBusSimulation(selectedRoute, current.length ? current : initializeBusesForRoute(selectedRoute), 1000, nextNow));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [selectedRoute]);

  const simulationState = useMemo(
    () => (selectedRoute ? buildBusSimulationState(selectedRoute, activeBuses, now) : null),
    [activeBuses, now, selectedRoute]
  );

  if (!selectedRoute || !simulationState) {
    return (
      <AppShell
        title="Bus Tracking and Route Assistance"
        eyebrow="Transit Layer"
        description="Follow the live university shuttle network using a route-aware map, real stop positions, and moving buses."
      >
        <Card>
          <CardTitle title="No route available" subtitle="Bus route data could not be loaded for the current network." />
        </Card>
      </AppShell>
    );
  }

  const serviceStatus = formatRouteServiceStatus(selectedRoute, now);

  return (
    <AppShell
      title="Bus Tracking and Route Assistance"
      eyebrow="Transit Layer"
      description="Select the live route for your network, follow buses on a free real map, and track active service timing for each campus shuttle."
    >
      <div className="min-w-0 max-w-full space-y-4 overflow-x-hidden md:space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={user.userCategory} />
          <span className="rounded-full border border-[#dbe9e1] bg-[#f8fbf9] px-4 py-2 text-sm font-medium text-slate-700">
            Showing the {network} network only
          </span>
        </div>

        <RouteSelector routes={routes} selectedRouteId={selectedRoute.id} onSelect={setSelectedRouteId} />

        <div className="grid min-w-0 max-w-full grid-cols-1 gap-4 md:gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,360px)] 2xl:grid-cols-[minmax(0,1.45fr)_380px]">
          <Card className="min-w-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)] p-3 sm:p-4 md:p-5">
            <CardTitle
              title="Live bus route map"
              subtitle="This view uses a free OpenStreetMap base with real route stops and continuously moving buses for the selected service."
            />
            <div className="min-w-0 rounded-[24px] bg-[linear-gradient(180deg,#f7fbf8_0%,#ffffff_100%)] p-2 sm:p-3 md:p-4">
              <LiveRouteMap route={selectedRoute} buses={simulationState.buses} />
            </div>
            <div className="mt-4">
              <MapLegend />
            </div>
          </Card>

          <div className="min-w-0 max-w-full space-y-4 md:space-y-5">
            <RouteSummaryCard
              route={selectedRoute}
              activeBusCount={simulationState.buses.length}
              serviceStatus={serviceStatus}
              nextStopSummaries={simulationState.nextStopSummary}
            />
            <ActiveBusesPanel buses={simulationState.buses} />
            <RouteTimetableCard route={selectedRoute} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
