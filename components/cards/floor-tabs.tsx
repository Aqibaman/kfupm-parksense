import type { FloorKey, FloorSlotGridResult } from "@/lib/engines/lot-detail";

export function FloorTabs({
  floors,
  activeFloor,
  onSelect
}: {
  floors: FloorSlotGridResult[];
  activeFloor: FloorKey;
  onSelect: (floorKey: FloorKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {floors.map((floor) => (
        <button
          key={floor.floor.key}
          type="button"
          onClick={() => onSelect(floor.floor.key)}
          className={`rounded-2xl border px-4 py-3 text-left transition ${
            activeFloor === floor.floor.key
              ? "border-[#0d5f74] bg-[#eaf5f7] shadow-[0_10px_24px_rgba(13,95,116,0.12)]"
              : floor.allowed
                ? "border-[#dbe9e1] bg-white"
                : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#003E51]">{floor.floor.label}</p>
            {floor.accessStatus === "restricted" ? (
              <span className="rounded-full bg-[#fff7e8] px-2 py-1 text-[11px] font-semibold text-[#9a6700]">Restricted access</span>
            ) : null}
            {floor.accessStatus === "blocked" ? (
              <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600">Blocked</span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-slate-500">Capacity {floor.floor.capacity}</p>
        </button>
      ))}
    </div>
  );
}
