import { LIVE_BUS_ROUTES, LIVE_BUS_ROUTE_MAP } from "@/lib/data/live-bus-routes";
import type { ActiveBus, BusSimulationState, LiveMapBusRoute, RouteNetwork, RoutePathPoint, RouteStop, UserCategory } from "@/lib/types";

export const SHOW_INACTIVE_ROUTE_BUSES = false;

type RouteSegment = {
  index: number;
  from: RoutePathPoint;
  to: RoutePathPoint;
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

export function getTraversalPathPoints(route: LiveMapBusRoute) {
  if (route.pathPoints.length < 2) return route.pathPoints;
  return [...route.pathPoints, ...route.pathPoints.slice(0, -1).reverse()];
}

function getForwardPathPoints(routeOrStops: LiveMapBusRoute | RouteStop[]) {
  if (Array.isArray(routeOrStops)) {
    return routeOrStops.map((stop) => ({
      coordinates: stop.coordinates,
      stopId: stop.id,
      stopName: stop.name
    }));
  }

  return routeOrStops.pathPoints;
}

export function getRouteSegments(routeOrStops: LiveMapBusRoute | RouteStop[]): RouteSegment[] {
  const pathPoints = Array.isArray(routeOrStops)
    ? getForwardPathPoints(routeOrStops)
    : getTraversalPathPoints(routeOrStops);

  if (pathPoints.length < 2) return [];

  const forwardSegments = pathPoints.slice(0, -1).map((point, index) => ({
    index,
    from: point,
    to: pathPoints[index + 1],
    direction:
      Array.isArray(routeOrStops) || index < pathPoints.length / 2 - 1
        ? (1 as const)
        : (-1 as const),
    distanceMeters: haversineDistanceMeters(point.coordinates, pathPoints[index + 1].coordinates)
  }));

  return forwardSegments;
}

export function isRouteInService(route: LiveMapBusRoute, now: Date) {
  const currentSeconds = secondsFromDate(now);
  const start = toSeconds(route.schedule.serviceWindow.start);
  const end = toSeconds(route.schedule.serviceWindow.end);
  return currentSeconds >= start && currentSeconds <= end;
}

function getCycleDuration(route: LiveMapBusRoute) {
  const segments = getRouteSegments(route);
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
  const segments = getRouteSegments(route);

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
      const nextStop = getUpcomingStopPointFromPoint(route, segment.index + 1, segment.direction);
      return {
        ...bus,
        segmentIndex: segment.index,
        progress,
        direction: segment.direction,
        status: "running",
        currentCoordinates: interpolateCoordinates(segment.from.coordinates, segment.to.coordinates, progress),
        currentStopId: segment.from.stopId,
        currentStopName: segment.from.stopName,
        nextStopId: nextStop?.stopId,
        nextStopName: nextStop?.stopName
      };
    }

    cursor -= route.segmentTravelSeconds;

    if (cursor <= route.dwellSeconds) {
      const nextStop = getUpcomingStopPointFromPoint(
        route,
        segment.direction === 1 ? segment.index + 2 : segment.index,
        segment.direction
      );
      return {
        ...bus,
        segmentIndex: segment.index,
        progress: 1,
        direction: segment.direction,
        status: "boarding",
        currentCoordinates: segment.to.coordinates,
        currentStopId: segment.to.stopId,
        currentStopName: segment.to.stopName,
        nextStopId: nextStop?.stopId,
        nextStopName: nextStop?.stopName
      };
    }

    cursor -= route.dwellSeconds;
  }

  return bus;
}

function getUpcomingStopPointFromPoint(route: LiveMapBusRoute, startPointIndex: number, direction: 1 | -1) {
  const traversal = getTraversalPathPoints(route);
  if (direction === 1) {
    for (let index = Math.max(startPointIndex, 0); index < traversal.length; index += 1) {
      if (traversal[index].stopId) return traversal[index];
    }
  } else {
    for (let index = Math.min(startPointIndex, traversal.length - 1); index >= 0; index -= 1) {
      if (traversal[index].stopId) return traversal[index];
    }
  }

  return null;
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
      currentCoordinates: route.pathPoints[0]?.coordinates ?? route.stops[0].coordinates,
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
