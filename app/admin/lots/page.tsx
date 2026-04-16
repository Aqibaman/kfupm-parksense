import { LotOccupancyCard } from "@/components/cards/lot-occupancy-card";
import { AppShell } from "@/components/layout/app-shell";
import { parkingLots } from "@/lib/data/kfupm-data";

export default function AdminLotsPage() {
  return (
    <AppShell
      title="Lot Management"
      eyebrow="Admin · Lots"
      description="Operations users can review occupancy, policy posture, and demand across all tracked lots."
      admin
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {parkingLots.map((lot) => (
          <LotOccupancyCard key={lot.id} lot={lot} allowed />
        ))}
      </div>
    </AppShell>
  );
}
