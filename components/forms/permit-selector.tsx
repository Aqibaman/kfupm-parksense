"use client";

import { categoryMeta } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserCategory } from "@/lib/types";

export function PermitSelector({
  value,
  onChange,
  columns = "xl:grid-cols-4"
}: {
  value: UserCategory;
  onChange?: (value: UserCategory) => void;
  columns?: string;
}) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${columns}`}>
      {(Object.entries(categoryMeta) as Array<[UserCategory, (typeof categoryMeta)[UserCategory]]>).map(([key, meta]) => {
        const active = value === key;

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
            <div className={cn("mx-auto mb-5 h-16 w-[82%] rounded-[22px] border border-white/70 shadow-inner", meta.previewClass)} />
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
