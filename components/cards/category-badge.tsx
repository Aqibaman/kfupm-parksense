import { categoryMeta } from "@/lib/constants";
import type { UserCategory } from "@/lib/types";

export function CategoryBadge({ category }: { category: UserCategory }) {
  const meta = categoryMeta[category];
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}>{meta.label}</span>;
}
