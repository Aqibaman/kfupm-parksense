"use client";

import Image from "next/image";
import { categoryMeta } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserCategory } from "@/lib/types";

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
                "group flex min-h-[360px] flex-col rounded-[28px] border bg-white p-5 text-center shadow-[0_14px_40px_rgba(0,62,81,0.06)] transition hover:-translate-y-0.5",
                active && "ring-2 ring-[#003E51] ring-offset-2"
              )}
              style={{
                borderColor: active ? "#003E51" : meta.border,
                background: active ? "linear-gradient(180deg,#ffffff 0%, color-mix(in srgb, var(--category-soft) 55%, white 45%) 100%)" : "linear-gradient(180deg,#ffffff 0%, #fcfefe 100%)"
              }}
            >
              <div className="mx-auto rounded-[28px] bg-white p-3 shadow-[0_14px_32px_rgba(0,62,81,0.10)]">
                <div className="rounded-[22px] bg-[#0d4f77] p-2">
                  <Image
                    src={categoryImageMap[key]}
                    alt={meta.label}
                    width={96}
                    height={120}
                    className="h-[104px] w-[84px] object-contain"
                  />
                </div>
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.32em] opacity-65">{meta.shortLabel}</p>
              <div className="mt-5 flex flex-1 items-center justify-center">
                <p className="max-w-[12ch] text-[18px] font-semibold leading-[1.9]" style={{ color: meta.text }}>
                  {meta.label}
                </p>
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
