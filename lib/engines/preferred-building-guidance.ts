import { academicBuildings, type AcademicBuilding } from "@/lib/data/academic-buildings";
import { busStops, type BusStop as SourceBusStop } from "@/lib/data/bus-stops";
import { LIVE_BUS_ROUTES } from "@/lib/data/live-bus-routes";
import {
  LOT_ID_ALIASES,
  PARKING_RULES_CONFIG,
  PERMANENTLY_PROHIBITED_LOTS,
  type CanonicalParkingLotId,
  type ParkingRestrictionSummary
} from "@/lib/data/parking-rules";
import { parkingLocations as sourceParkingLocations, type ParkingLocation as SourceParkingLocation } from "@/lib/data/parking-locations";
import type { StudentCategory } from "@/lib/engines/rules";
import type { User } from "@/lib/types";

export type ParkingLotId = CanonicalParkingLotId;
export type BuildingId = string;
export type { ParkingRestrictionSummary };

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ParkingLocation {
  id: string;
  canonicalId: CanonicalParkingLotId;
  name: string;
  coordinates: Coordinate;
  type: "numbered_lot" | "named_location";
  zone?: string;
  categoryPresence: StudentCategory[];
  restrictionBadges?: string[];
  isProhibited?: boolean;
  isNamedLocation?: boolean;
}

export interface BuildingLocation {
  id: BuildingId;
  name: string;
  coordinates: Coordinate;
  googleMapsUrl?: string;
}

export interface PreferredBuildingRecommendation {
  lotId: string;
  canonicalLotId: CanonicalParkingLotId;
  lotName: string;
  distanceMeters: number;
  distanceLabel: string;
  ranking: number;
  restrictionBadges: string[];
  restrictionText: string | null;
  reason: string;
  ruleSummary: string | null;
  partiallyRestricted: boolean;
  cta: {
    href: string;
    label: "View lot details";
  };
}

export interface SmartGuidanceRecommendationSection {
  buildingId: BuildingId | null;
  buildingName: string | null;
  category: StudentCategory;
  recommendations: PreferredBuildingRecommendation[];
  emptyState: "no_building" | "unknown_building" | "no_results" | null;
}

export interface RankedBusStop {
  id: string;
  label: string;
  routeIds: string[];
  routeNames: string[];
  coordinates: Coordinate;
  distanceMeters: number;
  distanceLabel: string;
}

export interface ClosestRouteResult {
  routeId: string;
  routeName: string;
  closestDestinationStopId: string;
  closestDestinationStopName: string;
  destinationStopDistanceMeters: number;
  destinationStopDistanceLabel: string;
}

export interface ActiveParkingSession {
  id: string;
  userId: string;
  category: StudentCategory;
  lotId: string;
  canonicalLotId: string;
  floorKey?: string;
  slotId: string;
  parkedAtIso: string;
  parkedCoordinates: Coordinate;
  preferredBuildingId?: string;
  isActive: boolean;
}

export interface RuleAlertViewModel {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
}

export interface CountdownViewModel {
  id: string;
  label: string;
  targetTime: string;
  remainingMs: number;
  status: "active" | "warning" | "expired";
}

export interface ParkedSessionGuidanceResult {
  parkedLotSummary: {
    lotId: string;
    canonicalLotId: string;
    lotName: string;
    floorKey?: string;
    slotId: string;
  };
  nearestBusStops: RankedBusStop[];
  nearestBusRouteHint: string | null;
  bestDestinationRoute: ClosestRouteResult | null;
  preferredBuildingParkingRecommendations: SmartGuidanceRecommendationSection;
  walkingRecommended: boolean;
  ruleAlerts: RuleAlertViewModel[];
  countdowns: CountdownViewModel[];
}

export interface SharedSmartGuidanceViewModel {
  preferredBuildingParkingRecommendations: SmartGuidanceRecommendationSection;
  parkedSessionGuidance: ParkedSessionGuidanceResult | null;
}

export const buildingLocations: BuildingLocation[] = academicBuildings;
export const parkingLocations: ParkingLocation[] = sourceParkingLocations;

const lotDetailHrefMap: Record<CanonicalParkingLotId, string> = {
  parking_19: "/parking/lot-19",
  parking_20: "/parking/lot-20",
  parking_23: "/parking/lot-23",
  parking_25: "/parking/lot-25",
  parking_39: "/parking/lot-39",
  parking_57: "/parking/lot-57",
  parking_59: "/parking/lot-59",
  parking_60: "/parking/lot-60",
  parking_64: "/parking/lot-64",
  parking_71: "/parking/lot-71",
  parking_72: "/parking/lot-72",
  parking_73: "/parking/lot-73",
  parking_74: "/parking/lot-74",
  parking_77: "/parking/lot-77",
  parking_400: "/parking/lot-400",
  medical_center: "/parking/lot-medical",
  dhahran_mosque: "/parking/lot-dhahran-mosque",
  al_zubair_mosque: "/parking/lot-alzubair",
  student_mall: "/parking/lot-mall",
  female_student_housing: "/parking/lot-female-housing",
  family_mall: "/parking/lot-university-square"
};

const additionalBuildingAliases: Record<string, string> = {
  "medical center": "medical_center_building",
  "student mall": "student_mall_building",
  "female housing": "female_housing",
  "female student housing": "female_housing",
  "university square": "university_square"
};

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function titleToCanonicalBuildingId(value: string) {
  const normalized = normalizeKey(value);
  if (additionalBuildingAliases[value.toLowerCase()]) return additionalBuildingAliases[value.toLowerCase()];
  if (/^building_\d+$/.test(normalized)) return normalized;
  if (/^building \d+$/i.test(value)) return normalizeKey(value);
  return additionalBuildingAliases[value.toLowerCase()] ?? normalized;
}

function formatDistanceLabel(distanceMeters: number) {
  return distanceMeters < 1000 ? `${Math.round(distanceMeters)} m` : `${(distanceMeters / 1000).toFixed(1)} km`;
}

function isCommuterCategory(category: StudentCategory) {
  return category === "non_resident_male" || category === "non_resident_female";
}

function getCampusSafeParkedCoordinates(
  activeSession: ActiveParkingSession,
  candidateParkingLocations = parkingLocations
) {
  const parkedLot = getParkingById(activeSession.canonicalLotId, candidateParkingLocations);
  const fallbackCoordinates = parkedLot?.coordinates ?? null;

  if (!fallbackCoordinates) {
    return activeSession.parkedCoordinates;
  }

  const candidateCoordinates = activeSession.parkedCoordinates;
  const invalidCandidate =
    !Number.isFinite(candidateCoordinates.lat) ||
    !Number.isFinite(candidateCoordinates.lng) ||
    (candidateCoordinates.lat === 0 && candidateCoordinates.lng === 0);

  if (invalidCandidate) {
    return fallbackCoordinates;
  }

  return haversineDistanceMeters(candidateCoordinates, fallbackCoordinates) <= 1200
    ? candidateCoordinates
    : fallbackCoordinates;
}

export function getNetworkForCategory(category: StudentCategory): "male" | "female" {
  return category.includes("female") ? "female" : "male";
}

export function normalizeLotId(lotId: string): CanonicalParkingLotId {
  return (LOT_ID_ALIASES[lotId] ?? lotId) as CanonicalParkingLotId;
}

export function haversineDistanceMeters(a: Coordinate, b: Coordinate) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const haversine =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const angle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return earthRadius * angle;
}

export const getDistanceMeters = haversineDistanceMeters;

export function sortByDistance<T extends { coordinates: Coordinate }>(origin: Coordinate, targets: T[]) {
  return [...targets].sort((left, right) => {
    const leftDistance = haversineDistanceMeters(origin, left.coordinates);
    const rightDistance = haversineDistanceMeters(origin, right.coordinates);
    return leftDistance - rightDistance;
  });
}

export function formatMeters(meters: number) {
  return formatDistanceLabel(meters);
}

export function getBuildingCoordinates(buildingId: string, buildings = buildingLocations) {
  return buildings.find((building) => building.id === buildingId)?.coordinates ?? null;
}

export function getBuildingById(buildingId: string | null | undefined, buildings = buildingLocations) {
  if (!buildingId) return null;
  return buildings.find((building) => building.id === buildingId) ?? null;
}

export function getParkingById(lotId: string | null | undefined, candidateLocations = parkingLocations) {
  if (!lotId) return null;
  const canonicalId = normalizeLotId(lotId);
  return (
    candidateLocations.find((location) => location.id === canonicalId) ??
    candidateLocations.find((location) => normalizeLotId(location.id) === canonicalId) ??
    null
  );
}

export function getBuildingIdFromLabel(label: string | null | undefined): BuildingId | null {
  if (!label) return null;
  const normalized = titleToCanonicalBuildingId(label);
  return buildingLocations.some((building) => building.id === normalized) ? normalized : null;
}

export function getSavedPreferredBuildingIdsFromProfile(user: Pick<User, "favoriteBuildings">) {
  return user.favoriteBuildings.map((building) => getBuildingIdFromLabel(building)).filter(Boolean) as BuildingId[];
}

export function getDefaultPreferredBuildingIdFromProfile(user: Pick<User, "favoriteBuildings">) {
  return getSavedPreferredBuildingIdsFromProfile(user)[0] ?? null;
}

export function getPermittedParkingIds(category: StudentCategory) {
  return PARKING_RULES_CONFIG[category]?.allowedLots ?? [];
}

export function getPermittedParkingLocations(category: StudentCategory, candidateLocations = parkingLocations) {
  const permittedIds = new Set(getPermittedParkingIds(category));
  const prohibitedIds = new Set<string>(PERMANENTLY_PROHIBITED_LOTS);
  const seenCanonicalIds = new Set<string>();
  const orderedLocations = [...candidateLocations].sort((left, right) => {
    const leftScore = left.id === left.canonicalId ? 0 : 1;
    const rightScore = right.id === right.canonicalId ? 0 : 1;
    return leftScore - rightScore;
  });

  return orderedLocations.filter((location) => {
    const canonicalId = normalizeLotId(location.canonicalId);
    if (!permittedIds.has(canonicalId) || prohibitedIds.has(canonicalId)) {
      return false;
    }

    if (seenCanonicalIds.has(canonicalId)) {
      return false;
    }

    seenCanonicalIds.add(canonicalId);
    return true;
  });
}

export function getBusStopsForCategory(category: StudentCategory, candidateStops: SourceBusStop[] = busStops) {
  const network = getNetworkForCategory(category);
  const stopMap = new Map<string, RankedBusStop>();

  LIVE_BUS_ROUTES.filter((route) => route.network === network).forEach((route) => {
    route.stops.forEach((stop) => {
      const existing = stopMap.get(stop.id);
      if (existing) {
        if (!existing.routeIds.includes(route.id)) existing.routeIds.push(route.id);
        if (!existing.routeNames.includes(route.name)) existing.routeNames.push(route.name);
        return;
      }

      stopMap.set(stop.id, {
        id: stop.id,
        label: stop.name,
        routeIds: [route.id],
        routeNames: [route.name],
        coordinates: stop.coordinates,
        distanceMeters: 0,
        distanceLabel: "0 m"
      });
    });
  });

  if (!stopMap.size) {
    candidateStops
      .filter((stop) => stop.gender === network)
      .forEach((stop) => {
        stopMap.set(stop.id, {
          id: stop.id,
          label: stop.name,
          routeIds: [stop.routeId],
          routeNames: [stop.routeName],
          coordinates: stop.coordinates,
          distanceMeters: 0,
          distanceLabel: "0 m"
        });
      });
  }

  return [...stopMap.values()];
}

export function getParkingRestrictionSummary(category: StudentCategory, lotId: string): ParkingRestrictionSummary {
  const canonicalLotId = normalizeLotId(lotId);
  const ruleSet = PARKING_RULES_CONFIG[category];
  const lotRestriction = ruleSet?.lotRestrictions?.[canonicalLotId];
  const badges = [...(lotRestriction?.badges ?? [])];

  if (isCommuterCategory(category) && !badges.includes("Leave by 10:00 PM")) {
    badges.push("Leave by 10:00 PM");
  }

  return {
    lotId: canonicalLotId,
    badges,
    shortText: lotRestriction?.shortText ?? (isCommuterCategory(category) ? "Commuter parking must end by 10:00 PM." : null),
    partiallyRestricted: lotRestriction?.partiallyRestricted ?? false
  };
}

export function getParkingRestrictionBadges(category: StudentCategory, lotId: string) {
  return getParkingRestrictionSummary(category, lotId).badges;
}

export function rankParkingForPreferredBuilding(
  category: StudentCategory,
  buildingId: string,
  candidateLocations = parkingLocations,
  buildings = buildingLocations
) {
  const building = buildings.find((entry) => entry.id === buildingId);
  if (!building) return [];

  return getPermittedParkingLocations(category, candidateLocations)
    .map((location) => ({
      location,
      distanceMeters: haversineDistanceMeters(building.coordinates, location.coordinates)
    }))
    .sort((left, right) => left.distanceMeters - right.distanceMeters || left.location.name.localeCompare(right.location.name))
    .map(({ location, distanceMeters }, index): PreferredBuildingRecommendation => {
      const restriction = getParkingRestrictionSummary(category, location.canonicalId);
      return {
        lotId: location.id,
        canonicalLotId: location.canonicalId,
        lotName: location.name,
        distanceMeters: Math.round(distanceMeters),
        distanceLabel: formatDistanceLabel(distanceMeters),
        ranking: index + 1,
        restrictionBadges: restriction.badges,
        restrictionText: restriction.shortText,
        reason: index === 0 ? "Closest permitted option" : "Nearby option for your permit",
        ruleSummary: restriction.shortText,
        partiallyRestricted: restriction.partiallyRestricted,
        cta: {
          href: lotDetailHrefMap[location.canonicalId] ?? "/parking",
          label: "View lot details"
        }
      };
    });
}

export function buildPreferredBuildingParkingRecommendations(params: {
  category: StudentCategory;
  selectedPreferredBuildingId: string | null;
  parkingLocations?: ParkingLocation[];
  academicBuildings?: BuildingLocation[];
}) {
  const { category, selectedPreferredBuildingId, parkingLocations: candidateLocations = parkingLocations, academicBuildings: buildings = buildingLocations } = params;

  if (!selectedPreferredBuildingId) {
    return {
      buildingId: null,
      buildingName: null,
      category,
      recommendations: [],
      emptyState: "no_building" as const
    };
  }

  const building = buildings.find((entry) => entry.id === selectedPreferredBuildingId);
  if (!building) {
    return {
      buildingId: selectedPreferredBuildingId,
      buildingName: null,
      category,
      recommendations: [],
      emptyState: "unknown_building" as const
    };
  }

  const recommendations = rankParkingForPreferredBuilding(category, selectedPreferredBuildingId, candidateLocations, buildings);
  return {
    buildingId: selectedPreferredBuildingId,
    buildingName: building.name,
    category,
    recommendations,
    emptyState: recommendations.length ? null : ("no_results" as const)
  };
}

export function buildSmartGuidanceRecommendationViewModel(
  category: StudentCategory,
  buildingId: string | null,
  candidateLocations = parkingLocations,
  buildings = buildingLocations
): SmartGuidanceRecommendationSection {
  return buildPreferredBuildingParkingRecommendations({
    category,
    selectedPreferredBuildingId: buildingId,
    parkingLocations: candidateLocations,
    academicBuildings: buildings
  });
}

export function getNearestBusStopsForParkedSession(
  category: StudentCategory,
  parkedCoordinates: Coordinate,
  candidateStops: SourceBusStop[] = busStops,
  limit = 3
): RankedBusStop[] {
  return getBusStopsForCategory(category, candidateStops)
    .map((stop) => ({
      id: stop.id,
      label: stop.label,
      routeIds: stop.routeIds,
      routeNames: stop.routeNames,
      coordinates: stop.coordinates,
      distanceMeters: Math.round(haversineDistanceMeters(parkedCoordinates, stop.coordinates)),
      distanceLabel: formatDistanceLabel(haversineDistanceMeters(parkedCoordinates, stop.coordinates))
    }))
    .sort((left, right) => left.distanceMeters - right.distanceMeters || left.label.localeCompare(right.label))
    .slice(0, limit);
}

export function getRoutesServingStop(stopId: string) {
  return LIVE_BUS_ROUTES.filter((route) => route.stops.some((stop) => stop.id === stopId));
}

export function getClosestRouteToPreferredBuilding(
  category: StudentCategory,
  preferredBuildingId: string | undefined,
  candidateStops: SourceBusStop[] = busStops,
  routes = LIVE_BUS_ROUTES,
  buildings = buildingLocations
): ClosestRouteResult | null {
  const building = getBuildingById(preferredBuildingId, buildings);
  if (!building) return null;

  const network = getNetworkForCategory(category);
  const availableStopIds = new Set(getBusStopsForCategory(category, candidateStops).map((stop) => stop.id));

  const candidates = routes
    .filter((route) => route.network === network)
    .map((route) => {
      const scoredStops = route.stops
        .filter((stop) => availableStopIds.has(stop.id))
        .map((stop) => ({
          stop,
          distanceMeters: haversineDistanceMeters(building.coordinates, stop.coordinates)
        }))
        .sort((left, right) => left.distanceMeters - right.distanceMeters);

      const bestStop = scoredStops[0];
      if (!bestStop) return null;

      return {
        route,
        stop: bestStop.stop,
        distanceMeters: bestStop.distanceMeters
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (!left || !right) return 0;
      return left.distanceMeters - right.distanceMeters || left.route.name.localeCompare(right.route.name);
    });

  const best = candidates[0];
  if (!best) return null;

  return {
    routeId: best.route.id,
    routeName: best.route.name,
    closestDestinationStopId: best.stop.id,
    closestDestinationStopName: best.stop.name,
    destinationStopDistanceMeters: Math.round(best.distanceMeters),
    destinationStopDistanceLabel: formatDistanceLabel(best.distanceMeters)
  };
}

export function getNearestBusRouteHint(
  category: StudentCategory,
  preferredBuildingId: string | undefined,
  nearestStops: RankedBusStop[],
  candidateStops: SourceBusStop[] = busStops,
  routes = LIVE_BUS_ROUTES,
  buildings = buildingLocations
) {
  if (!nearestStops.length) return null;

  const building = getBuildingById(preferredBuildingId, buildings);
  const nearestStop = nearestStops[0];
  const bestRoute = getClosestRouteToPreferredBuilding(category, preferredBuildingId, candidateStops, routes, buildings);

  if (!building || !bestRoute) {
    return `${nearestStop.routeNames[0] ?? "The nearest shuttle route"} is closest from ${nearestStop.label}.`;
  }

  const strongMatch = nearestStop.routeIds.includes(bestRoute.routeId);
  if (strongMatch) {
    return `${bestRoute.routeName} is the closest route for ${building.name} via ${bestRoute.closestDestinationStopName}.`;
  }

  return `${nearestStop.label} is your nearest stop, and ${bestRoute.routeName} is the best route toward ${building.name} via ${bestRoute.closestDestinationStopName}.`;
}

export function shouldRecommendWalking(parkedCoordinates: Coordinate, buildingCoordinates: Coordinate, thresholdMeters = 350) {
  return haversineDistanceMeters(parkedCoordinates, buildingCoordinates) <= thresholdMeters;
}

export function buildPreferredBuildingRecommendationsViewModel(params: {
  category: StudentCategory;
  selectedPreferredBuildingId: string | null;
  parkingLocations?: ParkingLocation[];
  academicBuildings?: BuildingLocation[];
}) {
  return buildPreferredBuildingParkingRecommendations(params);
}

export function buildActiveTripGuidanceViewModel(params: {
  activeSession: ActiveParkingSession;
  category: StudentCategory;
  preferredBuildingId?: string;
  parkingLocations?: ParkingLocation[];
  academicBuildings?: BuildingLocation[];
  busStops?: SourceBusStop[];
  now: Date;
}) {
  return buildParkedSessionGuidance(params);
}

export function buildSharedSmartGuidanceViewModel(params: {
  activeSession?: ActiveParkingSession | null;
  category: StudentCategory;
  preferredBuildingId?: string | null;
  parkingLocations?: ParkingLocation[];
  academicBuildings?: BuildingLocation[];
  busStops?: SourceBusStop[];
  now: Date;
}): SharedSmartGuidanceViewModel {
  if (params.activeSession) {
    const parkedSessionGuidance = buildParkedSessionGuidance({
      activeSession: params.activeSession,
      category: params.category,
      preferredBuildingId: params.preferredBuildingId ?? undefined,
      parkingLocations: params.parkingLocations,
      academicBuildings: params.academicBuildings,
      busStops: params.busStops,
      now: params.now
    });

    return {
      preferredBuildingParkingRecommendations: parkedSessionGuidance.preferredBuildingParkingRecommendations,
      parkedSessionGuidance
    };
  }

  return {
    preferredBuildingParkingRecommendations: buildPreferredBuildingParkingRecommendations({
      category: params.category,
      selectedPreferredBuildingId: params.preferredBuildingId ?? null,
      parkingLocations: params.parkingLocations,
      academicBuildings: params.academicBuildings
    }),
    parkedSessionGuidance: null
  };
}

function getCommuterCountdown(now: Date) {
  const leaveBy = new Date(now);
  leaveBy.setHours(22, 0, 0, 0);
  return leaveBy;
}

function buildCountdown(target: Date, label: string, now: Date): CountdownViewModel {
  const remainingMs = target.getTime() - now.getTime();
  return {
    id: `${label}-${target.toISOString()}`,
    label,
    targetTime: target.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    remainingMs,
    status: remainingMs <= 0 ? "expired" : remainingMs <= 15 * 60 * 1000 ? "warning" : "active"
  };
}

function evaluateFloorAlert(category: StudentCategory, canonicalLotId: CanonicalParkingLotId, floorKey?: string): RuleAlertViewModel[] {
  if (!floorKey) return [];

  if (canonicalLotId === "parking_23" && floorKey !== "F3") {
    return [{ id: "lot23-floor", severity: "critical", title: "Wrong floor selected", message: "Only the 3rd floor is allowed in Lot 23 for eligible non-resident students." }];
  }

  if (canonicalLotId === "parking_25" && floorKey !== "F2") {
    return [{ id: "lot25-floor", severity: "critical", title: "Wrong floor selected", message: "Only the 2nd floor is allowed in Lot 25 for eligible non-resident students." }];
  }

  if (canonicalLotId === "parking_77" && !["L1", "L2"].includes(floorKey)) {
    return [{ id: "lot77-floor", severity: "critical", title: "Wrong floor selected", message: "Only L1 and L2 are allowed in Lot 77 for eligible non-resident students." }];
  }

  if (canonicalLotId === "parking_64") {
    if (["resident_male", "resident_female"].includes(category)) {
      return [{ id: "lot64-resident", severity: "critical", title: "Lot 64 is blocked", message: "Resident students are not allowed in Building 64 student-access areas." }];
    }

    if (["L1", "L2"].includes(floorKey)) {
      return [{ id: "lot64-faculty", severity: "critical", title: "Faculty/staff-only level", message: "Levels L1 and L2 in Lot 64 are reserved for faculty and staff only." }];
    }

    if (!["L0", "L3", "UNCOVERED"].includes(floorKey)) {
      return [{ id: "lot64-offcampus", severity: "critical", title: "Wrong level for permit", message: "Off-campus students may only use L0, L3, and uncovered in Lot 64." }];
    }
  }

  return [];
}

export function buildParkedSessionGuidance(params: {
  activeSession: ActiveParkingSession;
  category: StudentCategory;
  preferredBuildingId?: string;
  parkingLocations?: ParkingLocation[];
  academicBuildings?: BuildingLocation[];
  busStops?: SourceBusStop[];
  now: Date;
}) {
  const {
    activeSession,
    category,
    preferredBuildingId,
    parkingLocations: candidateParkingLocations = parkingLocations,
    academicBuildings: buildings = buildingLocations,
    busStops: candidateStops = busStops,
    now
  } = params;

  const parkedLot = candidateParkingLocations.find((location) => normalizeLotId(location.id) === normalizeLotId(activeSession.canonicalLotId)) ?? null;
  const resolvedParkedCoordinates = getCampusSafeParkedCoordinates(activeSession, candidateParkingLocations);
  const nearestBusStops = getNearestBusStopsForParkedSession(category, resolvedParkedCoordinates, candidateStops, 3);
  const recommendationSection = buildPreferredBuildingParkingRecommendations({
    category,
    selectedPreferredBuildingId: preferredBuildingId ?? null,
    parkingLocations: candidateParkingLocations,
    academicBuildings: buildings
  });
  const preferredBuildingCoordinates = preferredBuildingId ? getBuildingCoordinates(preferredBuildingId, buildings) : null;
  const preferredBuilding = getBuildingById(preferredBuildingId, buildings);
  const walkingRecommended = preferredBuildingCoordinates
    ? shouldRecommendWalking(resolvedParkedCoordinates, preferredBuildingCoordinates)
    : false;
  const bestDestinationRoute = getClosestRouteToPreferredBuilding(category, preferredBuildingId, candidateStops, LIVE_BUS_ROUTES, buildings);
  const nearestBusRouteHint = getNearestBusRouteHint(category, preferredBuildingId, nearestBusStops, candidateStops, LIVE_BUS_ROUTES, buildings);

  const ruleAlerts: RuleAlertViewModel[] = [];
  const countdowns: CountdownViewModel[] = [];

  if (isCommuterCategory(category)) {
    const cutoff = getCommuterCountdown(now);
    countdowns.push(buildCountdown(cutoff, "10:00 PM commuter cutoff", now));
    ruleAlerts.push({
      id: "commuter-cutoff",
      severity: cutoff.getTime() <= now.getTime() ? "critical" : cutoff.getTime() - now.getTime() <= 60 * 60 * 1000 ? "warning" : "info",
      title: "Commuter leave-by rule",
      message: cutoff.getTime() <= now.getTime() ? "Leave now to avoid violation." : "You must leave campus by 10:00 PM."
    });
  }

  if (activeSession.canonicalLotId === "student_mall") {
    const target = new Date(new Date(activeSession.parkedAtIso).getTime() + 2 * 60 * 60 * 1000);
    countdowns.push(buildCountdown(target, "Student Mall 2-hour limit", now));
    ruleAlerts.push({
      id: "student-mall",
      severity: target.getTime() <= now.getTime() ? "critical" : target.getTime() - now.getTime() <= 30 * 60 * 1000 ? "warning" : "info",
      title: "Student Mall stay limit",
      message: target.getTime() <= now.getTime() ? "Student Mall maximum stay has been exceeded." : "Student Mall parking is limited to 2 hours."
    });
  }

  ruleAlerts.push(...evaluateFloorAlert(category, normalizeLotId(activeSession.canonicalLotId), activeSession.floorKey));

  if (recommendationSection.emptyState === "unknown_building") {
    ruleAlerts.push({
      id: "missing-building-map",
      severity: "info",
      title: "Preferred building unavailable",
      message: "The selected preferred building is not mapped yet, so only parked-location guidance is active."
    });
  }

  return {
    parkedLotSummary: {
      lotId: activeSession.lotId,
      canonicalLotId: activeSession.canonicalLotId,
      lotName: parkedLot?.name ?? activeSession.lotId,
      floorKey: activeSession.floorKey,
      slotId: activeSession.slotId
    },
    nearestBusStops,
    nearestBusRouteHint,
    bestDestinationRoute,
    preferredBuildingParkingRecommendations: recommendationSection,
    walkingRecommended,
    ruleAlerts,
    countdowns
  };
}
