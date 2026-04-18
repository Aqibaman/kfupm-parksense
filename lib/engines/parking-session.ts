import { busStops, parkingLots } from "@/lib/data/kfupm-data";
import {
  getFloorAccessDetails,
  getLotAccessDetails as getLotDetailAccessDetails,
  type FloorKey,
  type ParkingLotId
} from "@/lib/engines/lot-detail";
import {
  toStudentCategory,
  type StudentCategory
} from "@/lib/engines/rules";
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

export interface Coordinates {
  lat: number;
  lng: number;
}

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
  floorKey?: FloorKey;
  slotId: SlotId;
  parkedAt: string;
  parkedCoordinates: Coordinates | null;
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
  coordinates: Coordinates;
}

export interface BuildingDestination {
  id: string;
  name: string;
  coordinates: Coordinates;
}

export interface ParkingLotLocation {
  id: string;
  canonicalLotId: ParkingLotId;
  name: string;
  coordinates: Coordinates;
}

export interface SmartGuidanceResult {
  nearestBusStop: BusStop | null;
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

export interface ParkingPermissionConfig {
  allowedLots: ParkingLotId[];
  commuterCutoff?: "22:00";
}

export interface FloorAccessConfig {
  [lotId: string]: Partial<Record<FloorKey, { allowedCategories?: StudentCategory[]; blockedCategories?: StudentCategory[]; note: string }>>;
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

const CATEGORY_PERMISSION_CONFIG: Record<StudentCategory, ParkingPermissionConfig> = {
  resident_male: {
    allowedLots: [
      "dhahran_mosque",
      "al_zubair_mosque",
      "student_mall",
      "medical_center",
      "parking_60",
      "parking_71",
      "parking_72",
      "parking_73",
      "parking_74"
    ]
  },
  non_resident_male: {
    allowedLots: [
      "parking_59",
      "parking_60",
      "medical_center",
      "parking_64",
      "parking_19",
      "parking_20",
      "student_mall",
      "parking_71",
      "parking_72",
      "parking_73",
      "parking_74",
      "parking_23",
      "parking_25",
      "parking_77",
      "parking_39",
      "dhahran_mosque"
    ],
    commuterCutoff: "22:00"
  },
  resident_female: {
    allowedLots: ["female_student_housing", "family_mall", "medical_center", "parking_60", "parking_73"]
  },
  non_resident_female: {
    allowedLots: [
      "female_student_housing",
      "family_mall",
      "student_mall",
      "medical_center",
      "parking_39",
      "parking_57",
      "parking_59",
      "parking_60",
      "parking_400",
      "parking_19",
      "parking_20",
      "parking_23",
      "parking_25",
      "parking_73",
      "parking_77",
      "parking_64"
    ],
    commuterCutoff: "22:00"
  }
};

const FLOOR_ACCESS_CONFIG: FloorAccessConfig = {
  parking_23: {
    F1: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      note: "Only the 3rd floor is allowed for eligible student permits."
    },
    F2: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      note: "Only the 3rd floor is allowed for eligible student permits."
    },
    F3: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "3rd floor only for eligible non-resident students."
    }
  },
  parking_25: {
    F1: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      note: "Only the 2nd floor is allowed for eligible student permits."
    },
    F2: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "2nd floor only for eligible non-resident students."
    }
  },
  parking_64: {
    L0: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "Off-campus students only."
    },
    L1: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      note: "Faculty/staff only."
    },
    L2: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      note: "Faculty/staff only."
    },
    L3: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "Off-campus students only."
    },
    UNCOVERED: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "Off-campus students only."
    }
  },
  parking_77: {
    L1: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "L1 and L2 only for eligible non-resident students."
    },
    L2: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      note: "L1 and L2 only for eligible non-resident students."
    }
  }
};

const CANONICAL_LOT_ALIASES: Record<string, ParkingLotId> = {
  "lot-19": "parking_19",
  "lot-20": "parking_20",
  "lot-23": "parking_23",
  "lot-25": "parking_25",
  "lot-39": "parking_39",
  "lot-57": "parking_57",
  "lot-59": "parking_59",
  "lot-60": "parking_60",
  "lot-64": "parking_64",
  "lot-71": "parking_71",
  "lot-72": "parking_72",
  "lot-73": "parking_73",
  "lot-74": "parking_74",
  "lot-77": "parking_77",
  "lot-400": "parking_400",
  "lot-mall": "student_mall",
  "lot-medical": "medical_center",
  "lot-dhahran-mosque": "dhahran_mosque",
  "lot-alzubair": "al_zubair_mosque",
  "lot-female-housing": "female_student_housing",
  "lot-university-square": "family_mall"
};

export const BUILDING_DESTINATIONS: BuildingDestination[] = [
  { id: "building_4", name: "Building 4", coordinates: { lat: 26.3042, lng: 50.1468 } },
  { id: "building_22", name: "Building 22", coordinates: { lat: 26.3056, lng: 50.1494 } },
  { id: "building_58", name: "Building 58", coordinates: { lat: 26.3011, lng: 50.1518 } },
  { id: "building_64", name: "Building 64", coordinates: { lat: 26.3061, lng: 50.1517 } },
  { id: "student_mall", name: "Student Mall", coordinates: { lat: 26.2957, lng: 50.1462 } },
  { id: "medical_center", name: "Medical Center", coordinates: { lat: 26.2993, lng: 50.1492 } },
  { id: "female_housing", name: "Female Housing", coordinates: { lat: 26.2943, lng: 50.1602 } },
  { id: "university_square", name: "University Square", coordinates: { lat: 26.2952, lng: 50.1585 } }
];

export const BUS_STOP_LOCATIONS: BusStop[] = busStops.map((stop) => ({
  id: stop.id,
  label: stop.stopName,
  coordinates: { lat: stop.latitude, lng: stop.longitude }
}));

export const PARKING_LOT_LOCATIONS: ParkingLotLocation[] = parkingLots.map((lot) => ({
  id: lot.id,
  canonicalLotId: resolveCanonicalLotId(lot.id),
  name: lot.lotName,
  coordinates: { lat: lot.latitude, lng: lot.longitude }
}));

export function resolveCanonicalLotId(lotId: string): ParkingLotId {
  return (CANONICAL_LOT_ALIASES[lotId] ?? lotId) as ParkingLotId;
}

export function getDistanceMeters(a: Coordinates, b: Coordinates) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function sortByNearest<T extends { coordinates: Coordinates }>(origin: Coordinates, candidates: T[]) {
  return [...candidates].sort((left, right) => getDistanceMeters(origin, left.coordinates) - getDistanceMeters(origin, right.coordinates));
}

function buildDateInput(input: string | Date) {
  if (input instanceof Date) return input;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function setClock(base: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(base);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function formatTime(date: Date | null) {
  if (!date) return null;
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDurationMs(ms: number) {
  const safe = Math.max(ms, 0);
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function getLotLocationByCanonicalId(lotId: ParkingLotId) {
  return PARKING_LOT_LOCATIONS.find((lot) => lot.canonicalLotId === lotId) ?? null;
}

function getSeedLotById(lotId: string) {
  return parkingLots.find((lot) => lot.id === lotId) ?? null;
}

function getBuildingDestination(buildingId: string) {
  return BUILDING_DESTINATIONS.find((building) => building.id === buildingId) ?? null;
}

function normalizeBuildingId(nameOrId: string) {
  const normalized = nameOrId.toLowerCase().replace(/\s+/g, "_");
  return (
    BUILDING_DESTINATIONS.find((building) => building.id === normalized || building.name.toLowerCase() === nameOrId.toLowerCase())?.id ??
    "building_22"
  );
}

export function getNearestBusStop(parkedCoordinates: Coordinates | null, stops: BusStop[]) {
  if (!parkedCoordinates) return null;
  return sortByNearest(parkedCoordinates, stops)[0] ?? null;
}

export function getNearestPermittedParkingToBuilding(category: StudentCategory, buildingId: string, lots: ParkingLotLocation[]) {
  const building = getBuildingDestination(buildingId);
  if (!building) return null;
  const permittedCanonicalIds = new Set(CATEGORY_PERMISSION_CONFIG[category].allowedLots);
  return sortByNearest(
    building.coordinates,
    lots.filter((lot) => permittedCanonicalIds.has(lot.canonicalLotId))
  )[0] ?? null;
}

function buildSessionId(userId: string, lotId: string, slotId: string) {
  return `session-${userId}-${lotId}-${slotId}-${Date.now()}`;
}

export function startParkingSession(input: Omit<UserParkingSession, "id" | "isActive">) {
  return {
    ...input,
    id: buildSessionId(input.userId, input.lotId, input.slotId),
    isActive: true
  } satisfies UserParkingSession;
}

export function endParkingSession(sessionId: string) {
  return {
    id: sessionId,
    endedAt: new Date().toISOString(),
    isActive: false
  };
}

function buildRule(
  id: string,
  type: ParkingRuleType,
  severity: AlertSeverity,
  title: string,
  message: string,
  active = true,
  leaveBy?: string | null,
  countdownTarget?: string | null
): ParkingRule {
  return { id, type, severity, title, message, active, leaveBy, countdownTarget };
}

export function evaluateParkingRules(session: UserParkingSession, now: string | Date): RuleEvaluationResult {
  const nowDate = buildDateInput(now);
  const canonicalLotId = resolveCanonicalLotId(session.lotId);
  const lotAccess = getLotDetailAccessDetails(session.category, canonicalLotId, nowDate);
  const floorAccess = session.floorKey ? getFloorAccessDetails(session.category, canonicalLotId, session.floorKey, nowDate) : null;
  const floorConfigNote = session.floorKey ? FLOOR_ACCESS_CONFIG[canonicalLotId]?.[session.floorKey]?.note ?? null : null;
  const rules: ParkingRule[] = [];

  if (!lotAccess.allowed) {
    rules.push(
      buildRule(
        "category-access",
        "category_access_rule",
        "critical",
        "Permit access blocked",
        "You are parked in an area not permitted for your permit."
      )
    );
  }

  if (floorAccess && !floorAccess.allowed) {
    rules.push(
      buildRule(
        "floor-access",
        "floor_access_rule",
        "critical",
        "Floor access blocked",
        floorConfigNote ?? floorAccess.bannerText ?? "This floor is not available for your permit."
      )
    );
  }

  const profile = CATEGORY_PERMISSION_CONFIG[session.category];
  const curfewTime = profile.commuterCutoff ? setClock(nowDate, profile.commuterCutoff) : null;
  if (curfewTime) {
    const remainingMs = curfewTime.getTime() - nowDate.getTime();
    rules.push(
      buildRule(
        "curfew-rule",
        "curfew_rule",
        remainingMs <= 0 ? "critical" : remainingMs <= 60 * 60 * 1000 ? "warning" : "info",
        "10:00 PM campus leave-by",
        remainingMs <= 0 ? "Leave now to avoid violation." : "You must leave this parking area by 10:00 PM.",
        true,
        formatTime(curfewTime),
        curfewTime.toISOString()
      )
    );
  }

  if (canonicalLotId === "student_mall") {
    const durationTarget = new Date(buildDateInput(session.parkedAt).getTime() + 2 * 60 * 60 * 1000);
    const remainingMs = durationTarget.getTime() - nowDate.getTime();
    rules.push(
      buildRule(
        "student-mall-duration",
        "duration_rule",
        remainingMs <= 0 ? "critical" : remainingMs <= 60 * 60 * 1000 ? "warning" : "info",
        "Student Mall 2-hour rule",
        remainingMs <= 0 ? "Student Mall parking time has been exceeded." : "Student Mall parking is limited to 2 hours.",
        true,
        formatTime(durationTarget),
        durationTarget.toISOString()
      )
    );
  }

  if (canonicalLotId === "parking_64") {
    rules.push(
      buildRule(
        "lot-64-specific",
        "lot_specific_rule",
        floorAccess?.allowed ? "info" : "critical",
        "Building 64 mixed-access rule",
        "L1 and L2 are faculty/staff only. L0, L3, and uncovered are only for off-campus students."
      )
    );
  }

  for (const note of lotAccess.fullRuleText) {
    rules.push(buildRule(`note-${note}`, "note_rule", "info", "Parking note", note));
  }

  const violationRuleTargets = rules.filter((rule) => rule.countdownTarget);
  for (const target of violationRuleTargets) {
    const remainingMs = new Date(target.countdownTarget as string).getTime() - nowDate.getTime();
    if (remainingMs <= 60 * 60 * 1000) {
      rules.push(
        buildRule(
          `violation-${target.id}`,
          "violation_risk_rule",
          remainingMs <= 0 ? "critical" : "warning",
          remainingMs <= 0 ? "Violation risk active" : "Violation window approaching",
          remainingMs <= 0 ? "Leave now to avoid violation." : "Your leave-by time is approaching.",
          true,
          target.leaveBy,
          target.countdownTarget
        )
      );
    }
  }

  const permitStatus: RuleEvaluationResult["permitStatus"] = !lotAccess.allowed || (floorAccess && !floorAccess.allowed)
    ? "unauthorized"
    : floorAccess?.accessStatus === "restricted"
      ? "restricted"
      : "allowed";
  const violationRiskStatus: RuleEvaluationResult["violationRiskStatus"] = rules.some((rule) => rule.severity === "critical")
    ? "critical"
    : rules.some((rule) => rule.severity === "warning")
      ? "warning"
      : "none";
  const leaveByRule = rules.find((rule) => rule.leaveBy);

  return {
    permitStatus,
    violationRiskStatus,
    leaveByTime: leaveByRule?.leaveBy ?? null,
    rules
  };
}

export function buildAlertsFromRules(session: UserParkingSession, ruleResult: RuleEvaluationResult, now: string | Date) {
  const nowIso = buildDateInput(now).toISOString();
  return ruleResult.rules
    .filter((rule) => rule.active)
    .map<ActiveAlert>((rule) => ({
      id: `${session.id}-${rule.id}`,
      type: rule.type,
      severity: rule.severity,
      title: rule.title,
      message: rule.message,
      lotId: session.lotId,
      floorKey: session.floorKey,
      startsAt: nowIso,
      endsAt: rule.countdownTarget ?? undefined,
      countdownMs: rule.countdownTarget ? new Date(rule.countdownTarget).getTime() - buildDateInput(now).getTime() : null,
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
        targetTime: rule.leaveBy ?? formatTime(new Date(rule.countdownTarget as string)) ?? "",
        remainingMs,
        status: remainingMs <= 0 ? "expired" : remainingMs <= 60 * 60 * 1000 ? "warning" : "active"
      };
    });
}

export function buildSmartGuidance(
  session: UserParkingSession,
  parkingLotLocations: ParkingLotLocation[],
  stops: BusStop[],
  buildings: BuildingDestination[]
): SmartGuidanceResult {
  const building = buildings.find((item) => item.id === session.preferredDestinationBuildingId) ?? null;
  const nearestBusStop = getNearestBusStop(session.parkedCoordinates, stops);
  const nearestPermittedParkingToDestination = getNearestPermittedParkingToBuilding(session.category, session.preferredDestinationBuildingId, parkingLotLocations);
  const currentLot = parkingLotLocations.find((lot) => lot.id === session.lotId) ?? null;
  const walkingDistance = session.parkedCoordinates && building
    ? getDistanceMeters(session.parkedCoordinates, building.coordinates)
    : currentLot && building
      ? getDistanceMeters(currentLot.coordinates, building.coordinates)
      : Infinity;
  const walkingRecommended = walkingDistance <= 650;
  const summaryLines = [
    currentLot ? `You parked at ${currentLot.name}.` : "Your parked lot is active in the system.",
    nearestBusStop ? `Nearest bus stop from your parked location: ${nearestBusStop.label}.` : "Bus stop guidance is unavailable until location is captured.",
    building && nearestPermittedParkingToDestination
      ? `For ${building.name}, the nearest permitted parking for your permit is ${nearestPermittedParkingToDestination.name}.`
      : "Preferred-building parking insight is ready once a destination is selected.",
    walkingRecommended
      ? "Walking directly to your destination is short enough right now."
      : "Use the bus stop guidance for the smoother trip."
  ];

  return {
    nearestBusStop,
    nearestPermittedParkingToDestination,
    walkingRecommended,
    summaryLines
  };
}

export function getActiveSessionPanelData(session: UserParkingSession, now: string | Date) {
  const ruleResult = evaluateParkingRules(session, now);
  return {
    session,
    ruleResult,
    alerts: buildAlertsFromRules(session, ruleResult, now),
    countdowns: buildCountdownsFromRules(session, ruleResult, now),
    guidance: buildSmartGuidance(session, PARKING_LOT_LOCATIONS, BUS_STOP_LOCATIONS, BUILDING_DESTINATIONS),
    elapsedLabel: formatDurationMs(buildDateInput(now).getTime() - buildDateInput(session.parkedAt).getTime())
  };
}

export function getParkingModalData(session: UserParkingSession, now: string | Date): ParkingModalData {
  const panel = getActiveSessionPanelData(session, now);
  const lot = getSeedLotById(session.lotId);
  return {
    ...panel,
    lotName: lot?.lotName ?? session.lotId,
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
  const ruleResult = evaluateParkingRules(session, now);
  return {
    session,
    ruleResult,
    alerts: buildAlertsFromRules(session, ruleResult, now),
    countdowns: buildCountdownsFromRules(session, ruleResult, now),
    guidance: buildSmartGuidance(session, PARKING_LOT_LOCATIONS, BUS_STOP_LOCATIONS, BUILDING_DESTINATIONS)
  };
}

export function buildSessionInputFromUser(user: User, lotId: string, floorKey: FloorKey | undefined, slotId: string, coordinates: Coordinates | null) {
  return {
    userId: user.id,
    category: toStudentCategory(user.userCategory),
    lotId,
    floorKey,
    slotId,
    parkedAt: new Date().toISOString(),
    parkedCoordinates: coordinates,
    preferredDestinationBuildingId: normalizeBuildingId(user.favoriteBuildings[0] ?? "Building 22"),
    endedAt: null
  };
}

export const parkingSessionTests = [
  {
    name: "non_resident_male parked in parking_25 floor 2 at 21:30 => allowed + 10 PM countdown",
    run: () => {
      const session = startParkingSession({
        userId: "u1",
        category: "non_resident_male",
        lotId: "lot-25",
        floorKey: "F2",
        slotId: "lot-25-F2-01",
        parkedAt: new Date("2026-04-18T21:30:00").toISOString(),
        parkedCoordinates: { lat: 26.308, lng: 50.1495 },
        preferredDestinationBuildingId: "building_22"
      });
      const result = evaluateParkingRules(session, new Date("2026-04-18T21:30:00"));
      return result.permitStatus !== "unauthorized" && result.leaveByTime === "10:00 PM";
    }
  },
  {
    name: "non_resident_male parked in parking_25 floor 1 => critical unauthorized floor alert",
    run: () => {
      const session = startParkingSession({
        userId: "u1",
        category: "non_resident_male",
        lotId: "lot-25",
        floorKey: "F1",
        slotId: "lot-25-F1-01",
        parkedAt: new Date("2026-04-18T20:00:00").toISOString(),
        parkedCoordinates: { lat: 26.308, lng: 50.1495 },
        preferredDestinationBuildingId: "building_22"
      });
      return buildAlertsFromRules(session, evaluateParkingRules(session, new Date("2026-04-18T20:00:00")), new Date("2026-04-18T20:00:00")).some(
        (alert) => alert.severity === "critical" && alert.type === "floor_access_rule"
      );
    }
  },
  {
    name: "resident_male parked in student_mall for over 2 hours => duration violation alert",
    run: () => {
      const session = startParkingSession({
        userId: "u2",
        category: "resident_male",
        lotId: "lot-mall",
        floorKey: "UNCOVERED",
        slotId: "lot-mall-01",
        parkedAt: new Date("2026-04-18T17:00:00").toISOString(),
        parkedCoordinates: { lat: 26.2957, lng: 50.1462 },
        preferredDestinationBuildingId: "student_mall"
      });
      return evaluateParkingRules(session, new Date("2026-04-18T19:30:00")).rules.some(
        (rule) => rule.type === "duration_rule" && rule.severity === "critical"
      );
    }
  },
  {
    name: "resident_male parked in parking_64 L0 => critical blocked alert",
    run: () => {
      const session = startParkingSession({
        userId: "u3",
        category: "resident_male",
        lotId: "lot-64",
        floorKey: "L0",
        slotId: "lot-64-L0-01",
        parkedAt: new Date("2026-04-18T18:00:00").toISOString(),
        parkedCoordinates: { lat: 26.3062, lng: 50.1518 },
        preferredDestinationBuildingId: "building_64"
      });
      return evaluateParkingRules(session, new Date("2026-04-18T18:05:00")).permitStatus === "unauthorized";
    }
  },
  {
    name: "non_resident_female parked in parking_64 L3 => allowed + 10 PM countdown",
    run: () => {
      const session = startParkingSession({
        userId: "u4",
        category: "non_resident_female",
        lotId: "lot-64",
        floorKey: "L3",
        slotId: "lot-64-L3-01",
        parkedAt: new Date("2026-04-18T20:15:00").toISOString(),
        parkedCoordinates: { lat: 26.3062, lng: 50.1518 },
        preferredDestinationBuildingId: "building_64"
      });
      const result = evaluateParkingRules(session, new Date("2026-04-18T20:15:00"));
      return result.permitStatus !== "unauthorized" && result.leaveByTime === "10:00 PM";
    }
  },
  {
    name: "non_resident_female parked in parking_64 L2 => critical faculty/staff-only alert",
    run: () => {
      const session = startParkingSession({
        userId: "u5",
        category: "non_resident_female",
        lotId: "lot-64",
        floorKey: "L2",
        slotId: "lot-64-L2-01",
        parkedAt: new Date("2026-04-18T20:15:00").toISOString(),
        parkedCoordinates: { lat: 26.3062, lng: 50.1518 },
        preferredDestinationBuildingId: "building_64"
      });
      return buildAlertsFromRules(session, evaluateParkingRules(session, new Date("2026-04-18T20:15:00")), new Date("2026-04-18T20:15:00")).some(
        (alert) => alert.severity === "critical" && alert.message.includes("faculty/staff")
      );
    }
  },
  {
    name: "parked session creates modal data and alerts page data",
    run: () => {
      const session = startParkingSession({
        userId: "u6",
        category: "non_resident_male",
        lotId: "lot-25",
        floorKey: "F2",
        slotId: "lot-25-F2-02",
        parkedAt: new Date("2026-04-18T21:00:00").toISOString(),
        parkedCoordinates: { lat: 26.308, lng: 50.1495 },
        preferredDestinationBuildingId: "building_22"
      });
      return Boolean(getParkingModalData(session, new Date("2026-04-18T21:05:00")).alerts.length) && Boolean(getAlertsPageData(session, new Date("2026-04-18T21:05:00")).countdowns.length);
    }
  },
  {
    name: "smart guidance returns nearest bus stop and nearest permitted parking",
    run: () => {
      const session = startParkingSession({
        userId: "u7",
        category: "non_resident_male",
        lotId: "lot-60",
        floorKey: "UNCOVERED",
        slotId: "lot-60-01",
        parkedAt: new Date("2026-04-18T15:00:00").toISOString(),
        parkedCoordinates: { lat: 26.2975, lng: 50.1538 },
        preferredDestinationBuildingId: "building_22"
      });
      const guidance = buildSmartGuidance(session, PARKING_LOT_LOCATIONS, BUS_STOP_LOCATIONS, BUILDING_DESTINATIONS);
      return Boolean(guidance.nearestBusStop && guidance.nearestPermittedParkingToDestination);
    }
  }
] as const;
