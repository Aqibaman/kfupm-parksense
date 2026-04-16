import { AppShell } from "@/components/layout/app-shell";
import { ChartBars } from "@/components/ui/chart-bars";
import { getAdminSnapshot } from "@/lib/services/query";

export default function AdminAnalyticsPage() {
  const snapshot = getAdminSnapshot();

  return (
    <AppShell
      title="Analytics"
      eyebrow="Admin · Insights"
      description="Utilization trends, violations, and demand patterns help justify practical mobility improvements for the competition and future deployment."
      admin
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartBars title="Monthly violations" items={snapshot.monthlyViolations} tone="bg-rose-500" />
        <ChartBars title="Root causes" items={snapshot.rootCauses} tone="bg-sky-500" />
      </div>
    </AppShell>
  );
}
