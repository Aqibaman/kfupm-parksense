import { ParkingRuleCard } from "@/components/cards/parking-rule-card";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { parkingRules } from "@/lib/data/kfupm-data";

export default function RulesPage() {
  return (
    <AppShell
      title="Rules and Policies"
      eyebrow="Plain-English Rulebook"
      description="This page translates the parking guide, notices, and Building 64 special policy into readable rules for students and reviewers."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {parkingRules.map((rule) => (
          <ParkingRuleCard key={rule.id} rule={rule} />
        ))}
      </div>
      <Card>
        <CardTitle title="Key policy summary" subtitle="Directly grounded in the shared report." />
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          {[
            "There are 4 user categories: resident male, non-resident male, resident female, and non-resident female.",
            "Non-resident male and female students must leave by 10:00 PM.",
            "Academic parking is generally allowed after 5:00 PM until 7:00 AM except prohibited lots.",
            "Building 64 levels 1 and 2 are faculty and staff only.",
            "Building 64 level 0, level 3, and uncovered 64 are reserved for off-campus students.",
            "Resident students are prohibited from Building 64 student-access areas."
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 p-3">{item}</div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
