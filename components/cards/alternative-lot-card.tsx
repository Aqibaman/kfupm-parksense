import Link from "next/link";
import { PolicyRuleChips } from "@/components/cards/policy-rule-chips";
import type { AlternativeSuggestion } from "@/lib/engines/parking-policy-guide";

const alternativeHref: Record<string, string> = {
  parking_19: "/parking/lot-19",
  parking_20: "/parking/lot-20",
  parking_23: "/parking/lot-23",
  parking_25: "/parking/lot-25",
  parking_39: "/parking/lot-39",
  parking_57: "/parking/lot-57",
  parking_59: "/parking/lot-59",
  parking_60: "/parking/lot-60",
  parking_64: "/parking/lot-64",
  parking_71: "/parking/lot-71",
  parking_72: "/parking/lot-72",
  parking_73: "/parking/lot-73",
  parking_74: "/parking/lot-74",
  parking_77: "/parking/lot-77",
  parking_400: "/parking/lot-400",
  medical_center: "/parking/lot-medical",
  dhahran_mosque: "/parking/lot-dhahran-mosque",
  al_zubair_mosque: "/parking/lot-alzubair",
  student_mall: "/parking/lot-mall",
  female_student_housing: "/parking/lot-female-housing",
  family_mall: "/parking/lot-university-square"
};

export function AlternativeLotCard({ alternative }: { alternative: AlternativeSuggestion }) {
  return (
    <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4 shadow-[0_12px_30px_rgba(0,62,81,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-[#0f172a]">{alternative.lotName}</h4>
          <p className="mt-2 text-sm leading-7 text-slate-600">{alternative.why}</p>
          {alternative.distanceLabel ? <p className="mt-2 text-sm font-medium text-[#0b5b72]">{alternative.distanceLabel} away</p> : null}
        </div>
        <Link href={alternativeHref[alternative.lotId] ?? "/parking"} className="rounded-full bg-[#0b5b72] px-4 py-2 text-sm font-semibold text-white">
          View lot details
        </Link>
      </div>
      <PolicyRuleChips chips={alternative.restrictionBadges} />
    </div>
  );
}
