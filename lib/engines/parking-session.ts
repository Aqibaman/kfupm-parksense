import { busStops } from "@/lib/data/bus-stops";
import { academicBuildings } from "@/lib/data/academic-buildings";
import { parkingLocations } from "@/lib/data/parking-locations";
import { PARKING_RULES_CONFIG, type CanonicalParkingLotId } from "@/lib/data/parking-rules";
import {
  buildActiveTripGuidanceViewModel,
  buildPreferredBuildingParkingRecommendations,
  getBuildingIdFromLabel,
  getNearestBusStopsForParkedSession,
  haversineDistanceMeters,
  normalizeLotId,
  type Coordinate,
  type ParkingLocation as GuidanceParkingLocation
} from "@/lib/engines/preferred-building-guidance";
import type { FloorKey } from "@/lib/engines/lot-detail";
import { type StudentCategory, toStudentCategory } from "@/lib/engines/rules";
import type { User } from "@/lib/types";

export type SlotId = string;
export type AlertSeverity = "info" | "warning" | "critical";
export type ParkingRuleType =
  | "category_access_rule"
  | "floor_access_rule"
  | "curfew_rule"
  | "duration_rule"
  | "note_rule"
  | "violation_risk_rule"
  | "lot_specific_rule";

export interface Coordinates extends Coordinate {}

export interface ParkingRule {
  id: string;
  type: ParkingRuleType;
  severity: AlertSeverity;
  title: string;
  message: string;
  active: boolean;
  leaveBy?: string | null;
  countdownTarget?: string | null;
}

export interface UserParkingSession {
  id: string;
  userId: string;
  category: StudentCategory;
  lotId: string;
  canonicalLotId: string;
  floorKey?: FloorKey;
  slotId: SlotId;
  parkedAt: string;
  parkedCoordinates: Coordinates;
  preferredDestinationBuildingId: string;
  isActive: boolean;
  endedAt?: string | null;
}

export interface ActiveAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  lotId?: string;
  floorKey?: string;
  startsAt?: string;
  endsAt?: string;
  countdownMs?: number | null;
  actionLabel?: string;
}

export interface CountdownTimer {
  id: string;
  label: string;
  targetTime: string;
  remainingMs: number;
  status: "active" | "warning" | "expired";
}

export interface BusStop {
  id: string;
  label: string;
  routeId: string;
  routeName: string;
  coordinates: Coordinates;
  distanceMeters?: number;
  distanceLabel?: string;
}

export interface BuildingDestination {
  id: string;
  name: string;
  coordinates: Coordinates;
}

export interface ParkingLotLocation {
  id: string;
  canonicalLotId: CanonicalParkingLotId;
  name: string;
  coordinates: Coordinates;
}

export interface SmartGuidanceResult {
  nearestBusStop: BusStop | null;
  nearestBusStops: BusStop[];
  nearestBusRouteHint: string | null;
  nearestPermittedParkingToDestination: ParkingLotLocation | null;
  walkingRecommended: boolean;
  summaryLines: string[];
}

export interface RuleEvaluationResult {
  permitStatus: "allowed" | "restricted" | "unauthorized";
  violationRiskStatus: "none" | "warning" | "critical";
  leaveByTime: string | null;
  rules: ParkingRule[];
}

export interface ParkingPageData {
  session: UserParkingSession;
  ruleResult: RuleEvaluationResult;
  alerts: ActiveAlert[];
  countdowns: CountdownTimer[];
  guidance: SmartGuidanceResult;
}

export interface ParkingModalData extends ParkingPageData {
  lotName: string;
  floorLabel: string;
  slotLabel: string;
}

const sessionStore = new Map<string, UserParkingSession>();

export const BUS_STOP_LOCATIONS: BusStop[] = busStops.map((stop) => ({
  id: stop.id,
  label: stop.name,
  routeId: stop.routeId,
  routeName: stop.routeName,
  coordinates: stop.coordinates
}));

export const BUILDING_DESTINATIONS: BuildingDestination[] = academicBuildings.map((building) => ({
  id: building.id,
  name: building.name,
  coordinates: building.coordinates
}));

export const PARKING_LOT_LOCATIONS: ParkingLotLocation[] = parkingLocations.map((location) => ({
  id: location.id,
  canonicalLotId: location.canonicalId,
  name: location.name,
  coordinates: location.coordinates
}));

function buildDateInput(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function formatTime(date: Date | null) {
  return date
    ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    : null;
}

function buildRule(
  id: string,
  type: ParkingRuleType,
  severity: AlertSeverity,
  title: string,
  message: string,
  active = true,
  countdownTarget?: string | null
): ParkingRule {
  return {
    id,
    type,
    severity,
    title,
    message,
    active,
    countdownTarget,
    leaveBy: countdownTarget ? formatTime(new Date(countdownTarget)) : null
  };
}

function isCommuterCategory(category: StudentCategory) {
  return category === "non_resident_male" || category === "non_resident_female";
}

function getCommuterCutoff(now: Date) {
  const cutoff = new Date(now);
  cutoff.setHours(22, 0, 0, 0);
  return cutoff;
}

function getLotCoordinates(lotId: string) {
  return PARKING_LOT_LOCATIONS.find((lot) => normalizeLotId(lot.id) === normalizeLotId(lotId))?.coordinates ?? null;
}

function getLotName(lotId: string) {
  return PARKING_LOT_LOCATIONS.find((lot) => normalizeLotId(lot.id) === normalizeLotId(lotId))?.name ?? lotId;
}

function getFloorRestrictionAlert(category: StudentCategory, lotId: CanonicalParkingLotId, floorKey?: string) {
  if (!floorKey) return null;

  if (lotId === "parking_23" && floorKey !== "F3") {
    return buildRule("lot-23-floor", "floor_access_rule", "critical", "Wrong floor for Lot 23", "Only the 3rd floor is allowed for your permit in Lot 23.");
  }

  if (lotId === "parking_25" && floorKey !== "F2") {
    return buildRule("lot-25-floor", "floor_access_rule", "critical", "Wrong floor for Lot 25", "Only the 2nd floor is allowed for your permit in Lot 25.");
  }

  if (lotId === "parking_77" && !["L1", "L2"].includes(floorKey)) {
    return buildRule("lot-77-floor", "floor_access_rule", "critical", "Wrong floor for Lot 77", "Only L1 and L2 are allowed for your permit in Lot 77.");
  }

  if (lotId === "parking_64") {
    if (category === "resident_male" || category === "resident_female") {
      return buildRule(
        "lot-64-resident",
        "lot_specific_rule",
        "critical",
        "Building 64 is blocked",
        "Resident students are not allowed in the student-access areas of Lot 64."
      );
    }

    if (["L1", "L2"].includes(floorKey)) {
      return buildRule(
        "lot-64-faculty",
        "floor_access_rule",
        "critical",
        "Faculty/staff-only level",
        "Levels L1 and L2 in Lot 64 are reserved for faculty and staff only."
      );
    }

    if (!["L0", "L3", "UNCOVERED"].includes(floorKey)) {
      return buildRule(
        "lot-64-off-campus",
        "floor_access_rule",
        "critical",
        "Restricted level in Lot 64",
        "Off-campus students may only use L0, L3, and uncovered in Lot 64."
      );
    }
  }

  return null;
}

function getParkingCountdownTargets(session: UserParkingSession, now: Date) {
  const targets: { label: string; target: Date }[] = [];

  if (isCommuterCategory(session.category)) {
    targets.push({ label: "10:00 PM commuter cutoff", target: getCommuterCutoff(now) });
  }

  if (normalizeLotId(session.canonicalLotId) === "student_mall") {
    targets.push({
      label: "Student Mall 2-hour limit",
      target: new Date(new Date(session.parkedAt).getTime() + 2 * 60 * 60 * 1000)
    });
  }

  return targets;
}

function getPrimaryLeaveBy(targets: { label: string; target: Date }[]) {
  if (!targets.length) return null;
  const earliest = [...targets].sort((left, right) => left.target.getTime() - right.target.getTime())[0];
  return formatTime(earliest.target);
}

export function startParkingSession(input: {
  userId: string;
  category: StudentCategory;
  lotId: string;
  floorKey?: FloorKey;
  slotId: string;
  parkedAt: string;
  parkedCoordinates: Coordinates | null;
  preferredDestinationBuildingId: string;
  endedAt?: string | null;
}) {
  const canonicalLotId = normalizeLotId(input.lotId);
  const coordinates = input.parkedCoordinates ?? getLotCoordinates(input.lotId) ?? { lat: 0, lng: 0 };

  const session: UserParkingSession = {
    id: `${input.userId}-${Date.now()}`,
    userId: input.userId,
    category: input.category,
    lotId: input.lotId,
    canonicalLotId,
    floorKey: input.floorKey,
    slotId: input.slotId,
    parkedAt: input.parkedAt,
    parkedCoordinates: coordinates,
    preferredDestinationBuildingId: input.preferredDestinationBuildingId,
    isActive: true,
    endedAt: input.endedAt ?? null
  };

  sessionStore.set(session.id, session);
  return session;
}

export function endParkingSession(sessionId: string) {
  const session = sessionStore.get(sessionId);
  if (session) {
    sessionStore.delete(sessionId);
  }
  return session ?? null;
}

export function evaluateParkingRules(session: UserParkingSession, now: string | Date): RuleEvaluationResult {
  const nowDate = buildDateInput(now);
  const categoryRules = PARKING_RULES_CONFIG[session.category];
  const canonicalLotId = normalizeLotId(session.canonicalLotId);
  const lotAllowed = categoryRules.allowedLots.includes(canonicalLotId);
  const rules: ParkingRule[] = [];

  if (!lotAllowed) {
    rules.push(
      buildRule(
        "category-access",
        "category_access_rule",
        "critical",
        "Lot not allowed for your permit",
        `${getLotName(session.lotId)} is not permitted for your parking category.`
      )
    );
  }

  const floorRestrictionRule = getFloorRestrictionAlert(session.category, canonicalLotId, session.floorKey);
  if (floorRestrictionRule) {
    rules.push(floorRestrictionRule);
  }

  const restriction = categoryRules.lotRestrictions?.[canonicalLotId];
  if (restriction?.shortText) {
    rules.push(buildRule(`note-${canonicalLotId}`, "note_rule", "info", "Parking note", restriction.shortText));
  }

  const countdownTargets = getParkingCountdownTargets(session, nowDate);
  for (const countdown of countdownTargets) {
    const remainingMs = countdown.target.getTime() - nowDate.getTime();
    rules.push(
      buildRule(
        `countdown-${countdown.label}`,
        countdown.label.includes("2-hour") ? "duration_rule" : "curfew_rule",
        remainingMs <= 0 ? "critical" : remainingMs <= 60 * 60 * 1000 ? "warning" : "info",
        countdown.label,
        remainingMs <= 0 ? "Leave now to avoid violation." : `${countdown.label} is active.`,
        true,
        countdown.target.toISOString()
      )
    );
  }

  const permitStatus: RuleEvaluationResult["permitStatus"] = !lotAllowed || floorRestrictionRule
    ? "unauthorized"
    : restriction?.partiallyRestricted
      ? "restricted"
      : "allowed";

  const violationRiskStatus: RuleEvaluationResult["violationRiskStatus"] = rules.some((rule) => rule.severity === "critical")
    ? "critical"
    : rules.some((rule) => rule.severity === "warning")
      ? "warning"
      : "none";

  return {
    permitStatus,
    violationRiskStatus,
    leaveByTime: getPrimaryLeaveBy(countdownTargets),
    rules
  };
}

export function buildAlertsFromRules(session: UserParkingSession, ruleResult: RuleEvaluationResult, now: string | Date) {
  const nowDate = buildDateInput(now);
  return ruleResult.rules.map<ActiveAlert>((rule) => ({
    id: `${session.id}-${rule.id}`,
    type: rule.type,
    severity: rule.severity,
    title: rule.title,
    message: rule.message,
    lotId: session.lotId,
    floorKey: session.floorKey,
    startsAt: nowDate.toISOString(),
    endsAt: rule.countdownTarget ?? undefined,
    countdownMs: rule.countdownTarget ? new Date(rule.countdownTarget).getTime() - nowDate.getTime() : null,
    actionLabel: rule.severity === "critical" ? "Review now" : "Open session"
  }));
}

export function buildCountdownsFromRules(session: UserParkingSession, ruleResult: RuleEvaluationResult, now: string | Date) {
  const nowDate = buildDateInput(now);
  return ruleResult.rules
    .filter((rule) => rule.countdownTarget)
    .map<CountdownTimer>((rule) => {
      const remainingMs = new Date(rule.countdownTarget as string).getTime() - nowDate.getTime();
      return {
        id: `${session.id}-${rule.id}`,
        label: rule.title,
        targetTime: rule.leaveBy ?? "",
        remainingMs,
        status: remainingMs <= 0 ? "expired" : remainingMs <= 15 * 60 * 1000 ? "warning" : "active"
      };
    });
}

export function buildSmartGuidance(
  session: UserParkingSession,
  parkingLotLocations: ParkingLotLocation[] = PARKING_LOT_LOCATIONS,
  stops: BusStop[] = BUS_STOP_LOCATIONS,
  buildings: BuildingDestination[] = BUILDING_DESTINATIONS
): SmartGuidanceResult {
  const sharedGuidance = buildActiveTripGuidanceViewModel({
    activeSession: {
      id: session.id,
      userId: session.userId,
      category: session.category,
      lotId: session.lotId,
      canonicalLotId: session.canonicalLotId,
      floorKey: session.floorKey,
      slotId: session.slotId,
      parkedAtIso: session.parkedAt,
      parkedCoordinates: session.parkedCoordinates,
      preferredBuildingId: session.preferredDestinationBuildingId || undefined,
      isActive: session.isActive
    },
    category: session.category,
    preferredBuildingId: session.preferredDestinationBuildingId || undefined,
    parkingLocations: parkingLotLocations.map((location) => ({
      id: location.id,
      canonicalId: location.canonicalLotId,
      name: location.name,
      coordinates: location.coordinates,
      type: location.canonicalLotId.startsWith("parking_") ? "numbered_lot" : "named_location",
      categoryPresence: [],
      zone: undefined
    })) as GuidanceParkingLocation[],
    academicBuildings: buildings,
    busStops: stops.map((stop) => ({
      id: stop.id,
      name: stop.label,
      gender: stop.routeId.startsWith("female_") ? "female" : "male",
      routeId: stop.routeId,
      routeName: stop.routeName,
      coordinates: stop.coordinates
    })),
    now: new Date()
  });

  const nearestBusStops = sharedGuidance.nearestBusStops.map((stop) => ({
    id: stop.id,
    label: stop.label,
    routeId: stop.routeIds[0] ?? "",
    routeName: stop.routeNames[0] ?? "",
    coordinates: stop.coordinates,
    distanceMeters: stop.distanceMeters,
    distanceLabel: stop.distanceLabel
  }));
  const nearestBusStop = nearestBusStops[0] ?? null;
  const nearestPermittedParking = sharedGuidance.preferredBuildingParkingRecommendations.recommendations[0];
  const preferredBuilding = buildings.find((building) => building.id === session.preferredDestinationBuildingId) ?? null;
  const walkingRecommended = sharedGuidance.walkingRecommended;
  const routeHint = sharedGuidance.nearestBusRouteHint;
  const destinationDistanceMeters = preferredBuilding
    ? Math.round(haversineDistanceMeters(session.parkedCoordinates, preferredBuilding.coordinates))
    : null;
  const parkedLotName = getLotName(session.lotId);
  const nearestParkingRecord = nearestPermittedParking
    ? [...parkingLotLocations]
        .sort((left, right) => {
          const leftScore = left.id === nearestPermittedParking.canonicalLotId ? 0 : 1;
          const rightScore = right.id === nearestPermittedParking.canonicalLotId ? 0 : 1;
          return leftScore - rightScore;
        })
        .find((lot) => normalizeLotId(lot.id) === nearestPermittedParking.canonicalLotId) ?? null
    : null;

  return {
    nearestBusStop,
    nearestBusStops,
    nearestBusRouteHint: routeHint,
    nearestPermittedParkingToDestination: nearestParkingRecord,
    walkingRecommended,
    summaryLines: [
      `You parked at ${parkedLotName}.`,
      nearestBusStop
        ? `Nearest bus stop from your parked lot: ${nearestBusStop.label} (${nearestBusStop.distanceLabel ?? ""}).`
        : "Bus-stop guidance will appear once a parking location is available.",
      sharedGuidance.preferredBuildingParkingRecommendations.buildingName && nearestPermittedParking
        ? `For ${sharedGuidance.preferredBuildingParkingRecommendations.buildingName}, the nearest permitted parking is ${nearestPermittedParking.lotName} (${nearestPermittedParking.distanceLabel}).`
        : "Add a preferred building in Profile so ParkWise can suggest the best permitted parking for your destination.",
      walkingRecommended && sharedGuidance.preferredBuildingParkingRecommendations.buildingName && destinationDistanceMeters !== null
        ? `Walking directly to ${sharedGuidance.preferredBuildingParkingRecommendations.buildingName} is about ${Math.round(destinationDistanceMeters)} m, so walking may be faster than using the bus.`
        : routeHint ?? "Use the nearest shuttle stop guidance for the next leg."
    ]
  };
}

export function getActiveSessionPanelData(session: UserParkingSession, now: string | Date) {
  const ruleResult = evaluateParkingRules(session, now);
  return {
    session,
    ruleResult,
    alerts: buildAlertsFromRules(session, ruleResult, now),
    countdowns: buildCountdownsFromRules(session, ruleResult, now),
    guidance: buildSmartGuidance(session, PARKING_LOT_LOCATIONS, BUS_STOP_LOCATIONS, BUILDING_DESTINATIONS)
  };
}

export function getParkingModalData(session: UserParkingSession, now: string | Date): ParkingModalData {
  const panel = getActiveSessionPanelData(session, now);
  return {
    ...panel,
    lotName: getLotName(session.lotId),
    floorLabel: session.floorKey ?? "Ground",
    slotLabel: session.slotId
  };
}

export function getAlertsPageData(session: UserParkingSession, now: string | Date) {
  const panel = getActiveSessionPanelData(session, now);
  return {
    alerts: panel.alerts,
    countdowns: panel.countdowns,
    ruleStatus: panel.ruleResult,
    session
  };
}

export function getParkingPageData(session: UserParkingSession, now: string | Date): ParkingPageData {
  return getActiveSessionPanelData(session, now);
}

export function buildSessionInputFromUser(
  user: User,
  lotId: string,
  floorKey: FloorKey | undefined,
  slotId: string,
  coordinates: Coordinates | null
) {
  const defaultPreferred = getBuildingIdFromLabel(user.favoriteBuildings[0]) ?? "";
  return {
    userId: user.id,
    category: toStudentCategory(user.userCategory),
    lotId,
    floorKey,
    slotId,
    parkedAt: new Date().toISOString(),
    parkedCoordinates: coordinates ?? getLotCoordinates(lotId),
    preferredDestinationBuildingId: defaultPreferred,
    endedAt: null
  };
}

export const parkingSessionTests = [
  {
    name: "active parked session in parking_73 for non_resident_male => nearest male bus stops + 10 PM countdown",
    run: () => {
      const session = startParkingSession({
        userId: "u1",
        category: "non_resident_male",
        lotId: "lot-73",
        floorKey: "F1",
        slotId: "73-01",
        parkedAt: new Date("2026-04-19T21:15:00").toISOString(),
        parkedCoordinates: { lat: 26.3129852, lng: 50.1426181 },
        preferredDestinationBuildingId: "building_22"
      });
      const data = getParkingPageData(session, new Date("2026-04-19T21:15:00"));
      return Boolean(data.guidance.nearestBusStop) && data.countdowns.some((item) => item.label.includes("10:00 PM"));
    }
  },
  {
    name: "active parked session in parking_64 L2 for non_resident_female => blocked/faculty-staff-only alert returned",
    run: () => {
      const session = startParkingSession({
        userId: "u2",
        category: "non_resident_female",
        lotId: "lot-64",
        floorKey: "L2",
        slotId: "64-L2-05",
        parkedAt: new Date("2026-04-19T21:15:00").toISOString(),
        parkedCoordinates: { lat: 26.3112126, lng: 50.137706 },
        preferredDestinationBuildingId: "building_22"
      });
      return getAlertsPageData(session, new Date("2026-04-19T21:15:00")).alerts.some((alert) => alert.message.includes("faculty and staff"));
    }
  },
  {
    name: "active parked session with geolocation unavailable => falls back to lot coordinates",
    run: () => {
      const user = {
        id: "u3",
        name: "User",
        studentId: "1",
        email: "u@test.com",
        passwordHash: "",
        gender: "male" as const,
        residencyStatus: "non-resident" as const,
        userCategory: "non-resident-male" as const,
        favoriteBuildings: ["Building 22"],
        notificationSettings: { push: true, email: true, sound: true, busAlerts: true, violationAlerts: true },
        role: "student" as const,
        createdAt: "",
        updatedAt: ""
      };
      const session = startParkingSession(buildSessionInputFromUser(user, "lot-73", "F1", "73-02", null));
      return session.parkedCoordinates.lat === 26.3129852 && session.parkedCoordinates.lng === 50.1426181;
    }
  }
] as const;
