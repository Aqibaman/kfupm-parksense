import {
  buildingLocations,
  getDistanceMeters,
  getParkingRestrictionSummary,
  parkingLocations,
  type BuildingId,
  type ParkingLotId,
  type ParkingRestrictionSummary
} from "@/lib/engines/preferred-building-guidance";
import { PARKING_PERMISSION_CONFIG, type StudentCategory } from "@/lib/engines/rules";

export type FloorKey = "L0" | "L1" | "L2" | "L3" | "F1" | "F2" | "F3" | "UNCOvERED" | "UNCOvERED" | "UNCOvERED";
export type PolicyStatus = "allowed" | "not_allowed" | "restricted_access" | "violation_risk" | "prohibited";
export type CountdownVisualState = "safe" | "warning" | "critical" | "expired";

export interface PolicyRule {
  id: string;
  title: string;
  category: StudentCategory | "all";
  lotIds?: ParkingLotId[];
  type: "category_level" | "floor_level" | "timed" | "prohibited_lot" | "guidance_note";
  badges?: string[];
  text: string;
}

export interface PolicyRuleSet {
  category: StudentCategory;
  allowedLots: ParkingLotId[];
  timedRestrictions: string[];
  floorRestrictions: string[];
  restrictedAreas: string[];
  summary: string;
  rules: PolicyRule[];
}

export interface CheckerInput {
  category: StudentCategory;
  lotId: ParkingLotId;
  floorKey?: string;
  currentTime: string;
  durationMinutes?: number;
  preferredBuildingId?: BuildingId | null;
}

export interface CheckerResult {
  status: PolicyStatus;
  lotId: ParkingLotId;
  floorKey?: string;
  allowed: boolean;
  reason: string;
  matchingRuleText: string[];
  leaveByTime: string | null;
  floorRestriction: string | null;
  restrictionSummary: ParkingRestrictionSummary;
  alternatives: AlternativeSuggestion[];
}

export interface CountdownPolicy {
  id: string;
  title: string;
  lotId?: ParkingLotId;
  appliesTo: string;
  targetTime: string;
  remainingMs: number;
  visualState: CountdownVisualState;
}

export interface QuizAnswer {
  id: string;
  label: string;
  correct: boolean;
}

export interface QuizScenario {
  id: string;
  categories: Array<StudentCategory | "all">;
  prompt: string;
  explanation: string;
  answers: QuizAnswer[];
}

export interface AlternativeSuggestion {
  lotId: ParkingLotId;
  lotName: string;
  why: string;
  distanceLabel: string | null;
  restrictionBadges: string[];
}

const PROHIBITED_LOTS = ["parking_5", "parking_11", "parking_14", "parking_21", "parking_18_covered", "parking_59_covered", "parking_68_covered"] as const;
const ACADEMIC_AFTER_HOURS_LOTS: ParkingLotId[] = ["parking_19", "parking_20", "parking_23", "parking_25", "parking_39", "parking_57", "parking_77"];

const LOT_LABELS: Record<string, string> = {
  parking_5: "Parking 5",
  parking_11: "Parking 11",
  parking_14: "Parking 14",
  parking_21: "Parking 21",
  parking_18_covered: "Parking 18 Covered",
  parking_59_covered: "Parking 59 Covered",
  parking_68_covered: "Parking 68 Covered",
  parking_19: "Lot 19",
  parking_20: "Lot 20",
  parking_23: "Lot 23",
  parking_25: "Lot 25",
  parking_39: "Lot 39",
  parking_57: "Lot 57",
  parking_59: "Lot 59",
  parking_60: "Lot 60",
  parking_64: "Lot 64",
  parking_71: "Lot 71",
  parking_72: "Lot 72",
  parking_73: "Lot 73",
  parking_74: "Lot 74",
  parking_77: "Lot 77",
  parking_400: "Lot 400",
  medical_center: "Medical Center",
  dhahran_mosque: "Dhahran Mosque",
  al_zubair_mosque: "Al-Zubair Mosque",
  student_mall: "Student Mall",
  female_student_housing: "Female Student Housing",
  family_mall: "Family Mall"
};

const CATEGORY_SUMMARIES: Record<StudentCategory, string> = {
  resident_male:
    "You can use your resident-male lots without the commuter cutoff, but Student Mall remains limited to mall visits with a maximum stay of 2 hours.",
  non_resident_male:
    "Your permit is commuter-based: leave campus by 10:00 PM and watch floor-restricted lots like 23, 25, 77, and 64 closely.",
  resident_female:
    "Your permit follows the resident-female allocation only, with no general 10:00 PM commuter cutoff and no access to off-campus-only areas such as Lot 64.",
  non_resident_female:
    "Your permit is commuter-based: leave by 10:00 PM and follow the floor-specific rules for Lots 23, 25, 77, and 64."
};

function makeRule(id: string, title: string, category: StudentCategory | "all", type: PolicyRule["type"], text: string, lotIds?: ParkingLotId[], badges?: string[]): PolicyRule {
  return { id, title, category, type, text, lotIds, badges };
}

const CATEGORY_RULES: Record<StudentCategory, PolicyRule[]> = {
  resident_male: [
    makeRule("rm-mall", "Student Mall limit", "resident_male", "timed", "Student Mall is for mall visits only and the maximum stay is 2 hours.", ["student_mall"], ["2-hour max"]),
    makeRule("rm-general", "Resident male access", "resident_male", "category_level", "You may use Lot 60, Lots 71-74, Medical Center, Dhahran Mosque, Al-Zubair Mosque, and Student Mall."),
    makeRule("rm-64", "Lot 64 restriction", "resident_male", "floor_level", "Resident students are not allowed in Building 64 student-access areas.", ["parking_64"])
  ],
  non_resident_male: [
    makeRule("nrm-curfew", "Commuter cutoff", "non_resident_male", "timed", "You must leave campus by 10:00 PM.", undefined, ["Leave by 10:00 PM"]),
    makeRule("nrm-23", "Lot 23 floor rule", "non_resident_male", "floor_level", "Lot 23 is restricted to the 3rd floor only.", ["parking_23"], ["3rd floor only"]),
    makeRule("nrm-25", "Lot 25 floor rule", "non_resident_male", "floor_level", "Lot 25 is restricted to the 2nd floor only.", ["parking_25"], ["2nd floor only"]),
    makeRule("nrm-77", "Lot 77 floor rule", "non_resident_male", "floor_level", "Lot 77 is restricted to levels L1 and L2 only.", ["parking_77"], ["L1 + L2 only"]),
    makeRule("nrm-64", "Lot 64 level rule", "non_resident_male", "floor_level", "Lot 64 allows only L0, L3, and uncovered areas for off-campus students. Levels L1 and L2 are faculty/staff only.", ["parking_64"], ["Off-campus students only"])
  ],
  resident_female: [
    makeRule("rf-dedicated", "Resident-female dedicated rules", "resident_female", "guidance_note", "Follow the stricter resident-female allocation only. There is no general 10:00 PM commuter cutoff."),
    makeRule("rf-64", "Lot 64 restriction", "resident_female", "floor_level", "Resident students are not allowed in Building 64 student-access areas.", ["parking_64"])
  ],
  non_resident_female: [
    makeRule("nrf-curfew", "Commuter cutoff", "non_resident_female", "timed", "You must leave campus by 10:00 PM.", undefined, ["Leave by 10:00 PM"]),
    makeRule("nrf-23", "Lot 23 floor rule", "non_resident_female", "floor_level", "Lot 23 is restricted to the 3rd floor only.", ["parking_23"], ["3rd floor only"]),
    makeRule("nrf-25", "Lot 25 floor rule", "non_resident_female", "floor_level", "Lot 25 is restricted to the 2nd floor only.", ["parking_25"], ["2nd floor only"]),
    makeRule("nrf-77", "Lot 77 floor rule", "non_resident_female", "floor_level", "Lot 77 is restricted to levels L1 and L2 only.", ["parking_77"], ["L1 + L2 only"]),
    makeRule("nrf-64", "Lot 64 level rule", "non_resident_female", "floor_level", "Lot 64 allows only L0, L3, and uncovered areas for off-campus students. Levels L1 and L2 are faculty/staff only.", ["parking_64"], ["Off-campus students only"])
  ]
};

const GLOBAL_RULES: PolicyRule[] = [
  makeRule("global-after-hours", "General academic parking", "all", "guidance_note", "Academic building lots are generally allowed after 5:00 PM until 7:00 AM, but this never overrides permanently prohibited lots.", undefined, ["5:00 PM - 7:00 AM"]),
  makeRule("global-prohibited", "Permanently prohibited lots", "all", "prohibited_lot", "Parking 5, 11, 14, 21, 18 Covered, 59 Covered, and 68 Covered remain prohibited.", undefined, ["Always prohibited"])
];

const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: "scenario-1",
    categories: ["all"],
    prompt: "You are a non-resident male parked in Lot 23 on floor 2. Is this allowed?",
    explanation: "No. Non-resident students may use Lot 23 on the 3rd floor only.",
    answers: [
      { id: "a", label: "Yes, any floor is fine", correct: false },
      { id: "b", label: "No, only the 3rd floor is allowed", correct: true }
    ]
  },
  {
    id: "scenario-2",
    categories: ["all"],
    prompt: "You are a resident male parked in Student Mall for 2 hours 20 minutes. Safe or violation risk?",
    explanation: "Violation risk. Student Mall is mall-visit only and the maximum stay is 2 hours.",
    answers: [
      { id: "a", label: "Safe", correct: false },
      { id: "b", label: "Violation risk", correct: true }
    ]
  },
  {
    id: "scenario-3",
    categories: ["all"],
    prompt: "You are a non-resident female parked in Lot 64 L3 at 8:30 PM. Is this allowed?",
    explanation: "Yes. L3 is allowed for off-campus students, but the commuter cutoff still requires leaving by 10:00 PM.",
    answers: [
      { id: "a", label: "Yes, but leave by 10:00 PM", correct: true },
      { id: "b", label: "No, Lot 64 is always blocked", correct: false }
    ]
  },
  {
    id: "scenario-4",
    categories: ["all"],
    prompt: "You are a resident female trying to park in Lot 59. Is this allowed?",
    explanation: "No. Lot 59 is not listed in the resident-female allowed parking group.",
    answers: [
      { id: "a", label: "Yes", correct: false },
      { id: "b", label: "No", correct: true }
    ]
  },
  {
    id: "scenario-5",
    categories: ["all"],
    prompt: "You are a non-resident male parked in Lot 25 floor 2 at 9:40 PM. What is the main rule to watch?",
    explanation: "The floor is correct, but the active rule to watch is the 10:00 PM commuter cutoff.",
    answers: [
      { id: "a", label: "Leave by 10:00 PM", correct: true },
      { id: "b", label: "Move to floor 3", correct: false }
    ]
  },
  {
    id: "scenario-6",
    categories: ["all"],
    prompt: "You are a resident male in Lot 64 L0. Is it allowed?",
    explanation: "No. Resident students are prohibited from Lot 64 student-access areas.",
    answers: [
      { id: "a", label: "Yes, L0 is open", correct: false },
      { id: "b", label: "No, resident students are blocked", correct: true }
    ]
  },
  {
    id: "scenario-7",
    categories: ["all"],
    prompt: "A lot becomes available after 5:00 PM. Does that override permanently prohibited lots?",
    explanation: "No. After-hours academic parking never overrides the permanently prohibited list.",
    answers: [
      { id: "a", label: "Yes, after 5 PM all lots are open", correct: false },
      { id: "b", label: "No, prohibited lots remain blocked", correct: true }
    ]
  },
  {
    id: "scenario-8",
    categories: ["all"],
    prompt: "You are a non-resident female in Lot 77 L3. Allowed or not allowed?",
    explanation: "Not allowed. Eligible non-resident students may use only L1 and L2 in Lot 77.",
    answers: [
      { id: "a", label: "Allowed", correct: false },
      { id: "b", label: "Not allowed", correct: true }
    ]
  },
  {
    id: "scenario-9",
    categories: ["all"],
    prompt: "You are a non-resident male in Lot 64 L2. What rule applies?",
    explanation: "L2 is faculty/staff only, so the student is in a restricted area.",
    answers: [
      { id: "a", label: "Faculty/staff only", correct: true },
      { id: "b", label: "Off-campus students only", correct: false }
    ]
  },
  {
    id: "scenario-10",
    categories: ["all"],
    prompt: "You are a resident female using Medical Center parking. Is there a 10:00 PM commuter cutoff?",
    explanation: "No. Resident-female users do not have the general commuter cutoff.",
    answers: [
      { id: "a", label: "Yes", correct: false },
      { id: "b", label: "No", correct: true }
    ]
  },
  {
    id: "scenario-11",
    categories: ["all"],
    prompt: "You are a non-resident female checking Lot 25 floor 2 at 9:50 PM. What state best describes the timer?",
    explanation: "Critical. The floor is allowed, but fewer than 15 minutes remain before the 10:00 PM cutoff.",
    answers: [
      { id: "a", label: "Critical countdown", correct: true },
      { id: "b", label: "Safe", correct: false }
    ]
  },
  {
    id: "scenario-12",
    categories: ["all"],
    prompt: "You are a resident male selecting Parking 11. What should the guide show?",
    explanation: "Parking 11 is permanently prohibited, so the result should be prohibited with alternatives.",
    answers: [
      { id: "a", label: "Prohibited", correct: true },
      { id: "b", label: "Allowed after 5 PM", correct: false }
    ]
  }
];

function parseTimeToday(currentTime: string) {
  const [hours, minutes] = currentTime.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function isAfterHours(time: string) {
  const date = parseTimeToday(time);
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= 17 * 60 || minutes <= 7 * 60;
}

function getAllowedFloorBadges(category: StudentCategory, lotId: ParkingLotId) {
  return getParkingRestrictionSummary(category, lotId).badges;
}

function getFloorRuleForLot(category: StudentCategory, lotId: ParkingLotId) {
  const restriction = getParkingRestrictionSummary(category, lotId);
  return restriction.shortText;
}

function buildLeaveByDate(time: string, target = "22:00") {
  const date = parseTimeToday(time);
  const [hours, minutes] = target.split(":").map(Number);
  const targetDate = new Date(date);
  targetDate.setHours(hours, minutes, 0, 0);
  return targetDate;
}

function getCheckerReason(status: PolicyStatus, lotLabel: string, details: string) {
  switch (status) {
    case "allowed":
      return `${lotLabel} is allowed for your permit. ${details}`.trim();
    case "restricted_access":
      return `${lotLabel} is only allowed with restrictions. ${details}`.trim();
    case "violation_risk":
      return `${lotLabel} is creating a violation risk. ${details}`.trim();
    case "prohibited":
      return `${lotLabel} is permanently prohibited. ${details}`.trim();
    default:
      return `${lotLabel} is not available for your permit. ${details}`.trim();
  }
}

export function getAllowedLotsForCategory(category: StudentCategory) {
  return (PARKING_PERMISSION_CONFIG[category]?.allowedLots ?? []) as ParkingLotId[];
}

export function getCategoryPolicySummary(category: StudentCategory): PolicyRuleSet {
  const allowedLots = getAllowedLotsForCategory(category);
  const categoryRules = CATEGORY_RULES[category] ?? [];
  const timedRestrictions = categoryRules.filter((rule) => rule.type === "timed").map((rule) => rule.text);
  const floorRestrictions = categoryRules.filter((rule) => rule.type === "floor_level").map((rule) => rule.text);
  const restrictedAreas = [
    ...new Set(
      [
        ...floorRestrictions,
        ...GLOBAL_RULES.filter((rule) => rule.type === "prohibited_lot").map((rule) => rule.text)
      ]
    )
  ];

  return {
    category,
    allowedLots,
    timedRestrictions,
    floorRestrictions,
    restrictedAreas,
    summary: CATEGORY_SUMMARIES[category],
    rules: [...GLOBAL_RULES, ...categoryRules]
  };
}

export function getLotRestrictionSummary(category: StudentCategory, lotId: ParkingLotId) {
  if ((PROHIBITED_LOTS as readonly string[]).includes(lotId)) {
    return {
      lotId,
      badges: ["Always prohibited"],
      shortText: `${LOT_LABELS[lotId]} is permanently prohibited.`,
      partiallyRestricted: false
    };
  }

  return getParkingRestrictionSummary(category, lotId);
}

export function getCountdownState(targetTime: string, now: string): CountdownVisualState {
  const remainingMs = buildLeaveByDate(targetTime).getTime() - parseTimeToday(now).getTime();
  const remainingMinutes = remainingMs / 60000;
  if (remainingMinutes <= 0) return "expired";
  if (remainingMinutes < 15) return "critical";
  if (remainingMinutes <= 60) return "warning";
  return "safe";
}

export function getCountdownPolicies(input: CheckerInput, now: string) {
  const policies: CountdownPolicy[] = [];

  if (input.category === "non_resident_male" || input.category === "non_resident_female") {
    const target = buildLeaveByDate(input.currentTime, "22:00");
    policies.push({
      id: `cutoff-${input.category}`,
      title: "10:00 PM commuter cutoff",
      lotId: input.lotId,
      appliesTo: LOT_LABELS[input.lotId],
      targetTime: formatClock(target),
      remainingMs: target.getTime() - parseTimeToday(now).getTime(),
      visualState: getCountdownState(input.currentTime.replace(/:.*/, ":00"), now)
    });
  }

  if (input.lotId === "student_mall") {
    const usedMinutes = input.durationMinutes ?? 0;
    const remainingMinutes = 120 - usedMinutes;
    const target = new Date(parseTimeToday(now));
    target.setMinutes(target.getMinutes() + Math.max(remainingMinutes, 0));
    const visualState: CountdownVisualState =
      remainingMinutes <= 0 ? "expired" : remainingMinutes < 15 ? "critical" : remainingMinutes <= 60 ? "warning" : "safe";

    policies.push({
      id: "mall-duration",
      title: "Student Mall max 2-hour timer",
      lotId: "student_mall",
      appliesTo: "Student Mall",
      targetTime: formatClock(target),
      remainingMs: Math.max(remainingMinutes, 0) * 60000,
      visualState
    });
  }

  return policies;
}

export function getLegalAlternatives(
  category: StudentCategory,
  disallowedLotId: ParkingLotId,
  floorKey?: string,
  preferredBuildingId?: BuildingId | null
) {
  const allowedLots = getAllowedLotsForCategory(category);
  const recommendations: AlternativeSuggestion[] = [];
  const disallowedSummary = getLotRestrictionSummary(category, disallowedLotId);

  if (floorKey && disallowedSummary.badges.some((badge) => badge.includes("floor") || badge.includes("L1"))) {
    recommendations.push({
      lotId: disallowedLotId,
      lotName: LOT_LABELS[disallowedLotId],
      why: "Same lot, but switch to the allowed floor or area shown in the policy.",
      distanceLabel: null,
      restrictionBadges: disallowedSummary.badges
    });
  }

  const building = buildingLocations.find((item) => item.id === preferredBuildingId);
  const alternativeLots = parkingLocations
    .filter((lot) => allowedLots.includes(lot.canonicalId) && lot.canonicalId !== disallowedLotId)
    .map((lot) => ({
      lot,
      distance: building ? getDistanceMeters(building.coordinates, lot.coordinates) : null
    }))
    .sort((left, right) => {
      if (left.distance !== null && right.distance !== null) {
        return left.distance - right.distance || left.lot.name.localeCompare(right.lot.name);
      }
      return allowedLots.indexOf(left.lot.canonicalId) - allowedLots.indexOf(right.lot.canonicalId);
    })
    .slice(0, 6);

  recommendations.push(
    ...alternativeLots.map(({ lot, distance }): AlternativeSuggestion => ({
      lotId: lot.canonicalId,
      lotName: lot.name,
      why: "Legal alternative for your permit.",
      distanceLabel: distance !== null ? `${distance} m` : null,
      restrictionBadges: getLotRestrictionSummary(category, lot.canonicalId).badges
    }))
  );

  return recommendations;
}

export function evaluateParkingPolicy(input: CheckerInput): CheckerResult {
  const lotLabel = LOT_LABELS[input.lotId];

  if ((PROHIBITED_LOTS as readonly string[]).includes(input.lotId)) {
    return {
      status: "prohibited",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: false,
      reason: getCheckerReason("prohibited", lotLabel, "This lot remains prohibited at all times."),
      matchingRuleText: ["This lot is permanently prohibited."],
      leaveByTime: null,
      floorRestriction: null,
      restrictionSummary: getLotRestrictionSummary(input.category, input.lotId),
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  const allowedLots = getAllowedLotsForCategory(input.category);
  const restriction = getLotRestrictionSummary(input.category, input.lotId);
  const matchingRules = getCategoryPolicySummary(input.category).rules
    .filter((rule) => !rule.lotIds || rule.lotIds.includes(input.lotId))
    .map((rule) => rule.text);

  const afterHoursEligible = ACADEMIC_AFTER_HOURS_LOTS.includes(input.lotId) && isAfterHours(input.currentTime);
  const lotAllowed = allowedLots.includes(input.lotId) || afterHoursEligible;

  if (!lotAllowed) {
    return {
      status: "not_allowed",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: false,
      reason: getCheckerReason("not_allowed", lotLabel, "It is not listed in your permit-access group."),
      matchingRuleText: matchingRules.length ? matchingRules : ["This lot is not listed for your permit category."],
      leaveByTime: null,
      floorRestriction: restriction.shortText,
      restrictionSummary: restriction,
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  const floor = input.floorKey?.toUpperCase();
  const commuter = input.category === "non_resident_male" || input.category === "non_resident_female";
  const leaveByTime = commuter ? "10:00 PM" : null;

  if (input.lotId === "parking_23" && floor && floor !== "F3" && floor !== "L3") {
    return {
      status: "not_allowed",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: false,
      reason: getCheckerReason("not_allowed", lotLabel, "Only the 3rd floor is allowed for your permit."),
      matchingRuleText: ["Lot 23: 3rd floor only."],
      leaveByTime,
      floorRestriction: "3rd floor only",
      restrictionSummary: restriction,
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  if (input.lotId === "parking_25" && floor && floor !== "F2" && floor !== "L2") {
    return {
      status: "not_allowed",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: false,
      reason: getCheckerReason("not_allowed", lotLabel, "Only the 2nd floor is allowed for your permit."),
      matchingRuleText: ["Lot 25: 2nd floor only."],
      leaveByTime,
      floorRestriction: "2nd floor only",
      restrictionSummary: restriction,
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  if (input.lotId === "parking_77" && floor && !["L1", "L2", "F1", "F2"].includes(floor)) {
    return {
      status: "not_allowed",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: false,
      reason: getCheckerReason("not_allowed", lotLabel, "Only levels L1 and L2 are allowed for your permit."),
      matchingRuleText: ["Lot 77: L1 + L2 only."],
      leaveByTime,
      floorRestriction: "L1 + L2 only",
      restrictionSummary: restriction,
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  if (input.lotId === "parking_64") {
    if (input.category === "resident_male" || input.category === "resident_female") {
      return {
        status: "not_allowed",
        lotId: input.lotId,
        floorKey: input.floorKey,
        allowed: false,
        reason: getCheckerReason("not_allowed", lotLabel, "Resident students are prohibited from Lot 64 student-access areas."),
        matchingRuleText: ["Resident students are prohibited from Lot 64 student-access areas."],
        leaveByTime: null,
        floorRestriction: "Resident students blocked",
        restrictionSummary: restriction,
        alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
      };
    }

    if (floor && ["L1", "L2", "F1", "F2"].includes(floor)) {
      return {
        status: "not_allowed",
        lotId: input.lotId,
        floorKey: input.floorKey,
        allowed: false,
        reason: getCheckerReason("not_allowed", lotLabel, "Levels L1 and L2 are faculty/staff only."),
        matchingRuleText: ["Lot 64 L1 and L2 are faculty/staff only."],
        leaveByTime,
        floorRestriction: "L0, L3, and uncovered only",
        restrictionSummary: restriction,
        alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
      };
    }
  }

  if (input.lotId === "student_mall" && (input.durationMinutes ?? 0) > 120) {
    return {
      status: "violation_risk",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: true,
      reason: getCheckerReason("violation_risk", lotLabel, "The 2-hour mall limit has been exceeded."),
      matchingRuleText: ["Student Mall: mall visit only, max 2 hours."],
      leaveByTime: null,
      floorRestriction: null,
      restrictionSummary: restriction,
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  if (commuter && parseTimeToday(input.currentTime).getTime() > buildLeaveByDate(input.currentTime).getTime()) {
    return {
      status: "violation_risk",
      lotId: input.lotId,
      floorKey: input.floorKey,
      allowed: true,
      reason: getCheckerReason("violation_risk", lotLabel, "The 10:00 PM commuter cutoff has passed."),
      matchingRuleText: ["You must leave campus by 10:00 PM."],
      leaveByTime,
      floorRestriction: restriction.shortText,
      restrictionSummary: restriction,
      alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
    };
  }

  const status: PolicyStatus = restriction.badges.length > 0 ? "restricted_access" : "allowed";
  return {
    status,
    lotId: input.lotId,
    floorKey: input.floorKey,
    allowed: true,
    reason: getCheckerReason(status, lotLabel, restriction.shortText ?? (afterHoursEligible ? "After-hours academic access applies." : "No special violation risk is active right now.")),
    matchingRuleText: matchingRules.length ? matchingRules : ["This lot is allowed for your permit."],
    leaveByTime,
    floorRestriction: restriction.shortText,
    restrictionSummary: restriction,
    alternatives: getLegalAlternatives(input.category, input.lotId, input.floorKey, input.preferredBuildingId)
  };
}

export function formatPolicyExplanation(result: CheckerResult) {
  return `${result.reason}${result.leaveByTime ? ` Leave by ${result.leaveByTime}.` : ""}`;
}

export function getScenarioSetForCategory(category: StudentCategory) {
  return QUIZ_SCENARIOS.filter((scenario) => scenario.categories.includes("all") || scenario.categories.includes(category));
}

export function evaluateScenarioAnswer(scenarioId: string, answerId: string) {
  const scenario = QUIZ_SCENARIOS.find((item) => item.id === scenarioId);
  const answer = scenario?.answers.find((item) => item.id === answerId);
  return {
    correct: Boolean(answer?.correct),
    explanation: scenario?.explanation ?? "Scenario not found."
  };
}

export function getTopRiskPolicyNotes() {
  return [
    "Parking 64 has the highest recorded violations and the most confusing level restrictions.",
    "Student Complex Parking is also a high-risk area for permit mismatch and rule misunderstanding.",
    "Parking 11 is a frequent awareness issue because prohibited areas are mistaken for after-hours access.",
    "Complex restrictions, prohibited zones, and permit mismatch are the biggest causes of violations."
  ];
}

export const parkingPolicyGuideTests = [
  {
    name: "non_resident_male + parking_23 + floor_3 => allowed",
    pass: evaluateParkingPolicy({ category: "non_resident_male", lotId: "parking_23", floorKey: "F3", currentTime: "21:00" }).allowed
  },
  {
    name: "non_resident_male + parking_23 + floor_2 => not allowed",
    pass: evaluateParkingPolicy({ category: "non_resident_male", lotId: "parking_23", floorKey: "F2", currentTime: "21:00" }).status === "not_allowed"
  },
  {
    name: "non_resident_female + parking_64 + L3 at 21:00 => allowed + 10 PM timer",
    pass:
      evaluateParkingPolicy({ category: "non_resident_female", lotId: "parking_64", floorKey: "L3", currentTime: "21:00" }).allowed &&
      getCountdownPolicies({ category: "non_resident_female", lotId: "parking_64", floorKey: "L3", currentTime: "21:00" }, "21:00").length > 0
  },
  {
    name: "resident_male + parking_64 + L0 => not allowed",
    pass: evaluateParkingPolicy({ category: "resident_male", lotId: "parking_64", floorKey: "L0", currentTime: "18:00" }).status === "not_allowed"
  },
  {
    name: "resident_male + student_mall parked 130 min => violation risk",
    pass: evaluateParkingPolicy({ category: "resident_male", lotId: "student_mall", currentTime: "18:00", durationMinutes: 130 }).status === "violation_risk"
  },
  {
    name: "resident_female + parking_59 => not allowed",
    pass: evaluateParkingPolicy({ category: "resident_female", lotId: "parking_59", currentTime: "18:00" }).status === "not_allowed"
  },
  {
    name: "non_resident_male + parking_25 + floor_2 at 21:50 => critical countdown",
    pass:
      getCountdownPolicies({ category: "non_resident_male", lotId: "parking_25", floorKey: "F2", currentTime: "21:50" }, "21:50")[0]?.visualState ===
      "critical"
  },
  {
    name: "prohibited lot like parking_11 => prohibited",
    pass: evaluateParkingPolicy({ category: "resident_male", lotId: "parking_11" as ParkingLotId, currentTime: "18:00" }).status === "prohibited"
  },
  {
    name: "legal alternatives return only permitted lots",
    pass: getLegalAlternatives("resident_male", "parking_64", "L0", "building_22").every((item) => getAllowedLotsForCategory("resident_male").includes(item.lotId))
  },
  {
    name: "quiz scoring works and explanations match rules",
    pass: evaluateScenarioAnswer("scenario-1", "b").correct && evaluateScenarioAnswer("scenario-1", "b").explanation.includes("3rd floor only")
  }
];
