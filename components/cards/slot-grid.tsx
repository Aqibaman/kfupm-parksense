import type { FloorSlotGridResult } from "@/lib/engines/lot-detail";

export function SlotGrid({
  floor,
  selectedSlotId,
  onSlotSelect
}: {
  floor: FloorSlotGridResult;
  selectedSlotId?: string | null;
  onSlotSelect?: (slotId: string) => void;
}) {
  return (
    <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dbe9e1] bg-white px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#008540]">{floor.floor.label} slot board</p>
          <p className="mt-1 text-sm text-slate-500">
            {floor.allowed ? "Tap through the slot board to review live floor availability." : "This floor is visible for transparency, but blocked for this permit."}
          </p>
        </div>
        {floor.leaveBy ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${floor.violationRisk ? "bg-rose-100 text-rose-700" : "bg-[#edf7f2] text-[#007a4d]"}`}>
            {floor.violationRisk ? "Leave now to avoid violation" : `Leave by ${floor.leaveBy}`}
          </span>
        ) : null}
      </div>

      {floor.bannerText ? (
        <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-medium ${floor.allowed ? "border-[#e9d8a6] bg-[#fff8e7] text-[#8a6a14]" : "border-slate-200 bg-slate-100 text-slate-600"}`}>
          {floor.bannerText}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {floor.ruleText.map((rule) => (
          <span key={rule} className="rounded-full border border-[#dbe9e1] bg-white px-3 py-1 text-xs font-semibold text-[#003E51]">
            {rule}
          </span>
        ))}
      </div>

      <div className="max-h-[420px] overflow-auto rounded-[24px] border border-[#dbe9e1] bg-white p-4">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
          {floor.slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => (slot.interactive ? onSlotSelect?.(slot.id) : undefined)}
              className={
                `${
                  slot.status === "vacant"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : slot.status === "occupied"
                      ? "border-rose-200 bg-rose-50 text-rose-800"
                      : "border-slate-200 bg-slate-100 text-slate-500"
                } ${
                  selectedSlotId === slot.id ? "ring-2 ring-[#003E51] ring-offset-2" : ""
                } flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold shadow-sm transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100`
              }
              aria-disabled={!slot.interactive}
              disabled={!slot.interactive}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
