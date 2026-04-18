import { parkingLots } from "@/lib/data/kfupm-data";
import { buildDemoDate } from "@/lib/utils";
import type { ParkingLot as BaseParkingLot, User, UserCategory } from "@/lib/types";

export type StudentCategory =
  | "resident_male"
  | "non_resident_male"
  | "resident_female"
  | "non_resident_female";

export interface ParkingLot extends BaseParkingLot {
  canonicalLotId: string;
}

export interface TimeRestriction {
  type: "leave_by" | "duration";
  label: string;
  leaveByTime?: string;
  durationHours?: number;
  warningWindowMinutes?: number[];
}

export interface FloorRestriction {
  allowedAreasOrFloors: string[];
  blockedAreasOrFloors: string[];
  badgeText: string;
}

export interface ParkingRule {
  lotId: string;
  ruleText: string[];
  floorRestriction?: FloorRestriction;
  timeRestriction?: TimeRestriction;
  specialNote?: string;
}

export interface LotAccessDetails {
  allowed: boolean;
  allowedAreasOrFloors: string[];
  blockedAreasOrFloors: string[];
  timeRestrictionText: string | null;
  specialNote: string | null;
}

export interface PermittedParkingLot extends ParkingLot {
  isAllowed: boolean;
  allowedFloors: string[];
  restrictedFloors: string[];
  timeLimit: TimeRestriction | null;
  leaveBy: string | null;
  specialNote: string | null;
  ruleText: string[];
  permitStatusLabel: string;
  violationRisk: boolean;
  disabledReason: string | null;
}

type CategoryPermissionProfile = {
  allowedLots: string[];
  defaultTimeRestriction?: TimeRestriction;
  lotRules?: Record<string, ParkingRule>;
};

export const SHOW_UNAUTHORIZED_AS_DISABLED = false;

const COMMUTER_CUTOFF: TimeRestriction = {
  type: "leave_by",
  label: "Must leave campus by 10:00 PM",
  leaveByTime: "22:00",
  warningWindowMinutes: [60, 30]
};

const LOT_ID_ALIASES: Record<string, string> = {
  "lot-dhahran-mosque": "dhahran_mosque",
  "lot-alzubair": "al_zubair_mosque",
  "lot-mall": "student_mall",
  "lot-medical": "medical_center",
  "lot-60": "parking_60",
  "lot-71": "parking_71",
  "lot-72": "parking_72",
  "lot-73": "parking_73",
  "lot-74": "parking_74",
  "lot-59": "parking_59",
  "lot-64": "parking_64",
  "lot-19": "parking_19",
  "lot-20": "parking_20",
  "lot-23": "parking_23",
  "lot-25": "parking_25",
  "lot-77": "parking_77",
  "lot-39": "parking_39",
  "lot-female-housing": "female_student_housing",
  "lot-400": "parking_400",
  "lot-university-square": "university_square"
};

const CATEGORY_MAP: Record<UserCategory, StudentCategory> = {
  "resident-male": "resident_male",
  "non-resident-male": "non_resident_male",
  "resident-female": "resident_female",
  "non-resident-female": "non_resident_female"
};

export const PARKING_PERMISSION_CONFIG: Record<StudentCategory, CategoryPermissionProfile> = {
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
    ],
    lotRules: {
      student_mall: {
        lotId: "student_mall",
        timeRestriction: {
          type: "duration",
          label: "Mall visit only, max 2 hours",
          durationHours: 2
        },
        specialNote: "Mall visit only, max 2 hours.",
        ruleText: ["Mall visit only, max 2 hours."]
      }
    }
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
    defaultTimeRestriction: COMMUTER_CUTOFF,
    lotRules: {
      student_mall: {
        lotId: "student_mall",
        timeRestriction: {
          type: "duration",
          label: "Mall visit only, max 2 hours",
          durationHours: 2
        },
        specialNote: "Mall visit only, max 2 hours.",
        ruleText: ["Mall visit only, max 2 hours.", "Must leave campus by 10:00 PM."]
      },
      parking_23: {
        lotId: "parking_23",
        floorRestriction: {
          allowedAreasOrFloors: ["3rd floor"],
          blockedAreasOrFloors: ["All other floors"],
          badgeText: "3rd floor only"
        },
        ruleText: ["Allowed only on the 3rd floor.", "Must leave campus by 10:00 PM."]
      },
      parking_25: {
        lotId: "parking_25",
        floorRestriction: {
          allowedAreasOrFloors: ["2nd floor"],
          blockedAreasOrFloors: ["All other floors"],
          badgeText: "2nd floor only"
        },
        ruleText: ["Allowed only on the 2nd floor.", "Must leave campus by 10:00 PM."]
      },
      parking_77: {
        lotId: "parking_77",
        floorRestriction: {
          allowedAreasOrFloors: ["L1", "L2"],
          blockedAreasOrFloors: ["Other levels"],
          badgeText: "L1 and L2 only"
        },
        ruleText: ["Allowed only on levels L1 and L2.", "Must leave campus by 10:00 PM."]
      },
      parking_64: {
        lotId: "parking_64",
        floorRestriction: {
          allowedAreasOrFloors: ["L0", "L3", "Uncovered 64"],
          blockedAreasOrFloors: ["L1", "L2"],
          badgeText: "Restricted access"
        },
        specialNote: "Off-campus students only. Faculty/staff only on L1 and L2.",
        ruleText: [
          "Student allowed only on L0, L3, and uncovered 64.",
          "Faculty/staff only on L1 and L2.",
          "Must leave campus by 10:00 PM."
        ]
      }
    }
  },
  resident_female: {
    allowedLots: ["female_student_housing", "family_mall", "medical_center", "parking_60", "parking_73"],
    lotRules: {
      female_student_housing: {
        lotId: "female_student_housing",
        specialNote: "Use the stricter dedicated notice only.",
        ruleText: ["Use the stricter dedicated notice only."]
      },
      parking_73: {
        lotId: "parking_73",
        specialNote: "Use the stricter dedicated notice only.",
        ruleText: ["Use the stricter dedicated notice only."]
      }
    }
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
    defaultTimeRestriction: COMMUTER_CUTOFF,
    lotRules: {
      parking_23: {
        lotId: "parking_23",
        floorRestriction: {
          allowedAreasOrFloors: ["3rd floor"],
          blockedAreasOrFloors: ["All other floors"],
          badgeText: "3rd floor only"
        },
        ruleText: ["Allowed only on the 3rd floor.", "Must leave campus by 10:00 PM."]
      },
      parking_25: {
        lotId: "parking_25",
        floorRestriction: {
          allowedAreasOrFloors: ["2nd floor"],
          blockedAreasOrFloors: ["All other floors"],
          badgeText: "2nd floor only"
        },
        ruleText: ["Allowed only on the 2nd floor.", "Must leave campus by 10:00 PM."]
      },
      parking_77: {
        lotId: "parking_77",
        floorRestriction: {
          allowedAreasOrFloors: ["L1", "L2"],
          blockedAreasOrFloors: ["Other levels"],
          badgeText: "L1 and L2 only"
        },
        ruleText: ["Allowed only on levels L1 and L2.", "Must leave campus by 10:00 PM."]
      },
      parking_64: {
        lotId: "parking_64",
        floorRestriction: {
          allowedAreasOrFloors: ["L0", "L3", "Uncovered 64"],
          blockedAreasOrFloors: ["L1", "L2"],
          badgeText: "Restricted access"
        },
        specialNote: "Off-campus students only. Faculty/staff only on L1 and L2.",
        ruleText: [
          "Student allowed only on L0, L3, and uncovered 64.",
          "Faculty/staff only on L1 and L2.",
          "Must leave campus by 10:00 PM."
        ]
      }
    }
  }
};

export const parkingPermissionTestCases: Array<{
  category: StudentCategory;
  visibleLots: string[];
  highlightedRules: Array<{ lotId: string; expectation: string }>;
}> = [
  {
    category: "resident_male",
    visibleLots: ["dhahran_mosque", "al_zubair_mosque", "student_mall", "medical_center", "parking_60", "parking_71", "parking_72", "parking_73", "parking_74"],
    highlightedRules: [{ lotId: "student_mall", expectation: "Mall visit only, max 2 hours." }]
  },
  {
    category: "non_resident_male",
    visibleLots: ["parking_59", "parking_60", "medical_center", "parking_64", "parking_19", "parking_20", "student_mall", "parking_71", "parking_72", "parking_73", "parking_74", "parking_23", "parking_25", "parking_77", "parking_39", "dhahran_mosque"],
    highlightedRules: [
      { lotId: "parking_64", expectation: "Only L0, L3, and uncovered 64 are allowed." },
      { lotId: "parking_23", expectation: "3rd floor only." }
    ]
  },
  {
    category: "resident_female",
    visibleLots: ["female_student_housing", "family_mall", "medical_center", "parking_60", "parking_73"],
    highlightedRules: [{ lotId: "female_student_housing", expectation: "Use the stricter dedicated notice only." }]
  },
  {
    category: "non_resident_female",
    visibleLots: ["female_student_housing", "family_mall", "student_mall", "medical_center", "parking_39", "parking_57", "parking_59", "parking_60", "parking_400", "parking_19", "parking_20", "parking_23", "parking_25", "parking_73", "parking_77", "parking_64"],
    highlightedRules: [
      { lotId: "parking_64", expectation: "Faculty/staff only on L1 and L2." },
      { lotId: "parking_25", expectation: "2nd floor only." }
    ]
  }
];

function toDate(currentTime: Date | string) {
  if (currentTime instanceof Date) {
    return currentTime;
  }

  const [hours, minutes] = currentTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function withCanonicalLotId(lot: BaseParkingLot): ParkingLot | null {
  const canonicalLotId = LOT_ID_ALIASES[lot.id];
  if (!canonicalLotId) {
    return null;
  }

  return {
    ...lot,
    canonicalLotId
  };
}

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

function buildLeaveByDate(currentTime: Date | string, leaveByTime: string) {
  const base = toDate(currentTime);
  const [hours, minutes] = leaveByTime.split(":").map(Number);
  const leaveBy = new Date(base);
  leaveBy.setHours(hours, minutes, 0, 0);
  return leaveBy;
}

function getCategoryProfile(category: StudentCategory) {
  return PARKING_PERMISSION_CONFIG[category];
}

function buildTimeRestrictionText(rule: ParkingRule | undefined, defaultRestriction: TimeRestriction | undefined) {
  const labels = [rule?.timeRestriction?.label, defaultRestriction?.label].filter(Boolean) as string[];
  return labels.length ? labels.join(" | ") : null;
}

function buildRuleText(rule: ParkingRule | undefined, defaultRestriction: TimeRestriction | undefined) {
  const combined = [...(rule?.ruleText ?? [])];

  if (defaultRestriction && !combined.includes(defaultRestriction.label)) {
    combined.push(defaultRestriction.label);
  }

  if (rule?.specialNote && !combined.includes(rule.specialNote)) {
    combined.push(rule.specialNote);
  }

  return combined;
}

export function toStudentCategory(userCategory: UserCategory): StudentCategory {
  return CATEGORY_MAP[userCategory];
}

export function getUserCategoryFromProfile(gender: User["gender"], residencyStatus: User["residencyStatus"]): UserCategory {
  if (gender === "male" && residencyStatus === "resident") return "resident-male";
  if (gender === "male" && residencyStatus === "non-resident") return "non-resident-male";
  if (gender === "female" && residencyStatus === "resident") return "resident-female";
  return "non-resident-female";
}

export function getLotAccessDetails(category: StudentCategory, lotId: string, currentTime: Date | string = new Date()): LotAccessDetails {
  const profile = getCategoryProfile(category);
  if (!profile || !profile.allowedLots.includes(lotId)) {
    return {
      allowed: false,
      allowedAreasOrFloors: [],
      blockedAreasOrFloors: [],
      timeRestrictionText: null,
      specialNote: "Not available for your permit."
    };
  }

  const rule = profile.lotRules?.[lotId];
  const defaultRestriction = profile.defaultTimeRestriction;
  const timeRestrictionText = buildTimeRestrictionText(rule, defaultRestriction);

  if (rule?.timeRestriction?.type === "leave_by" && rule.timeRestriction.leaveByTime) {
    buildLeaveByDate(currentTime, rule.timeRestriction.leaveByTime);
  }

  return {
    allowed: true,
    allowedAreasOrFloors: rule?.floorRestriction?.allowedAreasOrFloors ?? [],
    blockedAreasOrFloors: rule?.floorRestriction?.blockedAreasOrFloors ?? [],
    timeRestrictionText,
    specialNote: rule?.specialNote ?? null
  };
}

export function getPermittedLots(
  category: StudentCategory,
  allLots: BaseParkingLot[],
  currentTime: Date | string,
  options?: { showUnauthorizedAsDisabled?: boolean }
) {
  const showUnauthorizedAsDisabled = options?.showUnauthorizedAsDisabled ?? SHOW_UNAUTHORIZED_AS_DISABLED;
  const profile = getCategoryProfile(category);
  const safeProfile = profile ?? { allowedLots: [] };

  return allLots
    .map(withCanonicalLotId)
    .filter((lot): lot is ParkingLot => Boolean(lot))
    .map<PermittedParkingLot>((lot) => {
      const allowed = safeProfile.allowedLots.includes(lot.canonicalLotId);
      const rule = safeProfile.lotRules?.[lot.canonicalLotId];
      const defaultRestriction = safeProfile.defaultTimeRestriction;
      const timeLimit = rule?.timeRestriction ?? defaultRestriction ?? null;
      const commuterLeaveBy = defaultRestriction?.type === "leave_by" && defaultRestriction.leaveByTime ? buildLeaveByDate(currentTime, defaultRestriction.leaveByTime) : null;
      const leaveByDate = commuterLeaveBy ?? (timeLimit?.type === "leave_by" && timeLimit.leaveByTime ? buildLeaveByDate(currentTime, timeLimit.leaveByTime) : null);
      const violationRisk = Boolean(leaveByDate && toDate(currentTime).getTime() > leaveByDate.getTime());
      const ruleText = buildRuleText(rule, defaultRestriction);
      const permitStatusLabel = !allowed
        ? "Not available for your permit"
        : rule?.floorRestriction
          ? "Restricted access"
          : "Allowed for your permit";

      return {
        ...lot,
        isAllowed: allowed,
        allowedFloors: rule?.floorRestriction?.allowedAreasOrFloors ?? [],
        restrictedFloors: rule?.floorRestriction?.blockedAreasOrFloors ?? [],
        timeLimit,
        leaveBy: leaveByDate ? formatClock(leaveByDate) : null,
        specialNote: rule?.specialNote ?? null,
        ruleText,
        permitStatusLabel,
        violationRisk,
        disabledReason: allowed ? null : "Not available for your permit"
      };
    })
    .filter((lot) => lot.isAllowed || showUnauthorizedAsDisabled);
}

export function getLotPermission(user: User, lot: BaseParkingLot, currentTime: Date | string = new Date()) {
  const category = toStudentCategory(user.userCategory);
  const enriched = getPermittedLots(category, [lot], currentTime, { showUnauthorizedAsDisabled: true })[0];

  if (!enriched || !enriched.isAllowed) {
    return {
      allowed: false,
      reasons: [enriched?.disabledReason ?? "Not available for your permit."]
    };
  }

  return {
    allowed: true,
    reasons: enriched.ruleText.length > 0 ? enriched.ruleText : ["Allowed for your permit."]
  };
}

export function getRuleSummaryForUser(user: User) {
  const category = toStudentCategory(user.userCategory);
  const profile = getCategoryProfile(category);

  return (profile?.allowedLots ?? []).map((lotId) => ({
    category,
    lotId,
    notes: buildRuleText(profile?.lotRules?.[lotId], profile?.defaultTimeRestriction)
  }));
}

export function getPermissionWindow(user: User) {
  const category = toStudentCategory(user.userCategory);
  const profile = getCategoryProfile(category);

  if (profile?.defaultTimeRestriction?.type === "leave_by" && profile.defaultTimeRestriction.leaveByTime) {
    return {
      safeUntil: buildDemoDate(profile.defaultTimeRestriction.leaveByTime),
      summary: profile.defaultTimeRestriction.label
    };
  }

  return {
    safeUntil: buildDemoDate("23:59"),
    summary: "Your main restriction is lot assignment or dedicated permit notices."
  };
}

export function getAllowedLotsForUser(user: User) {
  const category = toStudentCategory(user.userCategory);
  return getPermittedLots(category, parkingLots, new Date()).filter((lot) => lot.isAllowed);
}
