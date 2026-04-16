import { Card } from "@/components/ui/card";

export function AdminKPIGrid({ items }: { items: Array<{ label: string; value: string; helper: string }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
        </Card>
      ))}
    </div>
  );
}
