import { PolicyRuleChips } from "@/components/cards/policy-rule-chips";
import { Card } from "@/components/ui/card";
import type { CheckerResult } from "@/lib/engines/parking-policy-guide";

const toneMap = {
  allowed: "bg-[#e8f5ee] text-[#0f6c3a]",
  restricted_access: "bg-amber-100 text-amber-700",
  violation_risk: "bg-rose-100 text-rose-700",
  not_allowed: "bg-slate-200 text-slate-700",
  prohibited: "bg-[#111827] text-white"
} as const;

export function CheckerResultCard({ result }: { result: CheckerResult | null }) {
  if (!result) {
    return (
      <Card className="border-dashed">
        <p className="text-sm text-slate-600">Run the checker to see whether a lot is allowed, restricted, or creating a violation risk.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5b72]">Checker result</p>
          <h4 className="mt-2 text-xl font-semibold text-[#0f172a]">{result.reason}</h4>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneMap[result.status]}`}>{result.status.replaceAll("_", " ")}</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
          <p className="text-sm text-slate-500">Matching rule text</p>
          <div className="mt-2 space-y-2">
            {result.matchingRuleText.map((item) => (
              <p key={item} className="text-sm leading-7 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
          <p className="text-sm text-slate-500">Rule highlights</p>
          <PolicyRuleChips chips={result.restrictionSummary.badges} />
          {result.leaveByTime ? <p className="mt-3 text-sm font-semibold text-[#003E51]">Leave by: {result.leaveByTime}</p> : null}
          {result.floorRestriction ? <p className="mt-3 text-sm text-slate-600">{result.floorRestriction}</p> : null}
        </div>
      </div>
    </Card>
  );
}
