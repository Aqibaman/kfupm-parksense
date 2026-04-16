import { AdminKPIGrid } from "@/components/cards/admin-kpi-grid";
import { AppShell } from "@/components/layout/app-shell";
import { SectionGrid } from "@/components/layout/sections";
import { ChartBars } from "@/components/ui/chart-bars";
import { getAdminSnapshot } from "@/lib/services/query";

export default function AdminPage() {
  const snapshot = getAdminSnapshot();

  return (
    <AppShell
      title="Admin Operations Dashboard"
      eyebrow="Operations"
      description="Monitor lots, slots, sensors, buses, alerts, and violation pressure from one university-grade operations center."
      admin
    >
      <AdminKPIGrid
        items={[
          { label: "Total lots", value: String(snapshot.totals.lots), helper: "Seeded parking and landmark areas." },
          { label: "Total slots", value: String(snapshot.totals.slots), helper: "Schema ready for persistent records." },
          { label: "Sensors online", value: String(snapshot.totals.sensorsOnline), helper: "ESP32 and Raspberry Pi linked nodes." },
          { label: "Buses active", value: String(snapshot.totals.busesActive), helper: "Current moving fleet in mock feed." }
        ]}
      />
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <ChartBars title="Challenge themes" items={snapshot.challengeThemes} tone="bg-sky-500" />
        <ChartBars title="Violation hotspots" items={snapshot.violationHotspots} tone="bg-rose-500" />
      </SectionGrid>
    </AppShell>
  );
}
