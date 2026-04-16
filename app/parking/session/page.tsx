import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { ViolationCountdownCard } from "@/components/cards/violation-countdown-card";
import { parkingSessions, parkingLots, busStops } from "@/lib/data/kfupm-data";

export default function ParkingSessionPage() {
  const session = parkingSessions[0];
  const lot = parkingLots.find((item) => item.id === session.lotId)!;
  const stop = busStops.find((item) => item.id === session.nearestStopId)!;

  return (
    <AppShell
      title="My Parking Session"
      eyebrow="Active Session"
      description="Track the current slot, safe window, risk state, nearest bus stop, and next action before a violation occurs."
    >
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <ViolationCountdownCard title="Violation risk countdown" deadline={session.expectedEndAt} helper="The UI can escalate to sound alarms, push alerts, and persistent red banners in production." tone="critical" />
        <InfoPanel
          title="Session details"
          items={[
            { label: "Current lot", value: `${lot.lotCode} · ${lot.lotName}` },
            { label: "Slot", value: session.slotId.split("-").slice(-2).join("-") },
            { label: "Started at", value: session.startedAt.split("T")[1].slice(0, 5) },
            { label: "Safe until", value: session.expectedEndAt.split("T")[1].slice(0, 5) },
            { label: "Nearest stop", value: stop.stopName },
            { label: "Violation risk", value: session.violationRisk }
          ]}
        />
      </SectionGrid>
    </AppShell>
  );
}
