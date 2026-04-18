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
  buildSmartGuidanceRecommendationViewModel,
  buildingLocations,
  getBuildingIdFromLabel,
  parkingLocations,
  type BuildingId
} from "@/lib/engines/preferred-building-guidance";
import { toStudentCategory } from "@/lib/engines/rules";

export default function GuidancePage() {
  const { activeSession, parkingPageData, now } = useParkingSession();
  const { user, updateUser } = useStudentProfile();
  const category = toStudentCategory(user.userCategory);
  const savedBuildingId = getBuildingIdFromLabel(user.favoriteBuildings[0]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<BuildingId | null>(savedBuildingId);

  useEffect(() => {
    setSelectedBuildingId(savedBuildingId);
  }, [savedBuildingId]);

  const recommendationSection = useMemo(
    () => buildSmartGuidanceRecommendationViewModel(category, selectedBuildingId, parkingLocations, buildingLocations),
    [category, selectedBuildingId]
  );

  function handleBuildingChange(nextBuildingId: BuildingId | null) {
    setSelectedBuildingId(nextBuildingId);
    const selectedBuilding = buildingLocations.find((building) => building.id === nextBuildingId);
    const remainingFavorites = user.favoriteBuildings.filter((building) => building !== user.favoriteBuildings[0]);

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
        buildings={buildingLocations}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={handleBuildingChange}
        section={recommendationSection}
        category={user.userCategory}
      />

      {activeSession && parkingPageData ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <SmartGuidanceCard guidance={parkingPageData.guidance} />
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
                  {parkingPageData.guidance.nearestPermittedParkingToDestination?.name ?? "No destination-linked lot recommendation yet"}
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
