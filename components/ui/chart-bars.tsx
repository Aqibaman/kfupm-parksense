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
  const max = Math.max(...items.map((item) => item.value), 1);
  const min = Math.min(...items.map((item) => item.value), 0);
  const peak = items.reduce((best, item) => (item.value > best.value ? item : best), items[0]);
  const points = items
    .map((item, index) => {
      const x = (index / Math.max(items.length - 1, 1)) * 100;
      const normalized = (item.value - min) / Math.max(max - min, 1);
      const y = 82 - normalized * 56;
      return { ...item, x, y };
    });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L 100 88 L 0 88 Z`;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CardTitle title={title} subtitle={subtitle} />
        <div className="rounded-2xl border border-[#cfe5da] bg-[#f5fbf7] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Busiest period</p>
          <p className="mt-2 text-lg font-semibold text-[#003E51]">{peak.label}</p>
          <p className="text-sm text-slate-500">{peak.value}% occupied</p>
        </div>
      </div>
      <div className="mt-2 rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf9_100%)] p-5">
        <div className="relative h-[280px] overflow-hidden rounded-[24px] border border-[#e3efe8] bg-[radial-gradient(circle_at_top,#f4fbf7_0%,#ffffff_55%,#ffffff_100%)] px-4 pb-5 pt-6">
          <div className="pointer-events-none absolute inset-x-4 top-6 bottom-12">
            {[0, 1, 2, 3].map((line) => (
              <div
                key={line}
                className="absolute left-0 right-0 border-t border-dashed border-[#dcebe3]"
                style={{ top: `${line * 25}%` }}
              />
            ))}
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-4 bottom-12 top-6 h-[calc(100%-4.5rem)] w-[calc(100%-2rem)]">
            <defs>
              <linearGradient id="occupancyArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0d7f62" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0d7f62" stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id="occupancyLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#0d5f74" />
                <stop offset="100%" stopColor="#008540" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#occupancyArea)" />
            <path d={linePath} fill="none" stroke="url(#occupancyLine)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="3.2" fill="#ffffff" stroke={point.label === peak.label ? "#008540" : "#0d5f74"} strokeWidth="2" />
                {point.label === peak.label ? (
                  <>
                    <circle cx={point.x} cy={point.y} r="5.2" fill="none" stroke="#008540" strokeOpacity="0.18" strokeWidth="4" />
                    <rect x={Math.max(point.x - 8, 1)} y={Math.max(point.y - 18, 3)} width="16" height="9" rx="4.5" fill="#003E51" />
                    <text x={point.x} y={Math.max(point.y - 11.8, 7)} textAnchor="middle" fontSize="4.2" fontWeight="700" fill="#ffffff">
                      {point.value}%
                    </text>
                  </>
                ) : null}
              </g>
            ))}
          </svg>
          <div className="absolute inset-x-4 bottom-4 grid grid-cols-5 gap-2">
            {items.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-sm font-semibold text-[#003E51]">{item.label}</p>
                <p className={`mt-1 text-xs ${item.label === peak.label ? "font-semibold text-[#008540]" : "text-slate-500"}`}>{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
