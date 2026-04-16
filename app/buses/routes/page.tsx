"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RouteTimeline } from "@/components/cards/route-timeline";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { busRoutes, busStops } from "@/lib/data/kfupm-data";

export default function BusRoutesPage() {
  const { user } = useStudentProfile();
  const filteredRoutes = busRoutes.filter((route) => route.networkType === user.gender);

  return (
    <AppShell
      title="Bus Routes"
      eyebrow="Route Library"
      description="Route summaries are filtered by the student profile, so users only see the network relevant to their gender-based bus system."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {filteredRoutes.map((route) => (
          <RouteTimeline key={route.id} route={route} stops={busStops.filter((stop) => route.stopIds.includes(stop.id))} />
        ))}
      </div>
    </AppShell>
  );
}
