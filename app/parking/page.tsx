"use client";

import { LotOccupancyCard } from "@/components/cards/lot-occupancy-card";
import { ParkingMapLegend } from "@/components/cards/parking-map-legend";
import { AppShell } from "@/components/layout/app-shell";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { parkingLots } from "@/lib/data/kfupm-data";
import { SHOW_UNAUTHORIZED_AS_DISABLED, getPermittedLots, toStudentCategory } from "@/lib/engines/rules";

export default function ParkingPage() {
  const { user } = useStudentProfile();
  const visibleLots = getPermittedLots(toStudentCategory(user.userCategory), parkingLots, new Date(), {
    showUnauthorizedAsDisabled: SHOW_UNAUTHORIZED_AS_DISABLED
  });

  return (
    <AppShell
      title="Parking Map and Availability"
      eyebrow="Parking Operations"
      description="See only the parking lots available to your permit, along with floor-specific rules, leave-by warnings, and lot-level restrictions before you choose a space."
    >
      <ParkingMapLegend />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {visibleLots.map((lot) => (
          <LotOccupancyCard key={lot.id} lot={lot} />
        ))}
      </div>
    </AppShell>
  );
}
