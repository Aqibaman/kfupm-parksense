import type { Bus, BusRoute, BusStop, BusNetworkType } from "@/lib/types";

export type LiveBusStage = "boarding" | "approaching-stop" | "running";

export interface LiveBusState {
  id: string;
  busCode: string;
  routeId: string;
  networkType: BusNetworkType;
  stage: LiveBusStage;
  currentStopId: string;
  nextStopId: string;
  etaSeconds: number;
  progress: number;
  segmentIndex: number;
  statusText: string;
  routeLoopText: string;
}

export interface LiveRouteState {
  route: BusRoute;
  stops: BusStop[];
  buses: LiveBusState[];
  activeBusCount: number;
  nextArrivalText: string;
}

const STOP_DWELL_SECONDS = 25;
const TRAVEL_SECONDS = 90;
const APPROACHING_THRESHOLD_SECONDS = 20;

function buildVirtualBus(route: BusRoute, networkType: BusNetworkType, index: number): Bus {
  return {
    id: `virtual-${route.id}-${index + 1}`,
    busCode: `${route.routeCode}-${index + 1}`,
    networkType,
    routeId: route.id,
    currentStopId: route.stopIds[0],
    currentLat: 0,
    currentLng: 0,
    etaMeta: "Live simulated service",
    status: "online"
  };
}

function stageLabel(stage: LiveBusStage, currentStop: BusStop, nextStop: BusStop, etaSeconds: number) {
  if (stage === "boarding") {
    return `Boarding at ${currentStop.stopCode}`;
  }

  if (stage === "approaching-stop") {
    return `Approaching ${nextStop.stopCode} in ${etaSeconds}s`;
  }

  return `Running to ${nextStop.stopCode}`;
}

export function buildLiveRouteStates(
  routes: BusRoute[],
  allStops: BusStop[],
  seededBuses: Bus[],
  nowMs: number
) {
  return routes.map<LiveRouteState>((route) => {
    const stops = route.stopIds
      .map((stopId) => allStops.find((stop) => stop.id === stopId))
      .filter((stop): stop is BusStop => Boolean(stop));

    const seededForRoute = seededBuses.filter((bus) => bus.routeId === route.id);
    const minimumBuses = stops.length >= 5 ? 2 : 1;
    const routeBuses =
      seededForRoute.length >= minimumBuses
        ? seededForRoute
        : [
            ...seededForRoute,
            ...Array.from({ length: minimumBuses - seededForRoute.length }, (_, index) =>
              buildVirtualBus(route, route.networkType, seededForRoute.length + index)
            )
          ];

    const cycleUnit = STOP_DWELL_SECONDS + TRAVEL_SECONDS;
    const cycleDuration = Math.max(stops.length, 1) * cycleUnit;

    const buses = routeBuses.map<LiveBusState>((bus, busIndex) => {
      const seededOffset = ((busIndex + 1) * cycleDuration) / routeBuses.length;
      const routeOffset = route.routeCode.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const elapsed = (Math.floor(nowMs / 1000) + routeOffset + Math.floor(seededOffset)) % cycleDuration;
      const segmentIndex = Math.floor(elapsed / cycleUnit) % Math.max(stops.length, 1);
      const segmentElapsed = elapsed % cycleUnit;
      const currentStop = stops[segmentIndex] ?? stops[0];
      const nextStop = stops[(segmentIndex + 1) % Math.max(stops.length, 1)] ?? stops[0];
      const loopTarget = stops[0];

      if (segmentElapsed < STOP_DWELL_SECONDS) {
        const etaSeconds = STOP_DWELL_SECONDS - segmentElapsed;

        return {
          id: bus.id,
          busCode: bus.busCode,
          routeId: route.id,
          networkType: route.networkType,
          stage: "boarding",
          currentStopId: currentStop.id,
          nextStopId: nextStop.id,
          etaSeconds,
          progress: 0,
          segmentIndex,
          statusText: stageLabel("boarding", currentStop, nextStop, etaSeconds),
          routeLoopText: `Loops back to ${loopTarget?.stopCode ?? currentStop.stopCode}`
        };
      }

      const travelElapsed = segmentElapsed - STOP_DWELL_SECONDS;
      const etaSeconds = TRAVEL_SECONDS - travelElapsed;
      const stage: LiveBusStage = etaSeconds <= APPROACHING_THRESHOLD_SECONDS ? "approaching-stop" : "running";

      return {
        id: bus.id,
        busCode: bus.busCode,
        routeId: route.id,
        networkType: route.networkType,
        stage,
        currentStopId: currentStop.id,
        nextStopId: nextStop.id,
        etaSeconds,
        progress: Math.min(Math.max(travelElapsed / TRAVEL_SECONDS, 0), 1),
        segmentIndex,
        statusText: stageLabel(stage, currentStop, nextStop, etaSeconds),
        routeLoopText: `Loops back to ${loopTarget?.stopCode ?? currentStop.stopCode}`
      };
    });

    const nextArrival = [...buses].sort((left, right) => left.etaSeconds - right.etaSeconds)[0];

    return {
      route,
      stops,
      buses,
      activeBusCount: buses.length,
      nextArrivalText: nextArrival ? nextArrival.statusText : "No live bus currently assigned"
    };
  });
}
