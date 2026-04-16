import { parkingLots, parkingSlots, users } from "@/lib/data/kfupm-data";
import { findBestBusOption } from "@/lib/engines/bus";
import { getLotPermission } from "@/lib/engines/rules";
import type { RecommendationResult, User } from "@/lib/types";

export function generateRecommendation({
  user,
  destination,
  expectedDurationHours,
  currentTime = "17:30"
}: {
  user: User;
  destination: string;
  expectedDurationHours: number;
  currentTime?: string;
}): RecommendationResult {
  const rankedLots = parkingLots
    .map((lot) => {
      const permission = getLotPermission(user, lot, currentTime);
      const availableSlots = Math.round(lot.totalSlots * (1 - lot.occupancyRate));
      let score = 0;

      if (!permission.allowed) score -= 1000;
      score += Math.max(availableSlots, 0) / 3;
      score += lot.buildingCluster.toLowerCase().includes(destination.toLowerCase()) ? 35 : 0;
      score += lot.nearestStopIds.length ? 12 : 0;
      score -= lot.occupancyRate > 0.85 ? 30 : lot.occupancyRate > 0.7 ? 14 : 0;
      score -= lot.id === "lot-64" ? 8 : 0;
      score -= expectedDurationHours > 3 && user.residencyStatus === "non-resident" ? 10 : 0;

      return { lot, permission, availableSlots, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = rankedLots[0];

  if (!best || !best.permission.allowed) {
    return {
      recommendedLotId: null,
      recommendedSlotId: null,
      alternatives: [],
      nearestStopId: null,
      suggestedRouteId: null,
      warning: "No legal lot is currently available for the selected category and conditions.",
      score: 0,
      explanation: ["Try switching to a bus-first journey or wait for a legal lot to open up."],
      shouldUseBus: true
    };
  }

  const bestSlot = parkingSlots.find((slot) => slot.lotId === best.lot.id && slot.status === "vacant");
  const networkType = user.gender === "male" ? "male" : "female";
  const busOption = findBestBusOption(best.lot.id, networkType);

  return {
    recommendedLotId: best.lot.id,
    recommendedSlotId: bestSlot?.id ?? null,
    alternatives: rankedLots.slice(1, 4).filter((item) => item.permission.allowed).map((item) => item.lot.id),
    nearestStopId: busOption.stops[0]?.id ?? null,
    suggestedRouteId: busOption.routes[0]?.id ?? null,
    warning: best.lot.id === "lot-64" ? "Building 64 requires level-specific compliance." : null,
    score: best.score,
    explanation: [
      `${best.lot.lotName} is legal for this user category.`,
      `It has approximately ${best.availableSlots} free spaces right now.`,
      busOption.stops[0] ? `Nearest stop: ${busOption.stops[0].stopName}.` : "No nearby bus stop is linked yet.",
      user.residencyStatus === "non-resident" ? "Remember the 10:00 PM commuter limit." : "Resident access is mostly controlled by lot assignment rules."
    ],
    shouldUseBus: best.availableSlots < 20 || destination.toLowerCase().includes("64")
  };
}

export function getDemoRecommendation() {
  return generateRecommendation({
    user: users[1],
    destination: "Building 64",
    expectedDurationHours: 3
  });
}

