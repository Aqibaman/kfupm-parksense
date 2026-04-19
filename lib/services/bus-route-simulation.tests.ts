import { LIVE_BUS_ROUTE_MAP } from "@/lib/data/live-bus-routes";
import {
  formatRouteServiceStatus,
  getRouteNetworkForCategory,
  getRouteSegments,
  initializeBusesForRoute,
  tickBusSimulation
} from "@/lib/services/bus-route-simulation";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runBusRouteSimulationTests() {
  const maleRoute1 = LIVE_BUS_ROUTE_MAP.male_route_1;
  const maleRoute2 = LIVE_BUS_ROUTE_MAP.male_route_2;
  const femaleRoute6 = LIVE_BUS_ROUTE_MAP.female_route_6;
  const femaleRoute2 = LIVE_BUS_ROUTE_MAP.female_route_2;
  const maleRoute3 = LIVE_BUS_ROUTE_MAP.male_route_3;

  assert(getRouteNetworkForCategory("resident-male") === "male", "Male categories should resolve to male route network.");
  assert(getRouteNetworkForCategory("resident-female") === "female", "Female categories should resolve to female route network.");

  const maleRoute1Segments = getRouteSegments(maleRoute1);
  assert(maleRoute1Segments.length > maleRoute1.stops.length - 1, "Shuttle routes should include both forward and reverse segments.");
  assert(maleRoute2.pathPoints.length > maleRoute2.stops.length, "Male Route 2 should use extra road waypoints rather than straight stop-to-stop lines.");
  assert(femaleRoute2.pathPoints.length > femaleRoute2.stops.length, "Female Route 2 should use extra road waypoints rather than straight stop-to-stop lines.");

  const initialBuses = initializeBusesForRoute(maleRoute1, 4);
  assert(initialBuses.length === 4, "Male Route 1 should initialize four active buses.");
  assert(new Set(initialBuses.map((bus) => bus.busNumber)).size === 4, "Route buses should keep unique simulation bus numbers.");

  const afterTick = tickBusSimulation(maleRoute1, initialBuses, 5000, new Date("2026-04-19T08:30:00"));
  assert(afterTick.every((bus) => bus.currentCoordinates.lat !== 0), "Buses should keep resolved coordinates after a simulation tick.");
  assert(afterTick.some((bus) => bus.status === "running" || bus.status === "boarding"), "At least one bus should be running or boarding during active service.");

  const serviceInactive = formatRouteServiceStatus(femaleRoute6, new Date("2026-04-19T10:00:00"));
  assert(serviceInactive.active === false, "Female Route 6 should be outside service before 2:30 PM.");

  const serviceActive = formatRouteServiceStatus(femaleRoute6, new Date("2026-04-19T16:00:00"));
  assert(serviceActive.active === true, "Female Route 6 should be active during its evening service window.");

  const dtvActive = formatRouteServiceStatus(maleRoute3, new Date("2026-04-19T09:00:00"));
  assert(dtvActive.active === true, "Male Route 3 should be active during its daytime DTV window.");

  return true;
}

export const busRouteSimulationTestCases = [
  "Male Route 1 initializes four buses with unique bus numbers.",
  "Shuttle segment generation includes forward and reverse movement.",
  "Female Route 6 is inactive before 2:30 PM and active at 4:00 PM.",
  "Male Route 3 is active during its 8:00 AM to 4:00 PM service window."
];
