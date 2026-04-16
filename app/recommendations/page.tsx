"use client";

import { RecommendationPanel } from "@/components/cards/recommendation-panel";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { buildDashboardSnapshot } from "@/lib/services/query";

export default function RecommendationsPage() {
  const { user } = useStudentProfile();
  const snapshot = buildDashboardSnapshot(user);

  return (
    <AppShell
      title="AI Recommendation Engine"
      eyebrow="Decision Support"
      description="Destination, parking duration, legal access, occupancy, bus proximity, and violation windows are fused into an explainable recommendation flow."
    >
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <RecommendationPanel recommendation={snapshot.recommendation} />
        <InfoPanel
          title="Scoring logic"
          items={[
            { label: "Illegal lot", value: "Discarded" },
            { label: "Full lot", value: "Heavy penalty" },
            { label: "Near destination", value: "Positive score" },
            { label: "Near bus stop", value: "Positive score" },
            { label: "Violation window close", value: "Negative score" },
            { label: "Building 64 complexity", value: "Extra warning" }
          ]}
        />
      </SectionGrid>
    </AppShell>
  );
}
