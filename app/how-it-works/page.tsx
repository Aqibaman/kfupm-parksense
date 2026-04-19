import { AppShell } from "@/components/layout/app-shell";
import { ChartBars } from "@/components/ui/chart-bars";
import { Card, CardTitle } from "@/components/ui/card";
import { systemPipeline } from "@/lib/constants";
import { rootCauses } from "@/lib/data/kfupm-data";

export default function HowItWorksPage() {
  return (
    <AppShell
      title="How It Works"
      eyebrow="Product Story"
      description="ParkWise combines parking policy, slot sensing, bus routing, and pre-violation alerts into one campus mobility workflow."
    >
      <Card>
        <CardTitle title="End-to-end journey" />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {systemPipeline.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Step {index + 1}</p>
              <p className="mt-2 font-semibold text-slate-900">{step}</p>
            </div>
          ))}
        </div>
      </Card>
      <ChartBars title="Root causes addressed by the product" subtitle="The solution is shaped around the challenge evidence, not only the interface." items={rootCauses} tone="bg-sky-500" />
    </AppShell>
  );
}
