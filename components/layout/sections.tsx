import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/card";

export function SectionGrid({ children, cols = "xl:grid-cols-3" }: { children: ReactNode; cols?: string }) {
  return <div className={`grid gap-4 ${cols}`}>{children}</div>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card style={{ background: "linear-gradient(180deg,#ffffff 0%, #f6fbf8 100%)" }}>
      <p className="text-sm text-[#557072]">{label}</p>
      <p className="mt-3 text-3xl font-semibold" style={{ color: "var(--category-text)" }}>{value}</p>
      <p className="mt-2 text-sm text-[#557072]">{helper}</p>
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
          <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-[#dbe9e1] bg-[#f8fbf9] p-3">
            <span className="text-sm text-[#557072]">{item.label}</span>
            <span className="text-sm font-semibold" style={{ color: "var(--category-text)" }}>{item.value}</span>
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
          className={
            item.variant === "light"
              ? "inline-flex rounded-full border border-[#003E51]/15 bg-white px-5 py-3 text-sm font-semibold text-[#003E51]"
              : "inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white"
          }
          style={item.variant === "light" ? undefined : { backgroundColor: "var(--category-primary)" }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
