import { NotificationBellPanel } from "@/components/cards/notification-bell-panel";
import { RecommendationPanel } from "@/components/cards/recommendation-panel";
import { ViolationCountdownCard } from "@/components/cards/violation-countdown-card";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, MetricCard, SectionGrid } from "@/components/layout/sections";
import { parkingLots } from "@/lib/data/kfupm-data";
import { getPermissionWindow } from "@/lib/engines/rules";
import { getDashboardSnapshot } from "@/lib/services/query";

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();
  const permissionWindow = getPermissionWindow(snapshot.user);
  const allowedLots = snapshot.allowedLots.slice(0, 4);

  return (
    <AppShell
      title="Student Mobility Dashboard"
      eyebrow="Student Experience"
      description="Today’s permit summary, lot access, session safety window, nearby buses, and AI guidance are surfaced in one responsive control center."
    >
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge category={snapshot.user.userCategory} />
        <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">Preferred buildings: {snapshot.user.favoriteBuildings.join(", ")}</span>
      </div>
      <SectionGrid cols="md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Allowed lots now" value={String(snapshot.allowedLots.length)} helper="Filtered by your user category and special lot rules." />
        <MetricCard label="Current commuter rule" value={snapshot.user.residencyStatus === "non-resident" ? "10:00 PM" : "Category-based"} helper={permissionWindow.summary} />
        <MetricCard label="Nearby bus routes" value={String(snapshot.routes.filter((route) => route.networkType === snapshot.user.gender).length)} helper="Matched to male or female transport network." />
        <MetricCard label="Active notifications" value={String(snapshot.notifications.filter((notification) => !notification.readAt).length)} helper="Unread alerts needing action." />
      </SectionGrid>
      <SectionGrid cols="xl:grid-cols-[1.1fr_0.9fr]">
        <ViolationCountdownCard title="Quick violation timer" deadline={permissionWindow.safeUntil} helper="Red alert support can escalate to push, sound, and flashing warning states." tone={snapshot.user.residencyStatus === "non-resident" ? "critical" : "safe"} />
        <RecommendationPanel recommendation={snapshot.recommendation} />
      </SectionGrid>
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <InfoPanel
          title="Nearby allowed lots"
          subtitle="Best-fit options for the selected demo user."
          items={allowedLots.map((lot) => ({
            label: `${lot.lotCode} · ${lot.lotName}`,
            value: `${Math.round(lot.totalSlots * (1 - lot.occupancyRate))} free`
          }))}
        />
        <NotificationBellPanel notifications={snapshot.notifications} />
      </SectionGrid>
      <InfoPanel
        title="Today's permission summary"
        subtitle="Operational guidance driven by the report logic."
        items={[
          { label: "Safe until", value: permissionWindow.safeUntil.split("T")[1].slice(0, 5) },
          { label: "Building 64", value: snapshot.user.residencyStatus === "non-resident" ? "Allowed only on L0, L3, uncovered" : "Not allowed" },
          { label: "After-hours academic access", value: "5:00 PM to 7:00 AM except prohibited lots" },
          { label: "Most constrained lots", value: parkingLots.filter((lot) => lot.occupancyRate > 0.85).map((lot) => lot.lotCode).join(", ") }
        ]}
      />
    </AppShell>
  );
}
