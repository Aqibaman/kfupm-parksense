import { parkingLots } from "@/lib/data/kfupm-data";
import { getLotAccessDetails as getPermitLotAccessDetails, type StudentCategory, toStudentCategory } from "@/lib/engines/rules";
import type { ParkingLot as SeedParkingLot, User } from "@/lib/types";

export type StoryCountSource = "official" | "assumed";
export type FloorKey = "L0" | "L1" | "L2" | "L3" | "F1" | "F2" | "F3" | "F4" | "UNCOVERED";

export type ParkingLotId =
  | "parking_1"
  | "parking_5"
  | "parking_11"
  | "parking_14"
  | "parking_15"
  | "parking_18"
  | "parking_19"
  | "parking_20"
  | "parking_23"
  | "parking_25"
  | "parking_27"
  | "parking_28"
  | "parking_39"
  | "parking_42"
  | "parking_48"
  | "parking_54"
  | "parking_57"
  | "parking_58"
  | "parking_59"
  | "parking_60"
  | "parking_63"
  | "parking_64"
  | "parking_68_covered"
  | "parking_68_uncovered"
  | "parking_70"
  | "parking_71"
  | "parking_72"
  | "parking_73"
  | "parking_74"
  | "parking_77"
  | "parking_81"
  | "student_complex"
  | "student_mall"
  | "medical_center"
  | "sports_stadium_back"
  | "faculty_housing_rescom"
  | "emergency_clinic"
  | "grand_mosque"
  | "dhahran_mosque"
  | "al_zubair_mosque"
  | "community_center"
  | "family_mall"
  | "female_student_housing"
  | "faculty_housing_singles"
  | "wadi_dhahran"
  | "parking_400";

export interface TimeRestriction {
  type: "leave_by" | "duration";
  label: string;
  leaveByTime?: string;
  durationHours?: number;
}

export interface FloorDefinition {
  key: FloorKey;
  label: string;
  capacity: number;
  kind: "structured" | "uncovered";
  source: StoryCountSource;
}

export interface FloorAccessRule {
  allowedCategories?: StudentCategory[];
  blockedCategories?: StudentCategory[];
  specialNote?: string;
  roleRestriction?: "faculty_staff_only" | "off_campus_only" | "mall_visit_only";
  timeLimit?: "22:00";
}

export interface ParkingLotMeta {
  id: ParkingLotId;
  name: string;
  totalCapacity: number;
  isCovered: boolean;
  storyCount: number;
  storyCountSource: StoryCountSource;
  floors: FloorDefinition[];
  rules: Record<string, FloorAccessRule>;
  lotNotes?: string[];
}

export interface LotAccessResult extends ParkingLotMeta {
  allowed: boolean;
  allowedAreasOrFloors: string[];
  blockedAreasOrFloors: string[];
  timeRestrictionText: string | null;
  specialNote: string | null;
  primaryRule: string;
  fullRuleText: string[];
  leaveBy: string | null;
  violationRisk: boolean;
}

export interface FloorAccessResult {
  floor: FloorDefinition;
  allowed: boolean;
  accessStatus: "available" | "restricted" | "blocked";
  bannerText: string | null;
  ruleText: string[];
  leaveBy: string | null;
  violationRisk: boolean;
  availableCount: number;
  occupiedCount: number;
  unavailableCount: number;
}

export interface SlotCell {
  id: string;
  label: string;
  status: "vacant" | "occupied" | "unavailable";
  interactive: boolean;
}

export interface FloorSlotGridResult extends FloorAccessResult {
  slots: SlotCell[];
}

type LotSeed = {
  name: string;
  totalCapacity: number;
  isCovered: boolean;
  lotNotes?: string[];
  officialFloors?: FloorKey[];
  coveredCapacity?: number;
  uncoveredCapacity?: number;
};

const CURRENT_APP_LOT_ID_TO_CANONICAL: Record<string, ParkingLotId> = {
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
  "lot-mall": "student_mall",
  "lot-dhahran-mosque": "dhahran_mosque",
  "lot-alzubair": "al_zubair_mosque",
  "lot-female-housing": "female_student_housing",
  "lot-university-square": "family_mall"
};

const PARKING_LOT_STRUCTURE_CONFIG: Record<ParkingLotId, LotSeed> = {
  parking_1: { name: "Parking 1", totalCapacity: 221, isCovered: true },
  parking_5: { name: "Parking 5", totalCapacity: 26, isCovered: false },
  parking_11: { name: "Parking 11", totalCapacity: 150, isCovered: true },
  parking_14: { name: "Parking 14", totalCapacity: 51, isCovered: false },
  parking_15: { name: "Parking 15", totalCapacity: 23, isCovered: false },
  parking_18: { name: "Parking 18", totalCapacity: 384, isCovered: true, lotNotes: ["Assumed 3 floors based on covered capacity."] },
  parking_19: { name: "Lot 19 Academic East", totalCapacity: 328, isCovered: false },
  parking_20: { name: "Lot 20 Central Academic", totalCapacity: 118, isCovered: false },
  parking_23: {
    name: "Lot 23 Structured Parking",
    totalCapacity: 471,
    isCovered: true,
    officialFloors: ["F1", "F2", "F3"],
    lotNotes: ["Official floor fact: at least 3 levels are implied.", "Non-resident students are allowed on the 3rd floor only."]
  },
  parking_25: {
    name: "Lot 25 Structured Parking",
    totalCapacity: 223,
    isCovered: true,
    officialFloors: ["F1", "F2"],
    lotNotes: ["Official floor fact: at least 2 levels are implied.", "Non-resident students are allowed on the 2nd floor only."]
  },
  parking_27: { name: "Parking 27", totalCapacity: 27, isCovered: false },
  parking_28: { name: "Parking 28", totalCapacity: 26, isCovered: false },
  parking_39: { name: "Physical Education Complex", totalCapacity: 75, isCovered: false },
  parking_42: { name: "Parking 42", totalCapacity: 97, isCovered: false },
  parking_48: { name: "Parking 48", totalCapacity: 54, isCovered: false },
  parking_54: { name: "Parking 54", totalCapacity: 172, isCovered: true, lotNotes: ["Assumed 2 floors based on covered capacity."] },
  parking_57: {
    name: "Preparatory Year Classrooms",
    totalCapacity: 230,
    isCovered: false,
    lotNotes: ["Assumption: organizer prompt lists parking_58 at 230, current app uses parking_57 at 230."]
  },
  parking_58: { name: "Parking 58", totalCapacity: 230, isCovered: false },
  parking_59: {
    name: "Lot 59 Covered Parking",
    totalCapacity: 274,
    isCovered: true,
    lotNotes: ["Official organizer data confirms 274 covered spaces and 122 uncovered spaces. Current detail page models the covered structure."]
  },
  parking_60: { name: "Stadium Parking", totalCapacity: 827, isCovered: false },
  parking_63: { name: "Parking 63", totalCapacity: 148, isCovered: true, lotNotes: ["Assumed 2 floors based on covered capacity."] },
  parking_64: {
    name: "Building 64 Multi-Level Parking",
    totalCapacity: 728,
    isCovered: true,
    officialFloors: ["L0", "L1", "L2", "L3", "UNCOVERED"],
    coveredCapacity: 575,
    uncoveredCapacity: 153,
    lotNotes: ["Official floor fact: L0, L1, L2, L3 plus uncovered area.", "Official capacity split: 575 covered + 153 uncovered."]
  },
  parking_68_covered: { name: "Parking 68 Covered", totalCapacity: 134, isCovered: true, lotNotes: ["Assumed 2 floors based on covered capacity."] },
  parking_68_uncovered: { name: "Parking 68 Uncovered", totalCapacity: 52, isCovered: false },
  parking_70: { name: "Parking 70", totalCapacity: 42, isCovered: true, lotNotes: ["Assumed 2 floors based on covered capacity."] },
  parking_71: { name: "Lot 71 Covered", totalCapacity: 1170, isCovered: true, lotNotes: ["Assumed 4 floors based on covered capacity."] },
  parking_72: { name: "Lot 72 Covered", totalCapacity: 1100, isCovered: true, lotNotes: ["Assumed 4 floors based on covered capacity."] },
  parking_73: { name: "Lot 73 Covered", totalCapacity: 1108, isCovered: true, lotNotes: ["Assumed 4 floors based on covered capacity."] },
  parking_74: { name: "Lot 74 Covered", totalCapacity: 1155, isCovered: true, lotNotes: ["Assumed 4 floors based on covered capacity."] },
  parking_77: {
    name: "Lot 77 Covered",
    totalCapacity: 416,
    isCovered: true,
    officialFloors: ["L1", "L2"],
    lotNotes: ["Official floor fact: at least 2 levels are implied.", "Non-resident students are allowed on L1 and L2 only."]
  },
  parking_81: { name: "Parking 81", totalCapacity: 558, isCovered: true, lotNotes: ["Assumed 3 floors based on covered capacity."] },
  student_complex: { name: "Student Complex", totalCapacity: 92, isCovered: false },
  student_mall: { name: "Student Mall", totalCapacity: 92, isCovered: false, lotNotes: ["Mall visit only, max 2 hours."] },
  medical_center: { name: "Medical Center", totalCapacity: 91, isCovered: false },
  sports_stadium_back: { name: "Sports Stadium Back", totalCapacity: 104, isCovered: false },
  faculty_housing_rescom: { name: "Faculty Housing Rescom", totalCapacity: 79, isCovered: false },
  emergency_clinic: { name: "Emergency Clinic", totalCapacity: 6, isCovered: false },
  grand_mosque: { name: "Grand Mosque", totalCapacity: 122, isCovered: false },
  dhahran_mosque: { name: "Dhahran Grand Mosque", totalCapacity: 122, isCovered: false },
  al_zubair_mosque: { name: "Al-Zubair Mosque", totalCapacity: 245, isCovered: false },
  community_center: { name: "Community Center", totalCapacity: 134, isCovered: false },
  family_mall: {
    name: "Family Mall",
    totalCapacity: 134,
    isCovered: false,
    lotNotes: ["Assumption: family_mall is temporarily modeled with the community_center organizer capacity until the organizer publishes a separate family mall count."]
  },
  female_student_housing: {
    name: "Female Student Housing",
    totalCapacity: 180,
    isCovered: false,
    lotNotes: ["Assumption: current seeded app data uses 180 spaces for female student housing because an organizer capacity was not supplied."]
  },
  faculty_housing_singles: { name: "Faculty Housing Singles", totalCapacity: 84, isCovered: false },
  wadi_dhahran: { name: "Wadi Dhahran", totalCapacity: 242, isCovered: false },
  parking_400: {
    name: "Parking 400",
    totalCapacity: 140,
    isCovered: false,
    lotNotes: ["Assumption: current seeded app data uses 140 spaces for parking_400 because an organizer capacity was not supplied."]
  }
};

const FLOOR_RULES: Partial<Record<ParkingLotId, Partial<Record<FloorKey, FloorAccessRule>>>> = {
  parking_23: {
    F1: {
      specialNote: "This floor is not open to student permits.",
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"]
    },
    F2: {
      specialNote: "This floor is not open to student permits.",
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"]
    },
    F3: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      specialNote: "3rd floor only."
    }
  },
  parking_25: {
    F1: {
      specialNote: "This floor is not open to student permits.",
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"]
    },
    F2: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      specialNote: "2nd floor only."
    }
  },
  parking_64: {
    L0: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      roleRestriction: "off_campus_only",
      specialNote: "Off-campus students only."
    },
    L1: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      roleRestriction: "faculty_staff_only",
      specialNote: "Faculty/staff only."
    },
    L2: {
      blockedCategories: ["resident_male", "non_resident_male", "resident_female", "non_resident_female"],
      roleRestriction: "faculty_staff_only",
      specialNote: "Faculty/staff only."
    },
    L3: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      roleRestriction: "off_campus_only",
      specialNote: "Off-campus students only."
    },
    UNCOVERED: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      roleRestriction: "off_campus_only",
      specialNote: "Off-campus students only."
    }
  },
  parking_77: {
    L1: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      specialNote: "L1 and L2 only."
    },
    L2: {
      allowedCategories: ["non_resident_male", "non_resident_female"],
      specialNote: "L1 and L2 only."
    }
  }
};

export const lotDetailTests = [
  {
    name: "resident_male on parking_64 => all floors blocked",
    run: () => {
      const floors = buildFloorSlotGrid("resident_male", "parking_64", "21:00");
      return floors.every((floor) => !floor.allowed);
    }
  },
  {
    name: "non_resident_male on parking_64 => L0, L3, Uncovered allowed; L1/L2 blocked",
    run: () => {
      const results = Object.fromEntries(buildFloorSlotGrid("non_resident_male", "parking_64", "21:00").map((floor) => [floor.floor.key, floor.allowed]));
      return results.L0 && results.L3 && results.UNCOVERED && !results.L1 && !results.L2;
    }
  },
  {
    name: "non_resident_female on parking_23 => only 3rd floor allowed",
    run: () => {
      const results = Object.fromEntries(buildFloorSlotGrid("non_resident_female", "parking_23", "20:00").map((floor) => [floor.floor.key, floor.allowed]));
      return !results.F1 && !results.F2 && results.F3;
    }
  },
  {
    name: "resident_female on parking_73 => allowed, no commuter cutoff",
    run: () => {
      const details = getLotAccessDetails("resident_female", "parking_73", "18:00");
      return details.allowed && !details.leaveBy;
    }
  },
  {
    name: "non_resident_male on parking_25 at 21:30 => allowed on 2nd floor, leave-by 22:00",
    run: () => {
      const floor = getFloorAccessDetails("non_resident_male", "parking_25", "F2", "21:30");
      return floor.allowed && floor.leaveBy === "10:00 PM";
    }
  },
  {
    name: "non_resident_male on parking_25 at 22:10 => violation risk",
    run: () => {
      const floor = getFloorAccessDetails("non_resident_male", "parking_25", "F2", "22:10");
      return floor.violationRisk;
    }
  },
  {
    name: "parking_71 uses assumed 4-floor distribution",
    run: () => {
      const structure = getLotStructure("parking_71");
      return structure.storyCount === 4 && structure.storyCountSource === "assumed";
    }
  },
  {
    name: "parking_68_covered uses assumed 2-floor distribution",
    run: () => {
      const structure = getLotStructure("parking_68_covered");
      return structure.storyCount === 2 && structure.storyCountSource === "assumed";
    }
  }
] as const;

function resolveLotId(lotId: string): ParkingLotId {
  return (CURRENT_APP_LOT_ID_TO_CANONICAL[lotId] ?? lotId) as ParkingLotId;
}

function findSeedLot(lotId: ParkingLotId) {
  const configured = PARKING_LOT_STRUCTURE_CONFIG[lotId];
  if (configured) {
    return configured;
  }

  const appLot = parkingLots.find((lot) => resolveLotId(lot.id) === lotId);
  if (appLot) {
    return {
      name: appLot.lotName,
      totalCapacity: appLot.totalSlots,
      isCovered: appLot.type === "covered",
      lotNotes: ["Assumption: derived from current seeded app data because organizer detail is not yet confirmed."]
    } satisfies LotSeed;
  }

  return {
    name: lotId,
    totalCapacity: 100,
    isCovered: false,
    lotNotes: ["Assumption: fallback lot structure used until organizer data is published."]
  } satisfies LotSeed;
}

function determineAssumedStoryCount(seed: LotSeed) {
  if (!seed.isCovered) return 1;
  if (seed.totalCapacity <= 200) return 2;
  if (seed.totalCapacity <= 600) return 3;
  return 4;
}

function createAssumedFloorKeys(count: number, isCovered: boolean): FloorKey[] {
  if (!isCovered) {
    return ["UNCOVERED"];
  }

  return Array.from({ length: count }, (_, index) => `F${index + 1}` as FloorKey);
}

function formatLeaveBy(time: string | null) {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const meridiem = hours >= 12 ? "PM" : "AM";
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

function buildDate(now: Date | string) {
  if (now instanceof Date) return now;
  const [hours, minutes] = now.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function isAfterCommuterCutoff(now: Date | string, leaveBy: string | null) {
  if (!leaveBy) return false;
  const current = buildDate(now);
  const [hours, minutes] = leaveBy.split(":").map(Number);
  const cutoff = new Date(current);
  cutoff.setHours(hours, minutes, 0, 0);
  return current.getTime() > cutoff.getTime();
}

// Pure helper: distributes remainder from lower floor upward as requested.
export function distributeCapacityAcrossFloors(totalCapacity: number, floorKeys: FloorKey[]) {
  const base = Math.floor(totalCapacity / floorKeys.length);
  const remainder = totalCapacity % floorKeys.length;

  return floorKeys.reduce<Record<FloorKey, number>>((accumulator, key, index) => {
    accumulator[key] = base + (index < remainder ? 1 : 0);
    return accumulator;
  }, {} as Record<FloorKey, number>);
}

// Pure helper: central lot structure builder using official floor facts first, then documented assumptions.
export function getLotStructure(inputLotId: string): ParkingLotMeta {
  const lotId = resolveLotId(inputLotId);
  const seed = findSeedLot(lotId);
  const officialFloors = seed.officialFloors;
  const storyCountSource: StoryCountSource = officialFloors ? "official" : "assumed";
  const storyCount = officialFloors ? officialFloors.filter((floor) => floor !== "UNCOVERED").length : determineAssumedStoryCount(seed);
  const floorKeys = officialFloors ?? createAssumedFloorKeys(storyCount, seed.isCovered);

  let capacitiesByFloor: Record<FloorKey, number>;
  if (lotId === "parking_64") {
    capacitiesByFloor = {
      ...distributeCapacityAcrossFloors(seed.coveredCapacity ?? 575, ["L0", "L1", "L2", "L3"]),
      UNCOVERED: seed.uncoveredCapacity ?? 153
    } as Record<FloorKey, number>;
  } else {
    capacitiesByFloor = distributeCapacityAcrossFloors(seed.totalCapacity, floorKeys);
  }

  const floors: FloorDefinition[] = floorKeys.map((key) => ({
    key,
    label:
      key === "UNCOVERED"
        ? "Uncovered"
        : key === "L0"
          ? "Level 0"
          : key.startsWith("L")
            ? `Level ${key.slice(1)}`
            : `Floor ${key.slice(1)}`,
    capacity: capacitiesByFloor[key],
    kind: key === "UNCOVERED" ? "uncovered" : "structured",
    source: key === "UNCOVERED" && storyCountSource === "official" ? "official" : storyCountSource
  }));

  return {
    id: lotId,
    name: seed.name,
    totalCapacity: seed.totalCapacity,
    isCovered: seed.isCovered,
    storyCount,
    storyCountSource,
    floors,
    rules: FLOOR_RULES[lotId] ?? {},
    lotNotes: seed.lotNotes ?? []
  };
}

function getRoleRestrictionText(rule: FloorAccessRule | undefined) {
  if (!rule?.roleRestriction) return null;
  if (rule.roleRestriction === "faculty_staff_only") return "Faculty/Staff only";
  if (rule.roleRestriction === "off_campus_only") return "Off-campus students only";
  return "Mall visit only";
}

// Pure helper: central lot-level access result for the detail page.
export function getLotAccessDetails(category: StudentCategory, inputLotId: string, now: Date | string): LotAccessResult {
  const structure = getLotStructure(inputLotId);
  const permitDetails = getPermitLotAccessDetails(category, structure.id, now);
  const leaveBy = permitDetails.timeRestrictionText?.includes("10:00 PM") ? "22:00" : null;
  const floorRules = Object.values(structure.rules)
    .map((rule) => rule.specialNote ?? getRoleRestrictionText(rule))
    .filter(Boolean) as string[];
  const fullRuleText = Array.from(
    new Set([
      ...(structure.lotNotes ?? []),
      permitDetails.timeRestrictionText,
      permitDetails.specialNote,
      ...permitDetails.allowedAreasOrFloors.map((floor) => `Allowed areas: ${floor}`),
      ...permitDetails.blockedAreasOrFloors.map((floor) => `Blocked areas: ${floor}`),
      ...floorRules
    ].filter(Boolean) as string[])
  );

  return {
    ...structure,
    allowed: permitDetails.allowed,
    allowedAreasOrFloors: permitDetails.allowedAreasOrFloors,
    blockedAreasOrFloors: permitDetails.blockedAreasOrFloors,
    timeRestrictionText: permitDetails.timeRestrictionText,
    specialNote: permitDetails.specialNote,
    primaryRule: fullRuleText[0] ?? "No special rule recorded.",
    fullRuleText,
    leaveBy: formatLeaveBy(leaveBy),
    violationRisk: isAfterCommuterCutoff(now, leaveBy)
  };
}

// Pure helper: floor-level access result, including blocked/available state and warning text.
export function getFloorAccessDetails(category: StudentCategory, inputLotId: string, floorKey: FloorKey, now: Date | string): FloorAccessResult {
  const lotAccess = getLotAccessDetails(category, inputLotId, now);
  const floor = lotAccess.floors.find((item) => item.key === floorKey) ?? lotAccess.floors[0];
  const rule = lotAccess.rules[floorKey];
  const roleText = getRoleRestrictionText(rule);
  const blockedByRule =
    (rule?.blockedCategories?.includes(category) ?? false) ||
    (rule?.allowedCategories ? !rule.allowedCategories.includes(category) : false) ||
    (rule?.roleRestriction === "off_campus_only" && (category === "resident_male" || category === "resident_female")) ||
    rule?.roleRestriction === "faculty_staff_only";
  const allowed = lotAccess.allowed && !blockedByRule;
  const accessStatus: FloorAccessResult["accessStatus"] = !allowed ? "blocked" : rule ? "restricted" : "available";
  const leaveBy = lotAccess.leaveBy;
  const violationRisk = allowed && lotAccess.violationRisk;
  const bannerText = !allowed
    ? "Not available for your permit"
    : violationRisk
      ? "Leave now to avoid violation"
      : roleText ?? rule?.specialNote ?? null;

  return {
    floor,
    allowed,
    accessStatus,
    bannerText,
    ruleText: Array.from(new Set([rule?.specialNote, roleText, lotAccess.timeRestrictionText].filter(Boolean) as string[])),
    leaveBy,
    violationRisk,
    availableCount: 0,
    occupiedCount: 0,
    unavailableCount: 0
  };
}

// Pure helper: keep all floor tabs visible so blocked floors are still clearly shown to the student.
export function getVisibleFloorsForLot(category: StudentCategory, inputLotId: string) {
  const lot = getLotStructure(inputLotId);
  return lot.floors.map((floor) => getFloorAccessDetails(category, inputLotId, floor.key, new Date()));
}

// Pure helper: build slot cells for each floor with deterministic occupancy, while blocked floors become entirely unavailable.
export function buildFloorSlotGrid(category: StudentCategory, inputLotId: string, now: Date | string, occupancySeed = 11): FloorSlotGridResult[] {
  const lot = getLotStructure(inputLotId);

  return lot.floors.map((floor) => {
    const floorAccess = getFloorAccessDetails(category, inputLotId, floor.key, now);
    const slots: SlotCell[] = Array.from({ length: floor.capacity }, (_, index) => {
      const label = String(index + 1).padStart(2, "0");

      if (!floorAccess.allowed) {
        return {
          id: `${lot.id}-${floor.key}-${label}`,
          label,
          status: "unavailable",
          interactive: false
        };
      }

      const score = (index + 1) * occupancySeed + floor.key.length * 13 + lot.id.length * 7;
      const status = score % 19 === 0 ? "unavailable" : score % 5 === 0 || score % 7 === 0 ? "occupied" : "vacant";

      return {
        id: `${lot.id}-${floor.key}-${label}`,
        label,
        status,
        interactive: status !== "unavailable"
      };
    });

    return {
      ...floorAccess,
      slots,
      availableCount: slots.filter((slot) => slot.status === "vacant").length,
      occupiedCount: slots.filter((slot) => slot.status === "occupied").length,
      unavailableCount: slots.filter((slot) => slot.status === "unavailable").length
    };
  });
}

export function getLotStructureForUser(user: User, inputLotId: string, now: Date | string = new Date()) {
  const category = toStudentCategory(user.userCategory);
  return {
    lotAccess: getLotAccessDetails(category, inputLotId, now),
    floorAccess: buildFloorSlotGrid(category, inputLotId, now)
  };
}

export function getSeedLotForDetail(inputLotId: string): SeedParkingLot | undefined {
  return parkingLots.find((lot) => resolveLotId(lot.id) === resolveLotId(inputLotId));
}
