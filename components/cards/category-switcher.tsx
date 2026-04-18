"use client";

import { CategoryBadge } from "@/components/cards/category-badge";
import { categoryMeta } from "@/lib/constants";
import type { UserCategory } from "@/lib/types";

export function CategorySwitcher({
  value,
  onChange
}: {
  value: UserCategory;
  onChange: (category: UserCategory) => void;
}) {
  const categories = Object.keys(categoryMeta) as UserCategory[];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5b72]">Demo permit switcher</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-3 py-2 text-left text-xs font-semibold transition ${
              value === category ? categoryMeta[category].color : "border-[#dbe9e1] bg-white text-[#003E51]"
            }`}
          >
            <CategoryBadge category={category} />
          </button>
        ))}
      </div>
    </div>
  );
}
