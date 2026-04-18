import { LotOccupancyCard } from "@/components/cards/lot-occupancy-card";
import { AppShell } from "@/components/layout/app-shell";
import { parkingLots } from "@/lib/data/kfupm-data";
import { getPermittedLots } from "@/lib/engines/rules";

export default function AdminLotsPage() {
  const lotViews = getPermittedLots("non_resident_male", parkingLots, new Date(), {
    showUnauthorizedAsDisabled: true
  });

  return (
    <AppShell
      title="Lot Management"
      eyebrow="Admin · Lots"
      description="Operations users can review occupancy, policy posture, and demand across all tracked lots."
      admin
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lotViews.map((lot) => (
          <LotOccupancyCard key={lot.id} lot={lot} />
        ))}
      </div>
    </AppShell>
  );
}
