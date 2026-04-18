import { PARKING_PERMISSION_CONFIG, type StudentCategory } from "@/lib/engines/rules";

export type ParkingLotId =
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

export type BuildingId =
  | "building_22"
  | "building_57"
  | "building_68"
  | "medical_center_building"
  | "student_mall_building";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ParkingLocation {
  id: ParkingLotId;
  name: string;
  coordinates: Coordinate;
  type: "numbered_lot" | "named_location";
  zone?: string;
}

export interface BuildingLocation {
  id: BuildingId;
  name: string;
  coordinates: Coordinate;
}

export interface ParkingRestrictionSummary {
  lotId: ParkingLotId;
  badges: string[];
  shortText: string | null;
}

export interface PreferredBuildingRecommendation {
  lotId: ParkingLotId;
  lotName: string;
  distanceMeters: number;
  distanceLabel: string;
  ranking: number;
  restrictionBadges: string[];
  restrictionText: string | null;
  reason: string;
}

export interface SmartGuidanceRecommendationSection {
  buildingId: BuildingId | null;
  buildingName: string | null;
  category: StudentCategory;
  recommendations: PreferredBuildingRecommendation[];
  emptyState: "no_building" | "unknown_building" | "no_results" | null;
}

const RESTRICTION_CONFIG: Partial<Record<StudentCategory, Partial<Record<ParkingLotId, ParkingRestrictionSummary>>>> = {
  resident_male: {
    student_mall: {
      lotId: "student_mall",
      badges: ["2-hour max"],
      shortText: "Mall visit only, maximum stay is 2 hours."
    }
  },
  non_resident_male: {
    parking_23: {
      lotId: "parking_23",
      badges: ["3rd floor only", "Leave by 10:00 PM"],
      shortText: "Only the 3rd floor is available for this permit."
    },
    parking_25: {
      lotId: "parking_25",
      badges: ["2nd floor only", "Leave by 10:00 PM"],
      shortText: "Only the 2nd floor is available for this permit."
    },
    parking_77: {
      lotId: "parking_77",
      badges: ["L1 + L2 only", "Leave by 10:00 PM"],
      shortText: "Access is limited to levels L1 and L2."
    },
    parking_64: {
      lotId: "parking_64",
      badges: ["Off-campus students only", "L0 + L3 + uncovered", "Leave by 10:00 PM"],
      shortText: "Building 64 is restricted to L0, L3, and uncovered areas for off-campus students."
    },
    student_mall: {
      lotId: "student_mall",
      badges: ["2-hour max", "Leave by 10:00 PM"],
      shortText: "Mall visit only, maximum stay is 2 hours."
    }
  },
  non_resident_female: {
    parking_23: {
      lotId: "parking_23",
      badges: ["3rd floor only", "Leave by 10:00 PM"],
      shortText: "Only the 3rd floor is available for this permit."
    },
    parking_25: {
      lotId: "parking_25",
      badges: ["2nd floor only", "Leave by 10:00 PM"],
      shortText: "Only the 2nd floor is available for this permit."
    },
    parking_77: {
      lotId: "parking_77",
      badges: ["L1 + L2 only", "Leave by 10:00 PM"],
      shortText: "Access is limited to levels L1 and L2."
    },
    parking_64: {
      lotId: "parking_64",
      badges: ["Off-campus students only", "L0 + L3 + uncovered", "Leave by 10:00 PM"],
      shortText: "Building 64 is restricted to L0, L3, and uncovered areas for off-campus students."
    },
    student_mall: {
      lotId: "student_mall",
      badges: ["Leave by 10:00 PM"],
      shortText: "Use only within the commuter leave-by window."
    }
  }
};

export const buildingLocations: BuildingLocation[] = [
  { id: "building_22", name: "Building 22", coordinates: { lat: 26.3047, lng: 50.1478 } },
  { id: "building_57", name: "Building 57", coordinates: { lat: 26.3011, lng: 50.1511 } },
  { id: "building_68", name: "Building 68", coordinates: { lat: 26.3078, lng: 50.1526 } },
  { id: "medical_center_building", name: "Medical Center", coordinates: { lat: 26.2991, lng: 50.1493 } },
  { id: "student_mall_building", name: "Student Mall", coordinates: { lat: 26.2958, lng: 50.1464 } }
];

export const parkingLocations: ParkingLocation[] = [
  { id: "parking_19", name: "Lot 19 Academic East", coordinates: { lat: 26.3041, lng: 50.1461 }, type: "numbered_lot", zone: "Academic Perimeter" },
  { id: "parking_20", name: "Lot 20 Central Academic", coordinates: { lat: 26.3048, lng: 50.1453 }, type: "numbered_lot", zone: "Academic Perimeter" },
  { id: "parking_23", name: "Lot 23 Structured Parking", coordinates: { lat: 26.3076, lng: 50.1491 }, type: "numbered_lot", zone: "Academic Perimeter" },
  { id: "parking_25", name: "Lot 25 Structured Parking", coordinates: { lat: 26.308, lng: 50.1495 }, type: "numbered_lot", zone: "Academic Perimeter" },
  { id: "parking_39", name: "Physical Education Complex", coordinates: { lat: 26.3029, lng: 50.1542 }, type: "numbered_lot", zone: "Sports Complex" },
  { id: "parking_57", name: "Parking 57 Preparatory Year", coordinates: { lat: 26.3004, lng: 50.1506 }, type: "numbered_lot", zone: "Preparatory Year" },
  { id: "parking_59", name: "Lot 59 Covered", coordinates: { lat: 26.3018, lng: 50.1512 }, type: "numbered_lot", zone: "Central Academic" },
  { id: "parking_60", name: "Stadium Parking", coordinates: { lat: 26.2975, lng: 50.1538 }, type: "numbered_lot", zone: "Student Services" },
  { id: "parking_64", name: "Building 64 Multi-Level Parking", coordinates: { lat: 26.3062, lng: 50.1518 }, type: "numbered_lot", zone: "Building 64" },
  { id: "parking_71", name: "Lot 71 Covered", coordinates: { lat: 26.2964, lng: 50.1417 }, type: "numbered_lot", zone: "Housing Edge" },
  { id: "parking_72", name: "Lot 72 Covered", coordinates: { lat: 26.2968, lng: 50.1424 }, type: "numbered_lot", zone: "Housing Edge" },
  { id: "parking_73", name: "Lot 73 Covered", coordinates: { lat: 26.2973, lng: 50.1432 }, type: "numbered_lot", zone: "Housing Edge" },
  { id: "parking_74", name: "Lot 74 Covered", coordinates: { lat: 26.2982, lng: 50.1439 }, type: "numbered_lot", zone: "Housing Edge" },
  { id: "parking_77", name: "Lot 77 Covered", coordinates: { lat: 26.3088, lng: 50.1543 }, type: "numbered_lot", zone: "Academic West" },
  { id: "parking_400", name: "Lot 400 West", coordinates: { lat: 26.2998, lng: 50.1592 }, type: "numbered_lot", zone: "Female Access Corridor" },
  { id: "medical_center", name: "Medical Center Parking", coordinates: { lat: 26.2994, lng: 50.149 }, type: "named_location", zone: "Medical Center" },
  { id: "dhahran_mosque", name: "Dhahran Grand Mosque", coordinates: { lat: 26.2929, lng: 50.1454 }, type: "named_location", zone: "Mosque Area" },
  { id: "al_zubair_mosque", name: "Al-Zubair Mosque", coordinates: { lat: 26.2914, lng: 50.1447 }, type: "named_location", zone: "Mosque Area" },
  { id: "student_mall", name: "Student Mall Parking", coordinates: { lat: 26.2957, lng: 50.1462 }, type: "named_location", zone: "Student Mall" },
  { id: "female_student_housing", name: "Female Student Housing Parking", coordinates: { lat: 26.2942, lng: 50.1603 }, type: "named_location", zone: "Housing Core" },
  { id: "family_mall", name: "Family Mall Parking", coordinates: { lat: 26.2955, lng: 50.1589 }, type: "named_location", zone: "Family Mall" }
];

const buildingNameToId: Record<string, BuildingId> = {
  "Building 22": "building_22",
  "Building 57": "building_57",
  "Building 68": "building_68",
  "Medical Center": "medical_center_building",
  "Student Mall": "student_mall_building"
};

export function getBuildingIdFromLabel(label: string | null | undefined): BuildingId | null {
  if (!label) return null;
  return buildingNameToId[label] ?? null;
}

export function getPermittedParkingForCategory(category: StudentCategory, allParkingLocations: ParkingLocation[]) {
  const profile = PARKING_PERMISSION_CONFIG[category];
  if (!profile) return [];
  return allParkingLocations.filter((lot) => profile.allowedLots.includes(lot.id));
}

export function getDistanceMeters(a: Coordinate, b: Coordinate) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const haversine =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const angle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return Math.round(earthRadius * angle);
}

function formatDistanceLabel(distanceMeters: number) {
  return distanceMeters < 1000 ? `${distanceMeters} m` : `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function getParkingRestrictionSummary(category: StudentCategory, lotId: ParkingLotId): ParkingRestrictionSummary {
  return (
    RESTRICTION_CONFIG[category]?.[lotId] ?? {
      lotId,
      badges: [],
      shortText: null
    }
  );
}

export function rankParkingByDistanceToBuilding(
  category: StudentCategory,
  buildingId: BuildingId,
  candidateParkingLocations: ParkingLocation[],
  buildings: BuildingLocation[]
) {
  const building = buildings.find((item) => item.id === buildingId);
  if (!building) return [];

  return getPermittedParkingForCategory(category, candidateParkingLocations)
    .map((lot) => ({
      lot,
      distanceMeters: getDistanceMeters(building.coordinates, lot.coordinates)
    }))
    .sort((left, right) => left.distanceMeters - right.distanceMeters || left.lot.name.localeCompare(right.lot.name))
    .map(({ lot, distanceMeters }, index): PreferredBuildingRecommendation => {
      const restriction = getParkingRestrictionSummary(category, lot.id);
      return {
        lotId: lot.id,
        lotName: lot.name,
        distanceMeters,
        distanceLabel: formatDistanceLabel(distanceMeters),
        ranking: index + 1,
        restrictionBadges: restriction.badges,
        restrictionText: restriction.shortText,
        reason: index === 0 ? "Closest permitted option" : "Nearby option for your permit"
      };
    });
}

export function getPreferredBuildingParkingRecommendations(
  category: StudentCategory,
  buildingId: BuildingId,
  candidateParkingLocations: ParkingLocation[],
  buildings: BuildingLocation[]
) {
  return rankParkingByDistanceToBuilding(category, buildingId, candidateParkingLocations, buildings);
}

export function buildSmartGuidanceRecommendationViewModel(
  category: StudentCategory,
  buildingId: BuildingId | null,
  candidateParkingLocations: ParkingLocation[],
  buildings: BuildingLocation[]
): SmartGuidanceRecommendationSection {
  if (!buildingId) {
    return {
      buildingId: null,
      buildingName: null,
      category,
      recommendations: [],
      emptyState: "no_building"
    };
  }

  const building = buildings.find((item) => item.id === buildingId);
  if (!building) {
    return {
      buildingId,
      buildingName: null,
      category,
      recommendations: [],
      emptyState: "unknown_building"
    };
  }

  const recommendations = getPreferredBuildingParkingRecommendations(category, buildingId, candidateParkingLocations, buildings);

  return {
    buildingId,
    buildingName: building.name,
    category,
    recommendations,
    emptyState: recommendations.length ? null : "no_results"
  };
}
