"use client";

import { useEffect, useMemo } from "react";
import { CheckerResultCard } from "@/components/cards/checker-result-card";
import { Card, CardTitle } from "@/components/ui/card";
import {
  evaluateParkingPolicy,
  type CheckerInput,
  type CheckerResult
} from "@/lib/engines/parking-policy-guide";
import { type ParkingLotId, parkingLocations } from "@/lib/engines/preferred-building-guidance";
import type { StudentCategory } from "@/lib/engines/rules";

export function CanIParkHereChecker({
  input,
  onInputChange,
  onResult
}: {
  input: CheckerInput;
  onInputChange: (input: CheckerInput) => void;
  onResult: (result: CheckerResult | null) => void;
}) {
  const result = useMemo(() => evaluateParkingPolicy(input), [input]);

  useEffect(() => {
    onResult(result);
  }, [onResult, result]);

  return (
    <Card>
      <CardTitle title="Can I Park Here?" subtitle="Check the exact lot, floor, time, and duration before you park." />
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#0f172a]">Parking lot</span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#dbe9e1] px-4 py-3 text-sm"
              value={input.lotId}
              onChange={(event) => onInputChange({ ...input, lotId: event.target.value as ParkingLotId })}
            >
              {parkingLocations.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#0f172a]">Floor / level</span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#dbe9e1] px-4 py-3 text-sm"
              value={input.floorKey ?? ""}
              onChange={(event) => onInputChange({ ...input, floorKey: event.target.value })}
              placeholder="L0, L3, F2..."
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#0f172a]">Current time</span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#dbe9e1] px-4 py-3 text-sm"
              type="time"
              value={input.currentTime}
              onChange={(event) => onInputChange({ ...input, currentTime: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#0f172a]">Duration parked / intended (minutes)</span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#dbe9e1] px-4 py-3 text-sm"
              type="number"
              min="0"
              value={input.durationMinutes ?? 0}
              onChange={(event) => onInputChange({ ...input, durationMinutes: Number(event.target.value) || 0 })}
            />
          </label>
        </div>
        <CheckerResultCard result={result} />
      </div>
    </Card>
  );
}
