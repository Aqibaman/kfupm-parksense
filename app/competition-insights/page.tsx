import { AppShell } from "@/components/layout/app-shell";
import { ChartBars } from "@/components/ui/chart-bars";
import { challengeThemes, violationHotspots } from "@/lib/data/kfupm-data";

export default function CompetitionInsightsPage() {
  return (
    <AppShell
      title="Competition Insights"
      eyebrow="Evidence Base"
      description="This solution is framed around the challenge’s strongest evidence: resident restrictions, long walking distance, overloaded lots, unclear rules, and Building 64 enforcement pressure."
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ChartBars title="Student pain points" items={challengeThemes} tone="bg-fuchsia-500" />
        <ChartBars title="Violation hotspots" items={violationHotspots} tone="bg-rose-500" />
      </div>
    </AppShell>
  );
}
