"use client";

import type { BuildingId, BuildingLocation } from "@/lib/engines/preferred-building-guidance";

export function PreferredBuildingSelector({
  buildings,
  value,
  onChange
}: {
  buildings: BuildingLocation[];
  value: BuildingId | null;
  onChange: (value: BuildingId | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5b72]">Preferred building</span>
      <select
        className="mt-2 w-full rounded-2xl border border-[#cfe4d8] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#008540] focus:ring-2 focus:ring-[#dff6e7]"
        value={value ?? ""}
        onChange={(event) => onChange((event.target.value || null) as BuildingId | null)}
      >
        <option value="">Select a preferred building</option>
        {buildings.map((building) => (
          <option key={building.id} value={building.id}>
            {building.name}
          </option>
        ))}
      </select>
    </label>
  );
}
