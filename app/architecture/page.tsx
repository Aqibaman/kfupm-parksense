import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { hardwareInventory, systemPipeline } from "@/lib/constants";

export default function ArchitecturePage() {
  return (
    <AppShell
      title="System Architecture"
      eyebrow="Technical Overview"
      description="The app is prepared for slot sensors, edge collection, cloud sync, and Cloudflare-compatible APIs while still running entirely on mock data today."
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle title="Pipeline" />
          <div className="space-y-3">
            {systemPipeline.map((step) => (
              <div key={step} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-700">{step}</div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle title="Hardware inventory" />
          <div className="space-y-3">
            {hardwareInventory.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-700">{item}</div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
