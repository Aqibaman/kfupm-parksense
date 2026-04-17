"use client";

import Image from "next/image";
import { categoryMeta } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserCategory } from "@/lib/types";

const categoryDescriptions: Record<UserCategory, string> = {
  "resident-male": "Housing-based access with resident parking coverage.",
  "non-resident-male": "Commuter access with 10:00 PM campus limit.",
  "resident-female": "Resident female permit with category-specific routing.",
  "non-resident-female": "Commuter female permit with time-aware mobility rules."
};

const categoryImageMap: Record<UserCategory, string> = {
  "resident-male": "/permits/resident-male.png",
  "non-resident-male": "/permits/non-resident-male.png",
  "resident-female": "/permits/resident-female.png",
  "non-resident-female": "/permits/non-resident-female.png"
};

export function PermitSelector({
  value,
  onChange,
  columns = "xl:grid-cols-4",
  appearance = "default"
}: {
  value: UserCategory;
  onChange?: (value: UserCategory) => void;
  columns?: string;
  appearance?: "default" | "register";
}) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${columns}`}>
      {(Object.entries(categoryMeta) as Array<[UserCategory, (typeof categoryMeta)[UserCategory]]>).map(([key, meta]) => {
        const active = value === key;

        if (appearance === "register") {
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange?.(key)}
              className={cn(
                "group flex min-h-[228px] flex-col rounded-[28px] border bg-white p-5 text-left shadow-[0_14px_40px_rgba(0,62,81,0.06)] transition hover:-translate-y-0.5",
                active && "ring-2 ring-[#003E51] ring-offset-2"
              )}
              style={{
                borderColor: active ? "#003E51" : meta.border,
                background: active ? "linear-gradient(180deg,#ffffff 0%, color-mix(in srgb, var(--category-soft) 55%, white 45%) 100%)" : "linear-gradient(180deg,#ffffff 0%, #fcfefe 100%)"
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-[24px] border border-slate-100 bg-white p-2 shadow-[0_10px_24px_rgba(0,62,81,0.06)]">
                  <Image
                    src={categoryImageMap[key]}
                    alt={meta.label}
                    width={88}
                    height={110}
                    className="h-[92px] w-[76px] object-contain"
                  />
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em]"
                  style={{
                    color: meta.text,
                    backgroundColor: meta.soft
                  }}
                >
                  {meta.shortLabel}
                </span>
              </div>
              <div className="mt-5">
                <p className="text-[18px] font-semibold leading-8" style={{ color: meta.text }}>
                  {meta.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{categoryDescriptions[key]}</p>
              </div>
              <div className="mt-auto pt-5">
                <div
                  className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]"
                  style={{
                    color: active ? "#ffffff" : meta.text,
                    background: active ? "linear-gradient(135deg,#003E51 0%, #007a4d 100%)" : meta.soft
                  }}
                >
                  {active ? "Selected permit" : "Choose permit"}
                </div>
              </div>
            </button>
          );
        }

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange?.(key)}
            className={cn(
              "flex min-h-[290px] flex-col rounded-[28px] border p-5 text-center shadow-sm transition",
              meta.buttonClass,
              active && "ring-2 ring-[#003E51] ring-offset-2"
            )}
          >
            <div className="mx-auto mb-5 rounded-[24px] border border-white/70 bg-white/70 p-2 shadow-[0_10px_24px_rgba(0,62,81,0.05)]">
              <Image
                src={categoryImageMap[key]}
                alt={meta.label}
                width={88}
                height={110}
                className="h-[92px] w-[76px] object-contain"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.24em] opacity-70">{meta.shortLabel}</p>
            <div className="mt-4 flex min-h-[132px] items-center justify-center">
              <p className="max-w-[10ch] text-[18px] font-semibold leading-8">{meta.label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
