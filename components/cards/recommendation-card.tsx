import Link from "next/link";
import type { PreferredBuildingRecommendation } from "@/lib/engines/preferred-building-guidance";

const recommendationToHref: Record<string, string> = {
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

export function RecommendationCard({ recommendation }: { recommendation: PreferredBuildingRecommendation }) {
  return (
    <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] p-5 shadow-[0_16px_38px_rgba(0,62,81,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0b5b72_0%,#008540_100%)] text-lg font-semibold text-white">
            {recommendation.ranking}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#0f172a]">{recommendation.lotName}</h4>
            <p className="mt-1 text-sm text-slate-500">{recommendation.distanceLabel} from your selected building</p>
            <p className="mt-2 text-sm font-medium text-[#0b5b72]">{recommendation.reason}</p>
          </div>
        </div>
        <Link href={recommendationToHref[recommendation.lotId] ?? "/parking"} className="inline-flex rounded-full bg-[#0b5b72] px-4 py-2 text-sm font-semibold text-white">
          View lot details
        </Link>
      </div>
      {recommendation.restrictionBadges.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendation.restrictionBadges.map((badge) => (
            <span key={badge} className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-semibold text-[#007a4d]">
              {badge}
            </span>
          ))}
        </div>
      ) : null}
      {recommendation.restrictionText ? <p className="mt-3 text-sm leading-7 text-slate-600">{recommendation.restrictionText}</p> : null}
    </div>
  );
}
