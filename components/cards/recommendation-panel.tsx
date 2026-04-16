import Link from "next/link";
import { Card, StatPill } from "@/components/ui/card";
import type { RecommendationResult } from "@/lib/types";

export function RecommendationPanel({ recommendation }: { recommendation: RecommendationResult }) {
  return (
    <Card
      className="text-white shadow-[0_20px_70px_rgba(0,133,64,0.16)]"
      style={{
        background:
          "linear-gradient(135deg, #003E51 0%, #0b5a54 58%, color-mix(in srgb, var(--category-primary) 32%, #008540 68%) 100%)"
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">AI Recommendation Engine</h3>
          <p className="mt-1 text-sm text-slate-200">Rule-based recommendation with explainable scoring.</p>
        </div>
        <StatPill label="Mode" value={recommendation.shouldUseBus ? "Bus leaning" : "Park first"} tone="green" />
      </div>
      <div className="space-y-3 text-sm text-slate-200">
        {recommendation.explanation.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {recommendation.warning ? (
        <p
          className="mt-4 rounded-2xl border bg-white/10 p-3 text-sm text-[#ddf5e5]"
          style={{ borderColor: "rgba(255,255,255,0.18)" }}
        >
          {recommendation.warning}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {recommendation.recommendedLotId ? (
          <Link href={`/parking/${recommendation.recommendedLotId}`} className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#003E51]">
            View recommended lot
          </Link>
        ) : null}
        <Link href="/recommendations" className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
          Open full engine
        </Link>
      </div>
    </Card>
  );
}
