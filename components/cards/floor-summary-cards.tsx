import type { FloorSlotGridResult } from "@/lib/engines/lot-detail";

export function FloorSummaryCards({ floors }: { floors: FloorSlotGridResult[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {floors.map((floor) => (
        <div key={floor.floor.key} className="rounded-2xl border border-[#dbe9e1] bg-[#f8fbf9] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#003E51]">{floor.floor.label}</p>
              <p className="mt-1 text-xs text-slate-500">Capacity {floor.floor.capacity}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                floor.accessStatus === "blocked"
                  ? "bg-slate-200 text-slate-600"
                  : floor.accessStatus === "restricted"
                    ? "bg-[#fff7e8] text-[#9a6700]"
                    : "bg-[#edf7f2] text-[#007a4d]"
              }`}
            >
              {floor.accessStatus === "blocked" ? "Blocked" : floor.accessStatus === "restricted" ? "Restricted" : "Available"}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[11px] text-slate-400">Vacant</p>
              <p className="text-sm font-semibold text-emerald-700">{floor.availableCount}</p>
            </div>
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[11px] text-slate-400">Occupied</p>
              <p className="text-sm font-semibold text-rose-700">{floor.occupiedCount}</p>
            </div>
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[11px] text-slate-400">Unavailable</p>
              <p className="text-sm font-semibold text-slate-600">{floor.unavailableCount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
