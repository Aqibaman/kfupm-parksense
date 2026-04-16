import { SensorStatusPanel } from "@/components/cards/sensor-status-panel";
import { AppShell } from "@/components/layout/app-shell";
import { sensors } from "@/lib/data/kfupm-data";

export default function AdminSensorsPage() {
  return (
    <AppShell
      title="Sensor Management"
      eyebrow="Admin · Sensors"
      description="Track sensor type, mapping, heartbeat, and calibration status before moving from mock ingestion to live devices."
      admin
    >
      <SensorStatusPanel sensors={sensors} />
    </AppShell>
  );
}
