import { Card, CardTitle } from "@/components/ui/card";

const items = [
  { label: "Many slots available", color: "bg-emerald-500" },
  { label: "Limited capacity", color: "bg-amber-500" },
  { label: "Nearly full or full", color: "bg-rose-500" },
  { label: "Unavailable for this user", color: "bg-slate-400" }
];

export function ParkingMapLegend() {
  return (
    <Card>
      <CardTitle title="Parking Map Legend" subtitle="Use the same traffic-style state across parking cards and lot views." />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
            <span className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-sm text-slate-700">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
