import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { sqlSchema } from "@/lib/data/kfupm-data";

export default function ImplementationPage() {
  return (
    <AppShell
      title="Feasibility and Implementation"
      eyebrow="Execution Plan"
      description="This page explains how the product can move from a competition demo to a real campus rollout with minimal architecture changes."
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle title="Implementation roadmap" />
          <div className="space-y-3 text-sm text-slate-600">
            {[
              "Immediate: deploy mock dashboard, validate rules with Security, confirm Building 64 allocations.",
              "Short-term: install pilot sensors in high-friction lots and connect the ingestion endpoint.",
              "Medium-term: integrate live bus location feeds and notifications.",
              "Long-term: connect to Cloudflare Workers, D1 or PostgreSQL, and mobile app delivery."
            ].map((item) => (
              <p key={item} className="rounded-2xl border border-slate-200 p-3">{item}</p>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle title="Persistence schema preview" subtitle="Supabase/PostgreSQL-style SQL that can later move to Cloudflare-friendly storage adapters." />
          <pre className="max-h-[420px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">{sqlSchema}</pre>
        </Card>
      </div>
    </AppShell>
  );
}
