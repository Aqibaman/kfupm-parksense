import { Card, CardTitle } from "@/components/ui/card";
import { getTopRiskPolicyNotes } from "@/lib/engines/parking-policy-guide";

export function TopRiskLotsCard() {
  const notes = getTopRiskPolicyNotes();

  return (
    <Card>
      <CardTitle title="Top risk lots and reminders" subtitle="Awareness notes based on the most common policy mistakes and violation hotspots." />
      <div className="grid gap-3 md:grid-cols-2">
        {notes.map((note) => (
          <div key={note} className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4 text-sm leading-7 text-slate-600">
            {note}
          </div>
        ))}
      </div>
    </Card>
  );
}
