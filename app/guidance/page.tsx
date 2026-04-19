"use client";

import { useEffect, useMemo, useState } from "react";
import { ActiveParkingSessionCard } from "@/components/cards/active-parking-session-card";
import { CountdownList } from "@/components/cards/countdown-list";
import { PreferredBuildingParkingRecommendations } from "@/components/cards/preferred-building-parking-recommendations";
import { RuleAlertsPanel } from "@/components/cards/rule-alerts-panel";
import { SmartGuidanceCard } from "@/components/cards/smart-guidance-card";
import { AppShell } from "@/components/layout/app-shell";
import { useParkingSession } from "@/components/providers/parking-session-provider";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { Card, CardTitle } from "@/components/ui/card";
import {
  buildParkedSessionGuidance,
  buildSmartGuidanceRecommendationViewModel,
  buildingLocations,
  getDefaultPreferredBuildingIdFromProfile,
  getBuildingIdFromLabel,
  getSavedPreferredBuildingIdsFromProfile,
  parkingLocations,
  type BuildingId
} from "@/lib/engines/preferred-building-guidance";
import { toStudentCategory } from "@/lib/engines/rules";

export default function GuidancePage() {
  const { activeSession, parkingPageData, now } = useParkingSession();
  const { user, updateUser } = useStudentProfile();
  const category = toStudentCategory(user.userCategory);
  const savedPreferredBuildingIds = getSavedPreferredBuildingIdsFromProfile(user);
  const savedBuildingId = getDefaultPreferredBuildingIdFromProfile(user);
  const [selectedBuildingId, setSelectedBuildingId] = useState<BuildingId | null>(savedBuildingId);
  const selectorBuildings = useMemo(
    () =>
      savedPreferredBuildingIds.length
        ? buildingLocations.filter((building) => savedPreferredBuildingIds.includes(building.id))
        : [],
    [savedPreferredBuildingIds]
  );

  useEffect(() => {
    setSelectedBuildingId(savedBuildingId);
  }, [savedBuildingId]);

  const recommendationSection = useMemo(
    () => buildSmartGuidanceRecommendationViewModel(category, selectedBuildingId, parkingLocations, buildingLocations),
    [category, selectedBuildingId]
  );
  const activeTripGuidance = useMemo(() => {
    if (!activeSession) return null;

    return buildParkedSessionGuidance({
      activeSession: {
        id: activeSession.id,
        userId: activeSession.userId,
        category: activeSession.category,
        lotId: activeSession.lotId,
        canonicalLotId: activeSession.canonicalLotId,
        floorKey: activeSession.floorKey,
        slotId: activeSession.slotId,
        parkedAtIso: activeSession.parkedAt,
        parkedCoordinates: activeSession.parkedCoordinates,
        preferredBuildingId: selectedBuildingId ?? undefined,
        isActive: activeSession.isActive
      },
      category,
      preferredBuildingId: selectedBuildingId ?? undefined,
      parkingLocations,
      academicBuildings: buildingLocations,
      now
    });
  }, [activeSession, category, now, selectedBuildingId]);

  function handleBuildingChange(nextBuildingId: BuildingId | null) {
    setSelectedBuildingId(nextBuildingId);
    const selectedBuilding = buildingLocations.find((building) => building.id === nextBuildingId);
    const remainingFavorites = user.favoriteBuildings.filter((building) => getBuildingIdFromLabel(building) !== savedBuildingId);

    updateUser({
      favoriteBuildings: selectedBuilding ? [selectedBuilding.name, ...remainingFavorites].slice(0, 5) : remainingFavorites.slice(0, 5)
    });
  }

  return (
    <AppShell
      title="Smart Guidance"
      eyebrow="Always-On Recommendation Layer"
      description="See the nearest permitted parking for your preferred building at any time, then follow live bus-stop guidance and rule alerts whenever you start a parked session."
    >
      <PreferredBuildingParkingRecommendations
        buildings={selectorBuildings}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={handleBuildingChange}
        section={recommendationSection}
        category={user.userCategory}
      />

      {activeSession && parkingPageData && activeTripGuidance ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <SmartGuidanceCard
              guidance={{
                nearestBusStop: activeTripGuidance.nearestBusStops[0]
                  ? {
                      id: activeTripGuidance.nearestBusStops[0].id,
                      label: activeTripGuidance.nearestBusStops[0].label,
                      routeId: activeTripGuidance.nearestBusStops[0].routeIds[0] ?? "",
                      routeName: activeTripGuidance.nearestBusStops[0].routeNames[0] ?? "",
                      coordinates: activeTripGuidance.nearestBusStops[0].coordinates,
                      distanceMeters: activeTripGuidance.nearestBusStops[0].distanceMeters,
                      distanceLabel: activeTripGuidance.nearestBusStops[0].distanceLabel
                    }
                  : null,
                nearestBusStops: activeTripGuidance.nearestBusStops.map((stop) => ({
                  id: stop.id,
                  label: stop.label,
                  routeId: stop.routeIds[0] ?? "",
                  routeName: stop.routeNames[0] ?? "",
                  coordinates: stop.coordinates,
                  distanceMeters: stop.distanceMeters,
                  distanceLabel: stop.distanceLabel
                })),
                nearestBusRouteHint: activeTripGuidance.nearestBusRouteHint,
                nearestPermittedParkingToDestination: activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0]
                  ? {
                      id: activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0].lotId,
                      canonicalLotId: activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0].canonicalLotId,
                      name: activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0].lotName,
                      coordinates:
                        parkingLocations.find(
                          (lot) =>
                            lot.canonicalId ===
                            activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0].canonicalLotId
                        )?.coordinates ?? { lat: 0, lng: 0 }
                    }
                  : null,
                walkingRecommended: activeTripGuidance.walkingRecommended,
                summaryLines: [
                  `You parked at ${activeTripGuidance.parkedLotSummary.lotName}.`,
                  activeTripGuidance.nearestBusStops[0]
                    ? `Nearest bus stop from your parked lot: ${activeTripGuidance.nearestBusStops[0].label} (${activeTripGuidance.nearestBusStops[0].distanceLabel}).`
                    : "Bus-stop guidance will appear once a route stop can be matched to your parked lot.",
                  activeTripGuidance.preferredBuildingParkingRecommendations.buildingName &&
                  activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0]
                    ? `For ${activeTripGuidance.preferredBuildingParkingRecommendations.buildingName}, the nearest permitted parking is ${activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0].lotName} (${activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0].distanceLabel}).`
                    : "Add a preferred building in Profile to receive more personalized parking and bus guidance.",
                  activeTripGuidance.walkingRecommended &&
                  activeTripGuidance.preferredBuildingParkingRecommendations.buildingName
                    ? `Walking is likely faster for ${activeTripGuidance.preferredBuildingParkingRecommendations.buildingName} from your current parked position.`
                    : activeTripGuidance.nearestBusRouteHint ?? "The nearest stop guidance is ready once you select a preferred building."
                ]
              }}
            />
            <ActiveParkingSessionCard data={parkingPageData} now={now} />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <CountdownList countdowns={parkingPageData.countdowns} />
            <RuleAlertsPanel alerts={parkingPageData.alerts} compact />
          </div>
          <Card>
            <CardTitle title="Guidance explanation" subtitle="Why the system is recommending this path for the active parked session." />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
                <p className="text-sm text-slate-500">Parked session lot</p>
                <p className="mt-2 text-lg font-semibold text-[#003E51]">{parkingPageData.session.lotId}</p>
              </div>
              <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
                <p className="text-sm text-slate-500">Preferred destination insight</p>
                <p className="mt-2 text-lg font-semibold text-[#003E51]">
                  {activeTripGuidance.preferredBuildingParkingRecommendations.recommendations[0]?.lotName ??
                    "Add a preferred building in Profile for destination-aware guidance"}
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <CardTitle title="No active parked session" subtitle="Your preferred-building parking recommendations stay visible even before you park." />
          <p className="text-sm text-slate-600">
            Use the section above to plan where to park for your destination first. When you later click “I parked” on a slot, this page will add live stop guidance, alerts, and countdowns for that exact parked session below.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
