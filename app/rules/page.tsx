"use client";

import { useMemo, useState } from "react";
import { CanIParkHereChecker } from "@/components/cards/can-i-park-here-checker";
import { CategorySwitcher } from "@/components/cards/category-switcher";
import { PermitRulesPanel } from "@/components/cards/permit-rules-panel";
import { TopRiskLotsCard } from "@/components/cards/top-risk-lots-card";
import { AppShell } from "@/components/layout/app-shell";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { Card, CardTitle } from "@/components/ui/card";
import {
  getCategoryPolicySummary,
  type CheckerInput
} from "@/lib/engines/parking-policy-guide";
import { getBuildingIdFromLabel } from "@/lib/engines/preferred-building-guidance";
import { toStudentCategory } from "@/lib/engines/rules";
import type { UserCategory } from "@/lib/types";

const userCategoryToStudentCategory = (value: UserCategory) => toStudentCategory(value);

export default function ParkingPolicyGuidePage() {
  const { user } = useStudentProfile();
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>(user.userCategory);
  const selectedStudentCategory = userCategoryToStudentCategory(selectedCategory);
  const preferredBuildingId = getBuildingIdFromLabel(user.favoriteBuildings[0]);
  const [checkerInput, setCheckerInput] = useState<CheckerInput>({
    category: selectedStudentCategory,
    lotId: "parking_23",
    floorKey: "F3",
    currentTime: "21:00",
    durationMinutes: 30,
    preferredBuildingId
  });

  const summary = useMemo(() => getCategoryPolicySummary(selectedStudentCategory), [selectedStudentCategory]);

  const syncedCheckerInput = useMemo(
    () => ({
      ...checkerInput,
      category: selectedStudentCategory,
      preferredBuildingId
    }),
    [checkerInput, preferredBuildingId, selectedStudentCategory]
  );

  return (
    <AppShell
      title="Parking Policy Guide"
      eyebrow="Permit & Policy Guide"
      description="Understand your permit, check where you can park, and avoid violations with live policy guidance."
    >
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <CardTitle title="Policy awareness controls" subtitle="Switch permit categories for demo review and test policy outcomes before parking." />
          <CategorySwitcher
            value={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              const nextCategory = userCategoryToStudentCategory(category);
              setCheckerInput((current) => ({ ...current, category: nextCategory }));
            }}
          />
        </div>
      </Card>

      <PermitRulesPanel summary={summary} category={selectedCategory} />

      <CanIParkHereChecker
        input={syncedCheckerInput}
        onInputChange={(nextInput) => setCheckerInput(nextInput)}
        onResult={() => {}}
      />

      <TopRiskLotsCard />
    </AppShell>
  );
}
