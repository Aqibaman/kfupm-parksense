"use client";

import { CategoryBadge } from "@/components/cards/category-badge";
import { PermitSelector } from "@/components/forms/permit-selector";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { academicBuildingOptions } from "@/lib/constants";
import type { User } from "@/lib/types";

export function EditableProfileForm({ user }: { user: User }) {
  const { updateUser, selectCategory } = useStudentProfile();

  function updateBuilding(index: number, value: string) {
    const nextBuildings = [...user.favoriteBuildings];
    nextBuildings[index] = value;
    updateUser({
      favoriteBuildings: nextBuildings.filter(Boolean)
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="surface p-5">
        <h3 className="text-2xl font-semibold text-[#003E51]">Student account</h3>
        <p className="mt-2 text-sm text-[#557072]">Students can edit their account details directly here for the demo experience.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="field" value={user.name} onChange={(event) => updateUser({ name: event.target.value })} />
          </div>
          <div>
            <label className="label">Student ID</label>
            <input className="field" value={user.studentId} onChange={(event) => updateUser({ studentId: event.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="field" value={user.email} onChange={(event) => updateUser({ email: event.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={`building-${index + 1}`}>
                <label className="label">{`Preferred Building ${index + 1}`}</label>
                <select className="field" value={user.favoriteBuildings[index] ?? ""} onChange={(event) => updateBuilding(index, event.target.value)}>
                  <option value="">Select a building</option>
                  {academicBuildingOptions.map((option) => (
                    <option key={`profile-${index}-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-[#003E51]/10 bg-[#f8fbf9] px-4 py-3 text-sm text-[#003E51]">
            <input
              type="checkbox"
              checked={user.notificationSettings.sound}
              onChange={(event) =>
                updateUser({
                  notificationSettings: {
                    ...user.notificationSettings,
                    sound: event.target.checked
                  }
                })
              }
            />
            Enable sound alerts
          </label>
        </div>
      </div>
      <div className="surface p-5">
        <p className="text-sm text-[#557072]">Current category</p>
        <div className="mt-3">
          <CategoryBadge category={user.userCategory} />
        </div>
        <p className="mt-5 text-sm font-medium text-[#003E51]">Choose your permit category</p>
        <p className="mt-2 text-sm text-[#557072]">Pick the full category directly instead of entering gender or residency separately.</p>
        <div className="mt-5">
          <PermitSelector value={user.userCategory} onChange={selectCategory} columns="grid-cols-1" />
        </div>
      </div>
    </div>
  );
}
