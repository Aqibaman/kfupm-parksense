import { Card, CardTitle } from "@/components/ui/card";
import type { ActiveBus } from "@/lib/types";

export function ActiveBusesPanel({ buses }: { buses: ActiveBus[] }) {
  return (
    <Card className="min-w-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <CardTitle title="Running buses" subtitle="Current buses visible on the selected route." />
      {buses.length ? (
        <div className="space-y-3">
          {buses.map((bus) => (
            <div key={bus.id} className="min-w-0 rounded-[24px] border border-[#dbe9e1] bg-white p-4 shadow-[0_12px_24px_rgba(0,62,81,0.04)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p className="text-lg font-semibold text-[#0f172a] sm:text-xl">{bus.busNumber}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bus.status === "boarding"
                      ? "bg-[#fff5db] text-[#8a6a14]"
                      : bus.status === "inactive"
                        ? "bg-[#eef3f5] text-[#557072]"
                        : "bg-[#e8f5ee] text-[#0f6c3a]"
                  }`}
                >
                  {bus.status === "boarding" ? "Boarding" : bus.status === "inactive" ? "Not in service" : "Running"}
                </span>
              </div>
              <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                {bus.status === "boarding"
                  ? `Currently waiting at ${bus.currentStopName ?? "the current stop"}`
                  : bus.status === "inactive"
                    ? "This route is currently outside its service window."
                    : `Moving between stations toward ${bus.nextStopName ?? "the next stop"}`}
              </p>
              <p className="mt-2 break-words text-sm text-slate-500">
                {bus.status === "boarding"
                  ? `Boarding at ${bus.currentStopName ?? "the stop"}`
                  : `Next stop: ${bus.nextStopName ?? "Not available"}`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-[#cfe3d8] bg-[#f9fcfa] p-5 text-sm leading-7 text-slate-500">
          No live buses are being shown right now because this route is outside its service window.
        </div>
      )}
    </Card>
  );
}
