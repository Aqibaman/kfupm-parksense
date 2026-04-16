import { ParkingRuleCard } from "@/components/cards/parking-rule-card";
import { AppShell } from "@/components/layout/app-shell";
import { parkingRules } from "@/lib/data/kfupm-data";

export default function AdminRulesPage() {
  return (
    <AppShell
      title="Rules Engine"
      eyebrow="Admin · Policy"
      description="The rule layer keeps category permissions, curfews, prohibited lots, and Building 64 level logic editable for non-technical operations staff."
      admin
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {parkingRules.map((rule) => (
          <ParkingRuleCard key={rule.id} rule={rule} />
        ))}
      </div>
    </AppShell>
  );
}
