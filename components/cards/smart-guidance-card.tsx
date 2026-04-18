import Link from "next/link";
import { Footprints, MapPinned } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SmartGuidanceResult } from "@/lib/engines/parking-session";

export function SmartGuidanceCard({ guidance, showLinks = false }: { guidance: SmartGuidanceResult; showLinks?: boolean }) {
  return (
    <Card
      className="text-white"
      style={{
        background:
          "linear-gradient(135deg, #003E51 0%, #0b5a54 58%, color-mix(in srgb, var(--category-primary) 32%, #008540 68%) 100%)"
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8f6e3]">Smart guidance</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Your active trip guidance</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#ddf5e5]">
          {guidance.walkingRecommended ? "Walk first" : "Bus assist"}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-200">
        {guidance.summaryLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
          <div className="flex items-center gap-2 text-[#d8f6e3]">
            <MapPinned className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em]">Nearest bus stop</p>
          </div>
          <p className="mt-2 text-base font-semibold text-white">{guidance.nearestBusStop?.label ?? "Waiting for parking location"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
          <div className="flex items-center gap-2 text-[#d8f6e3]">
            <Footprints className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em]">Nearest permitted parking</p>
          </div>
          <p className="mt-2 text-base font-semibold text-white">
            {guidance.nearestPermittedParkingToDestination?.name ?? "No permitted lot matched yet"}
          </p>
        </div>
      </div>

      {showLinks ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/guidance" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#003E51]">
            Open Smart Guidance
          </Link>
          <Link href="/notifications" className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            Open Alerts
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
