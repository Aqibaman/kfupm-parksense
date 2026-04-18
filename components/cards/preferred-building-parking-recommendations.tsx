import { CategoryBadge } from "@/components/cards/category-badge";
import { EmptyRecommendationState } from "@/components/cards/empty-recommendation-state";
import { PreferredBuildingSelector } from "@/components/cards/preferred-building-selector";
import { RecommendationCard } from "@/components/cards/recommendation-card";
import { Card, CardTitle } from "@/components/ui/card";
import type { BuildingId, BuildingLocation, SmartGuidanceRecommendationSection } from "@/lib/engines/preferred-building-guidance";
import type { UserCategory } from "@/lib/types";

export function PreferredBuildingParkingRecommendations({
  buildings,
  selectedBuildingId,
  onBuildingChange,
  section,
  category
}: {
  buildings: BuildingLocation[];
  selectedBuildingId: BuildingId | null;
  onBuildingChange: (value: BuildingId | null) => void;
  section: SmartGuidanceRecommendationSection;
  category: UserCategory;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CardTitle
          title="Nearby permitted parking for your preferred building"
          subtitle="Based on your permit category and selected destination."
        />
        <CategoryBadge category={category} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="rounded-[26px] border border-[#dbe9e1] bg-[#f8fbf9] p-4">
          <PreferredBuildingSelector buildings={buildings} value={selectedBuildingId} onChange={onBuildingChange} />
          {section.buildingName ? (
            <div className="mt-4 rounded-2xl border border-[#dbe9e1] bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5b72]">Selected building</p>
              <p className="mt-2 text-base font-semibold text-[#0f172a]">{section.buildingName}</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          {section.emptyState === "no_building" ? (
            <EmptyRecommendationState
              title="Select a preferred building to see the nearest permitted parking options."
              description="Choose a destination building and this panel will rank the parking lots you are allowed to use from closest to furthest."
            />
          ) : null}
          {section.emptyState === "unknown_building" ? (
            <EmptyRecommendationState
              title="This building could not be mapped yet."
              description="Select another saved building or update the building location mapping to enable distance-based parking recommendations."
            />
          ) : null}
          {section.emptyState === "no_results" ? (
            <EmptyRecommendationState
              title="No permitted parking options found for this building and permit category."
              description="Try another destination building or update the permit category in your profile to refresh the recommendation list."
            />
          ) : null}
          {!section.emptyState ? section.recommendations.map((recommendation) => <RecommendationCard key={recommendation.lotId} recommendation={recommendation} />) : null}
        </div>
      </div>
    </Card>
  );
}
