import { LIVE_BUS_ROUTES, LIVE_BUS_ROUTE_MAP } from "@/lib/data/live-bus-routes";
import type { ActiveBus, BusSimulationState, LiveMapBusRoute, RouteNetwork, RouteStop, UserCategory } from "@/lib/types";

export const SHOW_INACTIVE_ROUTE_BUSES = false;

type RouteSegment = {
  index: number;
  from: RouteStop;
  to: RouteStop;
  direction: 1 | -1;
  distanceMeters: number;
};

function toSeconds(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

function secondsFromDate(now: Date) {
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

export function getRouteNetworkForCategory(category: UserCategory): RouteNetwork {
  return category.includes("female") ? "female" : "male";
}

export function haversineDistanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
}

export function interpolateCoordinates(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  progress: number
) {
  return {
    lat: a.lat + (b.lat - a.lat) * progress,
    lng: a.lng + (b.lng - a.lng) * progress
  };
}

export function getRouteSegments(stops: RouteStop[]): RouteSegment[] {
  if (stops.length < 2) return [];

  const forwardSegments = stops.slice(0, -1).map((stop, index) => ({
    index,
    from: stop,
    to: stops[index + 1],
    direction: 1 as const,
    distanceMeters: haversineDistanceMeters(stop.coordinates, stops[index + 1].coordinates)
  }));

  const reverseSegments = forwardSegments
    .slice()
    .reverse()
    .map((segment, reverseIndex) => ({
      index: forwardSegments.length + reverseIndex,
      from: segment.to,
      to: segment.from,
      direction: -1 as const,
      distanceMeters: segment.distanceMeters
    }));

  return [...forwardSegments, ...reverseSegments];
}

export function isRouteInService(route: LiveMapBusRoute, now: Date) {
  const currentSeconds = secondsFromDate(now);
  const start = toSeconds(route.schedule.serviceWindow.start);
  const end = toSeconds(route.schedule.serviceWindow.end);
  return currentSeconds >= start && currentSeconds <= end;
}

function getCycleDuration(route: LiveMapBusRoute) {
  const segments = getRouteSegments(route.stops);
  return segments.length * route.segmentTravelSeconds + segments.length * route.dwellSeconds;
}

function formatTimeLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatRouteServiceStatus(route: LiveMapBusRoute, now: Date) {
  const active = isRouteInService(route, now);
  return {
    active,
    label: active ? `In service until ${formatTimeLabel(route.schedule.serviceWindow.end)}` : `Service window ${formatTimeLabel(route.schedule.serviceWindow.start)} to ${formatTimeLabel(route.schedule.serviceWindow.end)}`
  };
}

function resolveBusState(route: LiveMapBusRoute, bus: ActiveBus): ActiveBus {
  const segments = getRouteSegments(route.stops);

  if (!segments.length) {
    return {
      ...bus,
      status: "inactive",
      currentCoordinates: route.stops[0]?.coordinates ?? { lat: 0, lng: 0 }
    };
  }

  const cycleDuration = getCycleDuration(route);
  let cursor = ((bus.phaseSeconds % cycleDuration) + cycleDuration) % cycleDuration;

  for (const segment of segments) {
    if (cursor <= route.segmentTravelSeconds) {
      const progress = Math.min(cursor / route.segmentTravelSeconds, 1);
      return {
        ...bus,
        segmentIndex: segment.index,
        progress,
        direction: segment.direction,
        status: "running",
        currentCoordinates: interpolateCoordinates(segment.from.coordinates, segment.to.coordinates, progress),
        currentStopId: segment.from.id,
        currentStopName: segment.from.name,
        nextStopId: segment.to.id,
        nextStopName: segment.to.name
      };
    }

    cursor -= route.segmentTravelSeconds;

    if (cursor <= route.dwellSeconds) {
      return {
        ...bus,
        segmentIndex: segment.index,
        progress: 1,
        direction: segment.direction,
        status: "boarding",
        currentCoordinates: segment.to.coordinates,
        currentStopId: segment.to.id,
        currentStopName: segment.to.name,
        nextStopId: segment.direction === 1 ? route.stops[Math.min(segment.to.order, route.stops.length - 1)]?.id : route.stops[Math.max(segment.to.order - 2, 0)]?.id,
        nextStopName: segment.direction === 1 ? route.stops[Math.min(segment.to.order, route.stops.length - 1)]?.name : route.stops[Math.max(segment.to.order - 2, 0)]?.name
      };
    }

    cursor -= route.dwellSeconds;
  }

  return bus;
}

export function initializeBusesForRoute(route: LiveMapBusRoute, busCount = route.defaultBusNumbers.length): ActiveBus[] {
  const count = Math.max(3, Math.min(busCount, route.defaultBusNumbers.length));
  const cycleDuration = getCycleDuration(route);

  return route.defaultBusNumbers.slice(0, count).map((busNumber, index) => {
    const phaseSeconds = (cycleDuration / count) * index;

    return resolveBusState(route, {
      id: `${route.id}-${busNumber}`,
      busNumber,
      routeId: route.id,
      segmentIndex: 0,
      progress: 0,
      direction: 1,
      status: "running",
      currentCoordinates: route.stops[0].coordinates,
      nextStopId: route.stops[1]?.id,
      currentStopId: route.stops[0].id,
      phaseSeconds
    });
  });
}

export function tickBusSimulation(
  route: LiveMapBusRoute,
  activeBuses: ActiveBus[],
  deltaMs: number,
  now: Date
) {
  const routeActive = isRouteInService(route, now);

  if (!routeActive && !SHOW_INACTIVE_ROUTE_BUSES) {
    return [];
  }

  return activeBuses.map((bus) =>
    routeActive || SHOW_INACTIVE_ROUTE_BUSES
      ? resolveBusState(route, { ...bus, phaseSeconds: bus.phaseSeconds + deltaMs / 1000 })
      : { ...bus, status: "inactive" as const }
  );
}

export function getNextStop(route: LiveMapBusRoute, bus: ActiveBus) {
  if (!bus.nextStopId) return null;
  return route.stops.find((stop) => stop.id === bus.nextStopId) ?? null;
}

export function buildBusSimulationState(route: LiveMapBusRoute, buses: ActiveBus[], now: Date): BusSimulationState {
  const inService = isRouteInService(route, now);
  return {
    routeId: route.id,
    buses,
    inService,
    lastUpdatedIso: now.toISOString(),
    nextStopSummary: buses.map((bus) => {
      if (bus.status === "boarding") {
        return `${bus.busNumber} boarding at ${bus.currentStopName ?? "current stop"}`;
      }

      if (bus.status === "inactive") {
        return `${bus.busNumber} is out of service`;
      }

      return `${bus.busNumber} running to ${bus.nextStopName ?? "next stop"}`;
    })
  };
}

export function getRouteById(routeId: string) {
  return LIVE_BUS_ROUTE_MAP[routeId];
}

export function getRoutesForNetwork(network: RouteNetwork) {
  return LIVE_BUS_ROUTES.filter((route) => route.network === network);
}
