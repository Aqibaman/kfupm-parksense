import Link from "next/link";
import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { RecommendationResult } from "@/lib/types";

export function RecommendationPanel({ recommendation }: { recommendation: RecommendationResult }) {
  return (
    <Card className="bg-[linear-gradient(135deg,#082f49_0%,#0f172a_55%,#312e81_100%)] text-white">
      <div className="flex items-start justify-between gap-4">
        <CardTitle title="AI Recommendation Engine" subtitle="Rule-based recommendation with explainable scoring." />
        <StatPill label="Mode" value={recommendation.shouldUseBus ? "Bus leaning" : "Park first"} tone="blue" />
      </div>
      <div className="space-y-3 text-sm text-slate-200">
        {recommendation.explanation.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {recommendation.warning ? <p className="mt-4 rounded-2xl border border-sky-400/30 bg-white/10 p-3 text-sm text-sky-100">{recommendation.warning}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {recommendation.recommendedLotId ? (
          <Link href={`/parking/${recommendation.recommendedLotId}`} className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
            View recommended lot
          </Link>
        ) : null}
        <Link href="/recommendations" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white">
          Open full engine
        </Link>
      </div>
    </Card>
  );
}
