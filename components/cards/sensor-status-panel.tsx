import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { Sensor } from "@/lib/types";

export function SensorStatusPanel({ sensors }: { sensors: Sensor[] }) {
  return (
    <Card>
      <CardTitle title="Sensor Health" subtitle="Live-ready IoT view seeded with ESP32 and Raspberry Pi gateway metadata." />
      <div className="space-y-3">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="rounded-2xl border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{sensor.id}</p>
                <p className="text-sm text-slate-500">{sensor.sensorType} · {sensor.deviceGroup}</p>
              </div>
              <StatPill label="Status" value={sensor.status} tone={sensor.status === "online" ? "green" : sensor.status === "warning" ? "yellow" : "red"} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{sensor.calibrationMeta}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
