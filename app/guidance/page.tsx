"use client";

import { ActiveParkingSessionCard } from "@/components/cards/active-parking-session-card";
import { CountdownList } from "@/components/cards/countdown-list";
import { RuleAlertsPanel } from "@/components/cards/rule-alerts-panel";
import { SmartGuidanceCard } from "@/components/cards/smart-guidance-card";
import { AppShell } from "@/components/layout/app-shell";
import { useParkingSession } from "@/components/providers/parking-session-provider";
import { Card, CardTitle } from "@/components/ui/card";

export default function GuidancePage() {
  const { activeSession, parkingPageData, now } = useParkingSession();

  return (
    <AppShell
      title="Smart Guidance"
      eyebrow="Live Session Guidance"
      description="Follow your current parked session with nearest bus-stop guidance, preferred-building parking insight, and live rule countdowns in one place."
    >
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
          <CardTitle title="No active parked session" subtitle="Start a parked session from a lot detail slot to activate live guidance." />
          <p className="text-sm text-slate-600">
            Once you click “I parked” on a slot, this page will show the nearest bus stop from your parked location, the nearest permitted parking to your preferred building, and all live countdown guidance.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
