"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { CountdownList } from "@/components/cards/countdown-list";
import { RuleAlertsPanel } from "@/components/cards/rule-alerts-panel";
import { SmartGuidanceCard } from "@/components/cards/smart-guidance-card";
import { Card } from "@/components/ui/card";
import type { ParkingModalData } from "@/lib/engines/parking-session";

export function ParkingStartedModal({
  open,
  data,
  onClose
}: {
  open: boolean;
  data: ParkingModalData | null;
  onClose: () => void;
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003E51]/45 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[32px] bg-white p-5 shadow-[0_30px_90px_rgba(0,62,81,0.28)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.30em] text-[#008540]">Parking session started</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {data.lotName} · {data.floorLabel} · Slot {data.slotLabel}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Parked at{" "}
              {new Date(data.session.parkedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
              . Review your restrictions, leave-by times, and guidance before you continue.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
                <p className="text-sm text-slate-500">Current rule status</p>
                <p className="mt-2 text-lg font-semibold text-[#003E51] capitalize">{data.ruleResult.permitStatus}</p>
              </div>
              <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
                <p className="text-sm text-slate-500">Leave by</p>
                <p className="mt-2 text-lg font-semibold text-[#008540]">{data.ruleResult.leaveByTime ?? "No timed rule active"}</p>
              </div>
              <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
                <p className="text-sm text-slate-500">Nearest bus stop</p>
                <p className="mt-2 text-lg font-semibold text-[#003E51]">{data.guidance.nearestBusStop?.label ?? "Waiting for location"}</p>
              </div>
              <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
                <p className="text-sm text-slate-500">Preferred-building parking insight</p>
                <p className="mt-2 text-lg font-semibold text-[#003E51]">
                  {data.guidance.nearestPermittedParkingToDestination?.name ?? "No recommendation available"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/guidance" className="inline-flex rounded-full bg-[#008540] px-4 py-2 text-sm font-semibold text-white">
                Go to Smart Guidance
              </Link>
              <button type="button" onClick={onClose} className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Close
              </button>
            </div>
          </Card>

          <SmartGuidanceCard guidance={data.guidance} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <RuleAlertsPanel alerts={data.alerts} compact />
          <CountdownList countdowns={data.countdowns} />
        </div>
      </div>
    </div>
  );
}
