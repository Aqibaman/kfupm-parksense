import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { ParkingPageData } from "@/lib/engines/parking-session";

export function ParkingPageSessionBanner({ data }: { data: ParkingPageData }) {
  return (
    <Card
      className="text-white"
      style={{
        background:
          "linear-gradient(135deg, #0b4362 0%, #0a5e59 54%, color-mix(in srgb, var(--category-primary) 24%, #008540 76%) 100%)"
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.30em] text-[#d8f6e3]">Parked session is active</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Slot {data.session.slotId} is being monitored with live rules, countdowns, and guidance.
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/84">
            Alerts will stay synchronized across the parking page, Smart Guidance, and Alerts page until you click “I left”.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/guidance" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#003E51]">
            Open Smart Guidance
          </Link>
          <Link href="/notifications" className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            Open Alerts
          </Link>
        </div>
      </div>
    </Card>
  );
}
