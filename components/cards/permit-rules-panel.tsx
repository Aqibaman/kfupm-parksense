"use client";

import { useState } from "react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { PolicyRuleChips } from "@/components/cards/policy-rule-chips";
import { Card, CardTitle } from "@/components/ui/card";
import type { PolicyRuleSet } from "@/lib/engines/parking-policy-guide";
import type { UserCategory } from "@/lib/types";

export function PermitRulesPanel({ summary, category }: { summary: PolicyRuleSet; category: UserCategory }) {
  const [expanded, setExpanded] = useState(false);
  const visibleRules = expanded ? summary.rules : summary.rules.slice(0, 5);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CardTitle title="My Permit Rules" subtitle="Your category-specific parking permissions, restrictions, and reminders." />
        <CategoryBadge category={category} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-[#dbe9e1] bg-[#f8fbf9] p-4">
          <p className="text-sm leading-7 text-slate-600">{summary.summary}</p>
          <PolicyRuleChips chips={[...summary.timedRestrictions, ...summary.floorRestrictions].slice(0, 6)} />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {summary.allowedLots.map((lot) => (
              <div key={lot} className="rounded-2xl border border-white bg-white px-3 py-2 text-sm text-[#003E51]">
                {lot.replaceAll("_", " ")}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5b72]">Active rules</p>
          <div className="mt-3 space-y-3">
            {visibleRules.map((rule) => (
              <div key={rule.id} className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-3">
                <p className="text-sm font-semibold text-[#0f172a]">{rule.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{rule.text}</p>
                <PolicyRuleChips chips={rule.badges ?? []} />
              </div>
            ))}
          </div>
          {summary.rules.length > 5 ? (
            <button type="button" onClick={() => setExpanded((current) => !current)} className="mt-4 text-sm font-semibold text-[#007a4d]">
              {expanded ? "Show fewer rules" : "Show all rules"}
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
