import { NotificationBellPanel } from "@/components/cards/notification-bell-panel";
import { ViolationCountdownCard } from "@/components/cards/violation-countdown-card";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { notifications } from "@/lib/data/kfupm-data";

export default function NotificationsPage() {
  return (
    <AppShell
      title="Notification Center"
      eyebrow="Alerts and Compliance"
      description="The platform warns before parking violations happen, highlights route changes, and supports future browser sound alarms and push delivery."
    >
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <NotificationBellPanel notifications={notifications.filter((item) => item.userId === "user-nrm-01")} />
        <ViolationCountdownCard title="30-minute warning state" deadline="2026-04-16T21:55:00+06:00" helper="This mock card represents the strong warning state before a commuter curfew violation." tone="critical" />
      </SectionGrid>
      <InfoPanel
        title="Notification logic represented in this demo"
        items={[
          { label: "30-minute violation warning", value: "Supported" },
          { label: "10-minute urgent alert", value: "Supported" },
          { label: "Bus arrival alerts", value: "Supported" },
          { label: "Special lot notes", value: "Supported" },
          { label: "Sound alarm toggle", value: "Profile setting included" }
        ]}
      />
    </AppShell>
  );
}
