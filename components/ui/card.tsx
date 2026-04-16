import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={cn("rounded-3xl border border-[#d9e8e0] bg-white p-5 shadow-[0_18px_60px_rgba(0,133,64,0.08)] backdrop-blur", className)} style={style}>{children}</div>;
}

export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

export function StatPill({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "green" | "yellow" | "red" | "blue" }) {
  const tones = {
    slate: "text-[#003E51]",
    green: "text-[#0f6c3a]",
    yellow: "text-[#5f6f1c]",
    red: "bg-rose-100 text-rose-700",
    blue: "text-[#008540]"
  };

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}
      style={tone === "red" ? undefined : { backgroundColor: tone === "blue" ? "#e8f5ee" : "color-mix(in srgb, var(--category-soft) 55%, #eaf5ef 45%)" }}
    >
      {label}: {value}
    </span>
  );
}
