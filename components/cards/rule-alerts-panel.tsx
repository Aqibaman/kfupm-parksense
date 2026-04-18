import { BellRing } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ActiveAlert } from "@/lib/engines/parking-session";

export function RuleAlertsPanel({ alerts, compact = false }: { alerts: ActiveAlert[]; compact?: boolean }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <BellRing className="h-5 w-5 text-[#0b5b72]" />
        <h3 className="text-lg font-semibold text-slate-950">{compact ? "Active alerts" : "Rules and alerts"}</h3>
      </div>
      <div className="space-y-3">
        {alerts.length ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border px-4 py-3 ${
                alert.severity === "critical"
                  ? "border-rose-200 bg-rose-50"
                  : alert.severity === "warning"
                    ? "border-amber-200 bg-amber-50"
                    : "border-[#dbe9e1] bg-[#f9fcfa]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#003E51]">{alert.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                    alert.severity === "critical"
                      ? "bg-rose-100 text-rose-700"
                      : alert.severity === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-[#edf7f2] text-[#007a4d]"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dbe9e1] bg-[#fbfdfc] px-4 py-6 text-sm text-slate-500">
            No active alerts are attached to the current parked session.
          </div>
        )}
      </div>
    </Card>
  );
}
