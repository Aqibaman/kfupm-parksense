import { Card, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

export function ChartBars({
  title,
  subtitle,
  items,
  tone = "bg-slate-900"
}: {
  title: string;
  subtitle?: string;
  items: Array<{ label: string; value: number }>;
  tone?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <Card>
      <CardTitle title={title} subtitle={subtitle} />
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="text-slate-500">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${tone}`} style={{ width: formatPercent(item.value / max) }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
