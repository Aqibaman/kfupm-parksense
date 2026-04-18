import {
  buildPreferredBuildingParkingRecommendations,
  buildSmartGuidanceRecommendationViewModel,
  buildParkedSessionGuidance,
  buildingLocations,
  normalizeLotId,
  parkingLocations
} from "@/lib/engines/preferred-building-guidance";

export const preferredBuildingRecommendationTestCases = [
  {
    name: "building_22 + non_resident_male returns only permitted lots ranked nearest to furthest with 23/25/64/77 badges",
    pass: (() => {
      const result = buildPreferredBuildingParkingRecommendations({
        category: "non_resident_male",
        selectedPreferredBuildingId: "building_22",
        parkingLocations,
        academicBuildings: buildingLocations
      });

      const ids = result.recommendations.map((item) => item.canonicalLotId);
      const ranked = result.recommendations.every((item, index, list) => index === 0 || list[index - 1].distanceMeters <= item.distanceMeters);
      const hasSpecials = ["parking_23", "parking_25", "parking_64", "parking_77"].every((lotId) =>
        result.recommendations.some((item) => item.canonicalLotId === lotId && item.restrictionBadges.length > 0)
      );

      return ranked && hasSpecials && !ids.some((id) => ["parking_5", "parking_11"].includes(id));
    })()
  },
  {
    name: "building_22 + resident_male excludes 19/20/23/25/39/64",
    pass: (() => {
      const result = buildPreferredBuildingParkingRecommendations({
        category: "resident_male",
        selectedPreferredBuildingId: "building_22",
        parkingLocations,
        academicBuildings: buildingLocations
      });
      return !result.recommendations.some((item) => ["parking_19", "parking_20", "parking_23", "parking_25", "parking_39", "parking_64"].includes(item.canonicalLotId));
    })()
  },
  {
    name: "building_22 + resident_female returns only female resident allowed set",
    pass: (() => {
      const result = buildPreferredBuildingParkingRecommendations({
        category: "resident_female",
        selectedPreferredBuildingId: "building_22",
        parkingLocations,
        academicBuildings: buildingLocations
      });
      return result.recommendations.every((item) =>
        ["female_student_housing", "family_mall", "medical_center", "parking_60", "parking_73"].includes(item.canonicalLotId)
      );
    })()
  },
  {
    name: "missing preferred building id returns empty state safely",
    pass: buildSmartGuidanceRecommendationViewModel("resident_male", null, parkingLocations, buildingLocations).emptyState === "no_building"
  },
  {
    name: "alias handling normalizes parking_75 to parking_77",
    pass: normalizeLotId("parking_75") === "parking_77"
  },
  {
    name: "no active parked session still renders preferred-building recommendations",
    pass: buildSmartGuidanceRecommendationViewModel("non_resident_female", "building_22", parkingLocations, buildingLocations).recommendations.length > 0
  },
  {
    name: "active parked session guidance returns nearest stops and blocked alert for parking_64 L2 female commuter",
    pass: (() => {
      const result = buildParkedSessionGuidance({
        activeSession: {
          id: "s1",
          userId: "u1",
          category: "non_resident_female",
          lotId: "lot-64",
          canonicalLotId: "parking_64",
          floorKey: "L2",
          slotId: "64-L2-01",
          parkedAtIso: new Date("2026-04-19T21:00:00").toISOString(),
          parkedCoordinates: { lat: 26.3112126, lng: 50.137706 },
          preferredBuildingId: "building_22",
          isActive: true
        },
        category: "non_resident_female",
        preferredBuildingId: "building_22",
        parkingLocations,
        academicBuildings: buildingLocations,
        now: new Date("2026-04-19T21:00:00")
      });

      return Boolean(result.nearestBusStops.length) && result.ruleAlerts.some((alert) => alert.message.includes("faculty and staff"));
    })()
  }
] as const;

