import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/card";

export function SectionGrid({ children, cols = "xl:grid-cols-3" }: { children: ReactNode; cols?: string }) {
  return <div className={`grid gap-4 ${cols}`}>{children}</div>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </Card>
  );
}

export function InfoPanel({
  title,
  subtitle,
  items
}: {
  title: string;
  subtitle?: string;
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <Card>
      <CardTitle title={title} subtitle={subtitle} />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-3">
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className="text-sm font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CTAGroup({ items }: { items: Array<{ href: string; label: string; variant?: "dark" | "light" }> }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={item.variant === "light" ? "inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950" : "inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
