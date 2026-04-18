"use client";

import { useState } from "react";
import { PolicyRuleChips } from "@/components/cards/policy-rule-chips";
import { evaluateScenarioAnswer, type QuizScenario } from "@/lib/engines/parking-policy-guide";

export function ScenarioCard({
  scenario,
  onScore
}: {
  scenario: QuizScenario;
  onScore: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const result = selected ? evaluateScenarioAnswer(scenario.id, selected) : null;

  return (
    <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4 shadow-[0_12px_30px_rgba(0,62,81,0.05)]">
      <p className="text-sm font-semibold leading-7 text-[#0f172a]">{scenario.prompt}</p>
      <div className="mt-4 space-y-2">
        {scenario.answers.map((answer) => (
          <button
            key={answer.id}
            type="button"
            disabled={Boolean(selected)}
            onClick={() => {
              setSelected(answer.id);
              onScore(answer.correct);
            }}
            className="w-full rounded-2xl border border-[#dbe9e1] px-4 py-3 text-left text-sm text-[#003E51] transition hover:border-[#8ac4a1]"
          >
            {answer.label}
          </button>
        ))}
      </div>
      {result ? (
        <div className="mt-4 rounded-2xl bg-[#f8fbf9] p-3">
          <PolicyRuleChips chips={[result.correct ? "Correct" : "Try again"]} />
          <p className="mt-2 text-sm leading-7 text-slate-600">{result.explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
