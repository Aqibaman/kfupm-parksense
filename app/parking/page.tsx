import { LotOccupancyCard } from "@/components/cards/lot-occupancy-card";
import { ParkingMapLegend } from "@/components/cards/parking-map-legend";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { parkingLots } from "@/lib/data/kfupm-data";
import { getDemoUser } from "@/lib/services/query";
import { getLotPermission } from "@/lib/engines/rules";

export default function ParkingPage() {
  const user = getDemoUser();

  return (
    <AppShell
      title="Parking Map and Availability"
      eyebrow="Parking Operations"
      description="Traffic-style occupancy cards, category-aware access states, and destination-oriented lot selection for mobile, tablet, and desktop views."
    >
      <SectionGrid cols="xl:grid-cols-[0.8fr_1.2fr]">
        <ParkingMapLegend />
        <InfoPanel
          title="Filters represented in this demo"
          subtitle="The seeded data already supports future filter and API expansion."
          items={[
            { label: "Category filter", value: user.userCategory },
            { label: "Covered / uncovered", value: "Supported in lot data model" },
            { label: "Allowed now", value: "Evaluated in rule engine" },
            { label: "Nearest building", value: user.favoriteBuildings[0] },
            { label: "Male / female network", value: user.gender }
          ]}
        />
      </SectionGrid>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {parkingLots.map((lot) => {
          const permission = getLotPermission(user, lot);
          return <LotOccupancyCard key={lot.id} lot={lot} allowed={permission.allowed} />;
        })}
      </div>
    </AppShell>
  );
}
