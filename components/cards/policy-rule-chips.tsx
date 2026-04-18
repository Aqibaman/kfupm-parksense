export function PolicyRuleChips({ chips }: { chips: string[] }) {
  if (!chips.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-semibold text-[#007a4d]">
          {chip}
        </span>
      ))}
    </div>
  );
}
