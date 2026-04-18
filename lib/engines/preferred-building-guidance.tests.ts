import {
  buildSmartGuidanceRecommendationViewModel,
  buildingLocations,
  parkingLocations
} from "@/lib/engines/preferred-building-guidance";

export const preferredBuildingRecommendationTestCases = [
  {
    name: "building_22 + resident_male",
    pass:
      (() => {
        const result = buildSmartGuidanceRecommendationViewModel("resident_male", "building_22", parkingLocations, buildingLocations);
        const allowed = ["dhahran_mosque", "al_zubair_mosque", "student_mall", "medical_center", "parking_60", "parking_71", "parking_72", "parking_73", "parking_74"];
        return (
          result.recommendations.every((item) => allowed.includes(item.lotId)) &&
          result.recommendations.every((item, index, list) => index === 0 || list[index - 1].distanceMeters <= item.distanceMeters)
        );
      })()
  },
  {
    name: "building_22 + non_resident_male",
    pass:
      (() => {
        const result = buildSmartGuidanceRecommendationViewModel("non_resident_male", "building_22", parkingLocations, buildingLocations);
        return ["parking_23", "parking_25", "parking_64", "parking_77"].every((lotId) =>
          result.recommendations.some((item) => item.lotId === lotId && item.restrictionBadges.length > 0)
        );
      })()
  },
  {
    name: "building_22 + resident_female",
    pass:
      (() => {
        const result = buildSmartGuidanceRecommendationViewModel("resident_female", "building_22", parkingLocations, buildingLocations);
        return result.recommendations.every((item) =>
          ["female_student_housing", "family_mall", "medical_center", "parking_60", "parking_73"].includes(item.lotId)
        );
      })()
  },
  {
    name: "building_22 + non_resident_female",
    pass:
      (() => {
        const result = buildSmartGuidanceRecommendationViewModel("non_resident_female", "building_22", parkingLocations, buildingLocations);
        return result.recommendations.some((item) => item.restrictionBadges.includes("Leave by 10:00 PM"));
      })()
  },
  {
    name: "no preferred building selected",
    pass: buildSmartGuidanceRecommendationViewModel("resident_male", null, parkingLocations, buildingLocations).emptyState === "no_building"
  },
  {
    name: "unknown building id",
    pass:
      buildSmartGuidanceRecommendationViewModel("resident_male", "unknown_building" as never, parkingLocations, buildingLocations).emptyState ===
      "unknown_building"
  },
  {
    name: "no active parked session required",
    pass: buildSmartGuidanceRecommendationViewModel("non_resident_male", "building_22", parkingLocations, buildingLocations).recommendations.length > 0
  }
];
