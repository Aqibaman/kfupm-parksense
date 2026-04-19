import { CardTitle } from "@/components/ui/card";

export function MapLegend() {
  return (
    <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4">
      <CardTitle title="Map legend" subtitle="Understand the markers used on the live route map." />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-[#f7fbf8] px-3 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8cc8a2] bg-[#eff8f3] text-xs font-semibold text-[#003E51]">
            301
          </span>
          <span className="text-sm text-slate-600">Route stop</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#f7fbf8] px-3 py-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0b5b72] text-lg text-white">🚌</span>
          <span className="text-sm text-slate-600">Active bus</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#f7fbf8] px-3 py-3">
          <span className="inline-flex rounded-full bg-[#fff4e7] px-3 py-1 text-xs font-semibold text-[#8a6a14]">Inactive</span>
          <span className="text-sm text-slate-600">Out of service window</span>
        </div>
      </div>
    </div>
  );
}
