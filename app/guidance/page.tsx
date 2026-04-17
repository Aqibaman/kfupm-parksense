"use client";

import { NotificationBellPanel } from "@/components/cards/notification-bell-panel";
import { RecommendationPanel } from "@/components/cards/recommendation-panel";
import { ViolationCountdownCard } from "@/components/cards/violation-countdown-card";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { getNotificationsForUser } from "@/lib/engines/notifications";
import { getPermissionWindow } from "@/lib/engines/rules";
import { buildDashboardSnapshot } from "@/lib/services/query";

export default function GuidancePage() {
  const { user } = useStudentProfile();
  const snapshot = buildDashboardSnapshot(user);
  const userNotifications = getNotificationsForUser(user.id);
  const permissionWindow = getPermissionWindow(user);

  return (
    <AppShell
      title="Smart Guidance"
      eyebrow="Recommendations and Alerts"
      description="Use this page to understand your safest next move: where to park, when to leave, which warnings need attention, and whether the bus is a better option right now."
    >
      <SectionGrid cols="xl:grid-cols-[1.05fr_0.95fr]">
        <RecommendationPanel recommendation={snapshot.recommendation} />
        <ViolationCountdownCard
          title="Violation warning state"
          deadline={permissionWindow.safeUntil}
          helper="This countdown represents the live time window before your current parking permission turns into a rule violation."
          tone={user.residencyStatus === "non-resident" ? "critical" : "safe"}
        />
      </SectionGrid>

      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <NotificationBellPanel notifications={userNotifications} />
        <InfoPanel
          title="How the guidance engine thinks"
          subtitle="The system combines legality, timing, occupancy, and transport options before it advises the student."
          items={[
            { label: "Illegal lots", value: "Hidden from recommendation as primary choices" },
            { label: "Nearly full lots", value: "Down-ranked unless they are still the closest legal option" },
            { label: "Curfew pressure", value: "Raises warning strength for commuter permits nearing 10:00 PM" },
            { label: "Bus usefulness", value: "Raises park-and-ride suggestions when the nearest stop improves the trip" }
          ]}
        />
      </SectionGrid>

      <InfoPanel
        title="What to do next"
        subtitle="A simple action view that blends alerts and recommendations."
        items={[
          { label: "Best immediate action", value: snapshot.recommendation.shouldUseBus ? "Park near the recommended stop and continue by bus" : "Drive directly to the recommended legal lot" },
          { label: "Primary warning", value: userNotifications[0]?.title ?? "No urgent warning at the moment" },
          { label: "Fallback if the lot fills", value: snapshot.recommendation.alternatives[0] ?? "Use the next closest legal lot" },
          { label: "Reason this matters", value: "The page is designed to help students avoid violations before they happen" }
        ]}
      />
    </AppShell>
  );
}
