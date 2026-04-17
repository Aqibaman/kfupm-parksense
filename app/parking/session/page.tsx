"use client";

import { ParkingSessionStatusCard } from "@/components/cards/parking-session-status-card";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { busStops, parkingLots } from "@/lib/data/kfupm-data";
import { buildDashboardSnapshot } from "@/lib/services/query";

export default function ParkingSessionPage() {
  const { user } = useStudentProfile();
  const snapshot = buildDashboardSnapshot(user);
  const session = snapshot.sessions[0];

  if (!session) {
    return (
      <AppShell
        title="My Parking Session"
        eyebrow="Active Session"
        description="Track the live session timer, the allowed limit, and push-warning logic whenever the system detects an occupied slot for your car."
      >
        <InfoPanel
          title="No active parking session"
          subtitle="The live timer appears once a slot is occupied."
          items={[
            { label: "Current state", value: "Waiting for a parked vehicle" },
            { label: "Timer behavior", value: "Starts on occupy and stops on release" },
            { label: "Alerts", value: "30-minute and 10-minute warnings are ready" }
          ]}
        />
      </AppShell>
    );
  }

  const lot = parkingLots.find((item) => item.id === session.lotId)!;
  const stop = busStops.find((item) => item.id === session.nearestStopId)!;

  return (
    <AppShell
      title="My Parking Session"
      eyebrow="Active Session"
      description="Track the current slot, live parking duration, push-warning status, nearest bus stop, and the exact time you must leave the space."
    >
      <SectionGrid cols="xl:grid-cols-[1.08fr_0.92fr]">
        <ParkingSessionStatusCard session={session} lot={lot} />
        <InfoPanel
          title="Session details"
          subtitle="Operational context for the active parking record."
          items={[
            { label: "Current lot", value: `${lot.lotCode} - ${lot.lotName}` },
            { label: "Slot", value: session.slotId.split("-").slice(-2).join("-") },
            { label: "Started at", value: session.startedAt.split("T")[1].slice(0, 5) },
            { label: "Leave by", value: session.expectedEndAt.split("T")[1].slice(0, 5) },
            { label: "Nearest stop", value: stop.stopName },
            { label: "Violation risk", value: session.violationRisk }
          ]}
        />
      </SectionGrid>
    </AppShell>
  );
}
