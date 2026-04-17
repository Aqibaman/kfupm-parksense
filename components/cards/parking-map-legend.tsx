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
      <div className="grid gap-3 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-[24px] border border-[#dbe9e1] bg-[#f8fbf9] px-5 py-4">
            <span className={`h-4 w-4 rounded-full ${item.color}`} />
            <span className="text-base font-medium text-slate-700">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
