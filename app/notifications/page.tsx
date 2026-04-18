"use client";

import { CountdownList } from "@/components/cards/countdown-list";
import { RuleAlertsPanel } from "@/components/cards/rule-alerts-panel";
import { AppShell } from "@/components/layout/app-shell";
import { useParkingSession } from "@/components/providers/parking-session-provider";
import { Card, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  const { activeSession, alertsPageData } = useParkingSession();

  return (
    <AppShell
      title="Rules and Alerts"
      eyebrow="Active Session Alerts"
      description="See every active parking rule, countdown, and violation warning attached to your current parked session."
    >
      {activeSession && alertsPageData ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <RuleAlertsPanel alerts={alertsPageData.alerts} />
          <CountdownList countdowns={alertsPageData.countdowns} />
        </div>
      ) : (
        <Card>
          <CardTitle title="No active alerts right now" subtitle="Alerts begin after you start a parked session from a slot." />
          <p className="text-sm text-slate-600">
            This page will aggregate unauthorized-floor warnings, 10:00 PM commuter countdowns, 2-hour mall timers, lot-specific cautions, and leave-now violation alerts as soon as a session becomes active.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
