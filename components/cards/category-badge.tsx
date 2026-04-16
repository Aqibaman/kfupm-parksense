import { categoryMeta } from "@/lib/constants";
import type { UserCategory } from "@/lib/types";

export function CategoryBadge({ category }: { category: UserCategory }) {
  const meta = categoryMeta[category];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${meta.chipClass}`} />
      {meta.label}
    </span>
  );
}
