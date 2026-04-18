import { AlternativeLotCard } from "@/components/cards/alternative-lot-card";
import { Card, CardTitle } from "@/components/ui/card";
import type { AlternativeSuggestion } from "@/lib/engines/parking-policy-guide";

export function LegalAlternativesPanel({ alternatives }: { alternatives: AlternativeSuggestion[] }) {
  return (
    <Card>
      <CardTitle title="Legal Alternatives" subtitle="Immediate permitted alternatives whenever a lot or floor is restricted." />
      {alternatives.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {alternatives.map((alternative) => (
            <AlternativeLotCard key={`${alternative.lotId}-${alternative.why}`} alternative={alternative} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#dbe9e1] p-4 text-sm text-slate-600">
          Run the checker to see alternative legal parking suggestions for the selected lot and floor.
        </div>
      )}
    </Card>
  );
}
