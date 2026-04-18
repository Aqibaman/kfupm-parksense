import { academicBuildings, type AcademicBuilding } from "@/lib/data/academic-buildings";
import { busStops, type BusStop as SourceBusStop } from "@/lib/data/bus-stops";
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
  routeId: string;
  routeName: string;
  coordinates: Coordinate;
  distanceMeters: number;
  distanceLabel: string;
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
  preferredBuildingParkingRecommendations: SmartGuidanceRecommendationSection;
  walkingRecommended: boolean;
  ruleAlerts: RuleAlertViewModel[];
  countdowns: CountdownViewModel[];
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

function toRouteHintLabel(buildingName: string, stopNames: string[]) {
  return `${buildingName} is best served from ${stopNames.join(", ")}.`;
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
  const gender = category.includes("female") ? "female" : "male";
  return candidateStops
    .filter((stop) => stop.gender === gender)
    .map((stop) => ({
      id: stop.id,
      label: stop.name,
      routeId: stop.routeId,
      routeName: stop.routeName,
      coordinates: stop.coordinates,
      distanceMeters: Math.round(haversineDistanceMeters(parkedCoordinates, stop.coordinates)),
      distanceLabel: formatDistanceLabel(haversineDistanceMeters(parkedCoordinates, stop.coordinates))
    }))
    .sort((left, right) => left.distanceMeters - right.distanceMeters || left.label.localeCompare(right.label))
    .slice(0, limit);
}

export function getNearestBusRouteHint(
  category: StudentCategory,
  preferredBuildingId: string | undefined,
  nearestStops: RankedBusStop[],
  buildings = buildingLocations
) {
  if (!nearestStops.length) return null;

  const building = preferredBuildingId ? buildings.find((entry) => entry.id === preferredBuildingId) : null;
  const stopNames = nearestStops.map((stop) => stop.label);

  if (category.includes("female") && preferredBuildingId === "building_22") {
    return toRouteHintLabel(building?.name ?? "Building 22", stopNames.filter((name) => ["Building 22 Stop", "Station 312", "Station 314", "Station 319", "Station 310"].includes(name)));
  }

  if (category.includes("female") && preferredBuildingId === "building_58") {
    return `${building?.name ?? "Building 58"} is served through ${stopNames.join(", ")} on the female shuttle network.`;
  }

  const nearest = nearestStops[0];
  return `${nearest.routeName} is the closest route match from ${nearest.label}.`;
}

export function shouldRecommendWalking(parkedCoordinates: Coordinate, buildingCoordinates: Coordinate, thresholdMeters = 350) {
  return haversineDistanceMeters(parkedCoordinates, buildingCoordinates) <= thresholdMeters;
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
  const nearestBusStops = getNearestBusStopsForParkedSession(category, activeSession.parkedCoordinates, candidateStops, 3);
  const recommendationSection = buildPreferredBuildingParkingRecommendations({
    category,
    selectedPreferredBuildingId: preferredBuildingId ?? null,
    parkingLocations: candidateParkingLocations,
    academicBuildings: buildings
  });
  const preferredBuildingCoordinates = preferredBuildingId ? getBuildingCoordinates(preferredBuildingId, buildings) : null;
  const walkingRecommended = preferredBuildingCoordinates
    ? shouldRecommendWalking(activeSession.parkedCoordinates, preferredBuildingCoordinates)
    : false;

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
    nearestBusRouteHint: getNearestBusRouteHint(category, preferredBuildingId, nearestBusStops, buildings),
    preferredBuildingParkingRecommendations: recommendationSection,
    walkingRecommended,
    ruleAlerts,
    countdowns
  };
}
