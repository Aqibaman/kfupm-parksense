import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { parkingLots, parkingSlots } from "@/lib/data/kfupm-data";

export default function SlotViewPage({ params }: { params: { lotId: string } }) {
  const lot = parkingLots.find((item) => item.id === params.lotId);
  if (!lot) return notFound();

  const slots = parkingSlots.filter((slot) => slot.lotId === lot.id);

  return (
    <AppShell
      title={`${lot.lotCode} Slot View`}
      eyebrow="Slot-Level Monitoring"
      description="Detailed slot state, sensor mapping, accessibility markers, and availability reasons are shown at the per-slot level for demos and future live ingestion."
    >
      <Card>
        <CardTitle title="Slots" subtitle="Vacant, occupied, offline, and accessible states are seeded for demo playback." />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {slots.map((slot) => (
            <div key={slot.id} className={`rounded-2xl border p-4 ${slot.status === "vacant" ? "border-emerald-200 bg-emerald-50" : slot.status === "occupied" ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
              <p className="font-semibold text-slate-900">{slot.slotCode}</p>
              <p className="mt-1 text-sm text-slate-500">Level {slot.floorLevel}</p>
              <p className="mt-2 text-sm text-slate-700">Status: {slot.status}</p>
              <p className="text-sm text-slate-700">Sensor: {slot.sensorId}</p>
              <p className="text-sm text-slate-700">Accessible: {slot.isAccessible ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
