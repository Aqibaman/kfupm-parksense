import { Card, CardTitle } from "@/components/ui/card";
import type { LiveMapBusRoute } from "@/lib/types";

export function RouteTimetableCard({ route }: { route: LiveMapBusRoute }) {
  if (!route.schedule.specialTimetable?.length) return null;

  return (
    <Card className="min-w-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <CardTitle title="Route timetable" subtitle="Special departures and return services from the organizer schedule." />
      <div className="space-y-3">
        {route.schedule.specialTimetable.map((item, index) => (
          <div key={`${item.label}-${item.departure}-${index}`} className="min-w-0 rounded-2xl border border-[#dbe9e1] bg-white px-4 py-3">
            <p className="break-words text-sm font-semibold text-[#0f172a]">{item.label}</p>
            <p className="mt-2 text-sm text-slate-600">Departure: {item.departure}</p>
            {item.return ? <p className="text-sm text-slate-600">Return: {item.return}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
