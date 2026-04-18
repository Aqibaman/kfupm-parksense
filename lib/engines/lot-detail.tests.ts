import { buildFloorSlotGrid, getLotAccessDetails, getLotStructure, lotDetailTests } from "@/lib/engines/lot-detail";

export const lotDetailTestResults = [
  {
    scenario: "resident_male on parking_64",
    expected: "all floors blocked",
    actual: buildFloorSlotGrid("resident_male", "parking_64", "21:00").every((floor) => !floor.allowed)
  },
  {
    scenario: "non_resident_male on parking_64",
    expected: "L0, L3, and uncovered allowed",
    actual: (() => {
      const floors = buildFloorSlotGrid("non_resident_male", "parking_64", "21:00");
      const map = Object.fromEntries(floors.map((floor) => [floor.floor.key, floor.allowed]));
      return map.L0 && map.L3 && map.UNCOVERED && !map.L1 && !map.L2;
    })()
  },
  {
    scenario: "non_resident_female on parking_23",
    expected: "only 3rd floor allowed",
    actual: (() => {
      const floors = buildFloorSlotGrid("non_resident_female", "parking_23", "20:00");
      const map = Object.fromEntries(floors.map((floor) => [floor.floor.key, floor.allowed]));
      return !map.F1 && !map.F2 && map.F3;
    })()
  },
  {
    scenario: "resident_female on parking_73",
    expected: "allowed, no commuter cutoff",
    actual: (() => {
      const details = getLotAccessDetails("resident_female", "parking_73", "18:00");
      return details.allowed && !details.leaveBy;
    })()
  },
  {
    scenario: "non_resident_male on parking_25 at 21:30",
    expected: "2nd floor allowed, leave-by 10:00 PM",
    actual: (() => {
      const floor = buildFloorSlotGrid("non_resident_male", "parking_25", "21:30").find((item) => item.floor.key === "F2");
      return Boolean(floor?.allowed && floor.leaveBy === "10:00 PM");
    })()
  },
  {
    scenario: "non_resident_male on parking_25 at 22:10",
    expected: "violation risk",
    actual: (() => {
      const floor = buildFloorSlotGrid("non_resident_male", "parking_25", "22:10").find((item) => item.floor.key === "F2");
      return Boolean(floor?.violationRisk);
    })()
  },
  {
    scenario: "parking_71 story count",
    expected: "assumed 4 floors",
    actual: (() => {
      const structure = getLotStructure("parking_71");
      return structure.storyCount === 4 && structure.storyCountSource === "assumed";
    })()
  },
  {
    scenario: "parking_68_covered story count",
    expected: "assumed 2 floors",
    actual: (() => {
      const structure = getLotStructure("parking_68_covered");
      return structure.storyCount === 2 && structure.storyCountSource === "assumed";
    })()
  }
] as const;

export function runLotDetailAssertions() {
  const failures = lotDetailTests.filter((test) => !test.run()).map((test) => test.name);

  if (failures.length > 0) {
    throw new Error(`Lot detail assertions failed: ${failures.join(", ")}`);
  }

  return true;
}
