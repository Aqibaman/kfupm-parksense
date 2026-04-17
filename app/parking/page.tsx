"use client";

import { LotOccupancyCard } from "@/components/cards/lot-occupancy-card";
import { ParkingMapLegend } from "@/components/cards/parking-map-legend";
import { ParkingSessionStatusCard } from "@/components/cards/parking-session-status-card";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { parkingLots } from "@/lib/data/kfupm-data";
import { getLotPermission, getPermissionWindow } from "@/lib/engines/rules";
import { buildDashboardSnapshot } from "@/lib/services/query";

export default function ParkingPage() {
  const { user } = useStudentProfile();
  const snapshot = buildDashboardSnapshot(user);
  const activeSession = snapshot.sessions[0];
  const activeLot = activeSession ? parkingLots.find((lot) => lot.id === activeSession.lotId) : null;
  const permissionWindow = getPermissionWindow(user);

  return (
    <AppShell
      title="Parking Map and Availability"
      eyebrow="Parking Operations"
      description="View legal lots, current availability, your active parking duration, and the exact time you must leave the space before a violation starts."
    >
      <SectionGrid cols="xl:grid-cols-[1.1fr_0.9fr]">
        {activeSession && activeLot ? (
          <ParkingSessionStatusCard session={activeSession} lot={activeLot} />
        ) : (
          <InfoPanel
            title="Parking timer status"
            subtitle="This card becomes a live timer when a parking session starts."
            items={[
              { label: "Current session", value: "No active parking detected" },
              { label: "Next rule limit", value: permissionWindow.safeUntil.split("T")[1].slice(0, 5) },
              { label: "Push alerts", value: "Ready to warn before the allowed time ends" }
            ]}
          />
        )}
      </SectionGrid>

      <ParkingMapLegend />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {parkingLots.map((lot) => {
          const permission = getLotPermission(user, lot);
          return <LotOccupancyCard key={lot.id} lot={lot} allowed={permission.allowed} />;
        })}
      </div>
    </AppShell>
  );
}
