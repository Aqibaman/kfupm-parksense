import { Card, CardTitle } from "@/components/ui/card";

export function ChartBars({
  title,
  subtitle,
  items
}: {
  title: string;
  subtitle?: string;
  items: Array<{ label: string; value: number }>;
  tone?: string;
}) {
  const peak = items.reduce((best, item) => (item.value > best.value ? item : best), items[0]);
  const average = Math.round(items.reduce((sum, item) => sum + item.value, 0) / Math.max(items.length, 1));

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CardTitle title={title} subtitle={subtitle} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#cfe5da] bg-[#f5fbf7] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Busiest period</p>
            <p className="mt-2 text-lg font-semibold text-[#003E51]">{peak.label}</p>
            <p className="text-sm text-slate-500">{peak.value}% occupied</p>
          </div>
          <div className="rounded-2xl border border-[#d9e8e0] bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0d5f74]">Daily average</p>
            <p className="mt-2 text-lg font-semibold text-[#003E51]">{average}%</p>
            <p className="text-sm text-slate-500">Typical lot pressure</p>
          </div>
        </div>
      </div>
      <div className="mt-2 rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf9_100%)] p-5">
        <div className="relative rounded-[24px] border border-[#e3efe8] bg-[radial-gradient(circle_at_top,#f4fbf7_0%,#ffffff_60%,#ffffff_100%)] p-5">
          <div className="pointer-events-none absolute inset-x-5 top-5 bottom-[4.5rem]">
            {[0, 25, 50, 75, 100].map((tick, index) => (
              <div key={tick} className="absolute left-0 right-0" style={{ top: `${index * 25}%` }}>
                <div className="border-t border-dashed border-[#dcebe3]" />
                <span className="absolute -top-3 right-0 bg-white px-2 text-[11px] font-medium text-slate-400">{100 - tick}%</span>
              </div>
            ))}
            <div
              className="absolute left-0 right-0 border-t border-[#0d5f74]/30 border-dashed"
              style={{ top: `${100 - average}%` }}
            />
          </div>
          <div className="grid h-[280px] grid-cols-5 items-end gap-4 pt-6">
            {items.map((item) => {
              const isPeak = item.label === peak.label;

              return (
                <div key={item.label} className="relative flex h-full flex-col items-center justify-end">
                  <div className="mb-3 text-center">
                    <p className={`text-lg font-semibold ${isPeak ? "text-[#008540]" : "text-[#003E51]"}`}>{item.value}%</p>
                    {isPeak ? <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008540]">Peak</p> : null}
                  </div>
                  <div className="relative flex h-[210px] w-full items-end justify-center">
                    <div className="absolute inset-x-4 bottom-0 top-0 rounded-t-[22px] bg-[#edf5f0]" />
                    <div
                      className={`relative z-10 w-full max-w-[92px] rounded-t-[22px] border shadow-[0_16px_30px_rgba(0,62,81,0.08)] ${
                        isPeak
                          ? "border-[#0d8e5b] bg-[linear-gradient(180deg,#19a56f_0%,#008540_100%)]"
                          : "border-[#0d5f74]/20 bg-[linear-gradient(180deg,#0d5f74_0%,#11789a_100%)]"
                      }`}
                      style={{ height: `${Math.max(item.value, 8)}%` }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-[#003E51]">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">Occupancy</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
