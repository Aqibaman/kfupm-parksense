import { Card, CardTitle } from "@/components/ui/card";
import type { ParkingRule } from "@/lib/types";

export function ParkingRuleCard({ rule }: { rule: ParkingRule }) {
  return (
    <Card className="h-full">
      <CardTitle title={rule.levelRule} subtitle={rule.notes} />
      <div className="space-y-2 text-sm text-slate-600">
        <p><span className="font-semibold text-slate-900">Window:</span> {rule.allowedFrom} to {rule.allowedUntil}</p>
        <p><span className="font-semibold text-slate-900">Restriction:</span> {rule.specialRestriction}</p>
      </div>
    </Card>
  );
}
