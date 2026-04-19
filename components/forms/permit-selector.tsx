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
                "group flex min-h-[156px] flex-col items-center justify-center rounded-[24px] border bg-white/8 p-3 text-center backdrop-blur transition hover:-translate-y-0.5",
                active && "ring-2 ring-[#003E51] ring-offset-2"
              )}
              style={{
                borderColor: active ? "#003E51" : "rgba(255,255,255,0.22)",
                background: active
                  ? "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.1) 100%)"
                  : "rgba(255,255,255,0.08)",
                boxShadow: active ? "0 18px 40px rgba(0,62,81,0.12)" : "none"
              }}
            >
              <Image
                src={categoryImageMap[key]}
                alt={meta.label}
                width={92}
                height={116}
                className="mx-auto h-[92px] w-[76px] object-contain"
              />
              <p className="mt-2 text-center text-[11px] font-medium leading-4 text-[#003E51] lg:text-xs">{meta.label}</p>
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
