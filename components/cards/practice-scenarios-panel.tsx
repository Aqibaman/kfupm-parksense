"use client";

import { useMemo, useState } from "react";
import { ScenarioCard } from "@/components/cards/scenario-card";
import { Card, CardTitle } from "@/components/ui/card";
import { getScenarioSetForCategory } from "@/lib/engines/parking-policy-guide";
import type { StudentCategory } from "@/lib/engines/rules";

export function PracticeScenariosPanel({ category }: { category: StudentCategory }) {
  const scenarios = useMemo(() => getScenarioSetForCategory(category), [category]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const streak = attempts === 0 ? 0 : score;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CardTitle title="Practice Scenarios" subtitle="Learn confusing rules quickly with interactive permit-aware situations." />
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-semibold text-[#007a4d]">Score {score}</span>
          <span className="rounded-full bg-[#e8f0f6] px-3 py-1 text-xs font-semibold text-[#0b5b72]">Streak {streak}</span>
          <span className="rounded-full bg-[#fff4dc] px-3 py-1 text-xs font-semibold text-[#8a6b11]">Rule Aware</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onScore={(correct) => {
              setAttempts((current) => current + 1);
              if (correct) setScore((current) => current + 1);
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setScore(0);
          setAttempts(0);
        }}
        className="mt-4 rounded-full border border-[#dbe9e1] px-4 py-2 text-sm font-semibold text-[#003E51]"
      >
        Retry quiz
      </button>
    </Card>
  );
}
