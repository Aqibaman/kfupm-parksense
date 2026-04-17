"use client";

import { useEffect, useState } from "react";
import { CategoryBadge } from "@/components/cards/category-badge";
import { PermitSelector } from "@/components/forms/permit-selector";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { academicBuildingOptions } from "@/lib/constants";
import type { User, UserCategory } from "@/lib/types";

export function EditableProfileForm({ user }: { user: User }) {
  const { updateUser, selectCategory } = useStudentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [draftUser, setDraftUser] = useState<User>(user);

  useEffect(() => {
    setDraftUser(user);
  }, [user]);

  function updateBuilding(index: number, value: string) {
    const nextBuildings = [...draftUser.favoriteBuildings];
    nextBuildings[index] = value;
    setDraftUser((current) => ({
      ...current,
      favoriteBuildings: nextBuildings.filter(Boolean)
    }));
  }

  function handleCategoryChange(category: UserCategory) {
    setDraftUser((current) => ({
      ...current,
      userCategory: category
    }));
  }

  function handleEdit() {
    setDraftUser(user);
    setIsEditing(true);
  }

  function handleSave() {
    if (draftUser.userCategory !== user.userCategory) {
      selectCategory(draftUser.userCategory);
    }

    updateUser({
      name: draftUser.name,
      studentId: draftUser.studentId,
      email: draftUser.email,
      favoriteBuildings: draftUser.favoriteBuildings,
      notificationSettings: draftUser.notificationSettings,
      userCategory: draftUser.userCategory
    });
    setIsEditing(false);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-[#003E51]">Student account</h3>
            <p className="mt-2 text-sm text-[#557072]">Students can edit their account details directly here for the demo experience.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex rounded-full border border-[#0d5f74]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0d5f74] shadow-[0_10px_30px_rgba(13,95,116,0.08)]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isEditing}
              className="inline-flex rounded-full bg-[#007a4d] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,133,64,0.18)] disabled:cursor-not-allowed disabled:bg-[#b8d8c8] disabled:text-white/80 disabled:shadow-none"
            >
              Save
            </button>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="field disabled:bg-slate-50 disabled:text-slate-500" value={draftUser.name} disabled={!isEditing} onChange={(event) => setDraftUser((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <label className="label">Student ID</label>
            <input className="field disabled:bg-slate-50 disabled:text-slate-500" value={draftUser.studentId} disabled={!isEditing} onChange={(event) => setDraftUser((current) => ({ ...current, studentId: event.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="field disabled:bg-slate-50 disabled:text-slate-500" value={draftUser.email} disabled={!isEditing} onChange={(event) => setDraftUser((current) => ({ ...current, email: event.target.value }))} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={`building-${index + 1}`}>
                <label className="label">{`Preferred Building ${index + 1}`}</label>
                <select className="field disabled:bg-slate-50 disabled:text-slate-500" disabled={!isEditing} value={draftUser.favoriteBuildings[index] ?? ""} onChange={(event) => updateBuilding(index, event.target.value)}>
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
          <div className="rounded-2xl border border-[#003E51]/10 bg-[#f8fbf9] px-4 py-3">
            <label className="flex items-center gap-3 text-sm text-[#003E51]">
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={draftUser.notificationSettings.sound}
                onChange={(event) =>
                  setDraftUser((current) => ({
                    ...current,
                    notificationSettings: {
                      ...current.notificationSettings,
                      sound: event.target.checked
                    }
                  }))
                }
              />
              Enable sound alerts
            </label>
            <p className="mt-2 text-sm text-[#557072]">
              We will send a notification to your phone when it is 30-60 minutes to the deadline and you need to leave the parking space to avoid a violation. You can opt in or opt out by clicking the box beside the alert.
            </p>
          </div>
        </div>
      </div>
      <div className="surface p-5">
        <p className="text-sm text-[#557072]">Current category</p>
        <div className="mt-3">
          <CategoryBadge category={draftUser.userCategory} />
        </div>
        <p className="mt-5 text-sm font-medium text-[#003E51]">Choose your permit category</p>
        <p className="mt-2 text-sm text-[#557072]">Pick the full category directly instead of entering gender or residency separately.</p>
        <div className={`mt-5 ${isEditing ? "" : "pointer-events-none opacity-70"}`}>
          <PermitSelector value={draftUser.userCategory} onChange={handleCategoryChange} columns="grid-cols-1" />
        </div>
      </div>
    </div>
  );
}
