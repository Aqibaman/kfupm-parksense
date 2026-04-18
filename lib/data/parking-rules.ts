import type { StudentCategory } from "@/lib/engines/rules";

export type CanonicalParkingLotId =
  | "parking_19"
  | "parking_20"
  | "parking_23"
  | "parking_25"
  | "parking_39"
  | "parking_57"
  | "parking_59"
  | "parking_60"
  | "parking_64"
  | "parking_71"
  | "parking_72"
  | "parking_73"
  | "parking_74"
  | "parking_77"
  | "parking_400"
  | "medical_center"
  | "dhahran_mosque"
  | "al_zubair_mosque"
  | "student_mall"
  | "female_student_housing"
  | "family_mall";

export interface ParkingRestrictionSummary {
  lotId: CanonicalParkingLotId;
  badges: string[];
  shortText: string | null;
  partiallyRestricted: boolean;
}

export interface CategoryParkingRuleSet {
  allowedLots: CanonicalParkingLotId[];
  commuterCutoff?: "22:00";
  lotRestrictions?: Partial<Record<CanonicalParkingLotId, Omit<ParkingRestrictionSummary, "lotId">>>;
}

// Organizer files are inconsistent: the latitude/longitude spreadsheet uses
// `parking_75` for the same multilevel student lot that rule documents call
// `parking_77`. Keep both ids normalized to canonical `parking_77` until KFUPM confirms.
export const LOT_ID_ALIASES: Record<string, CanonicalParkingLotId> = {
  parking_75: "parking_77",
  parking_404: "parking_400",
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
  "lot-medical": "medical_center",
  "lot-dhahran-mosque": "dhahran_mosque",
  "lot-alzubair": "al_zubair_mosque",
  "lot-mall": "student_mall",
  "lot-female-housing": "female_student_housing",
  "lot-university-square": "family_mall"
};

export const PERMANENTLY_PROHIBITED_LOTS = [
  "parking_5",
  "parking_11",
  "parking_14",
  "parking_21",
  "parking_18_covered",
  "parking_59_covered",
  "parking_68_covered"
] as const;

export const PARKING_RULES_CONFIG: Record<StudentCategory, CategoryParkingRuleSet> = {
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
    lotRestrictions: {
      student_mall: {
        badges: ["2-hour max"],
        shortText: "Mall visit only, with a 2-hour maximum stay.",
        partiallyRestricted: false
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
    commuterCutoff: "22:00",
    lotRestrictions: {
      student_mall: {
        badges: ["2-hour max", "Leave by 10:00 PM"],
        shortText: "Mall visit only, max 2 hours, and commuter cutoff still applies.",
        partiallyRestricted: false
      },
      parking_23: {
        badges: ["3rd floor only", "Leave by 10:00 PM"],
        shortText: "Only the 3rd floor is allowed for this permit.",
        partiallyRestricted: true
      },
      parking_25: {
        badges: ["2nd floor only", "Leave by 10:00 PM"],
        shortText: "Only the 2nd floor is allowed for this permit.",
        partiallyRestricted: true
      },
      parking_77: {
        badges: ["L1 + L2 only", "Leave by 10:00 PM"],
        shortText: "Access is restricted to levels L1 and L2.",
        partiallyRestricted: true
      },
      parking_64: {
        badges: ["Off-campus students only", "L0 + L3 + uncovered", "Leave by 10:00 PM"],
        shortText: "Building 64 is only legal on L0, L3, and uncovered areas for off-campus students.",
        partiallyRestricted: true
      }
    }
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
    commuterCutoff: "22:00",
    lotRestrictions: {
      parking_23: {
        badges: ["3rd floor only", "Leave by 10:00 PM"],
        shortText: "Only the 3rd floor is allowed for this permit.",
        partiallyRestricted: true
      },
      parking_25: {
        badges: ["2nd floor only", "Leave by 10:00 PM"],
        shortText: "Only the 2nd floor is allowed for this permit.",
        partiallyRestricted: true
      },
      parking_77: {
        badges: ["L1 + L2 only", "Leave by 10:00 PM"],
        shortText: "Access is restricted to levels L1 and L2.",
        partiallyRestricted: true
      },
      parking_64: {
        badges: ["Off-campus students only", "L0 + L3 + uncovered", "Leave by 10:00 PM"],
        shortText: "Building 64 is only legal on L0, L3, and uncovered areas for off-campus students.",
        partiallyRestricted: true
      },
      student_mall: {
        badges: ["Leave by 10:00 PM"],
        shortText: "Commuter cutoff applies at 10:00 PM.",
        partiallyRestricted: false
      }
    }
  }
};

