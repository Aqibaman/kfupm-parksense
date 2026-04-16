"use client";

import { EditableProfileForm } from "@/components/forms/editable-profile-form";
import { AppShell } from "@/components/layout/app-shell";
import { useStudentProfile } from "@/components/providers/student-profile-provider";

export default function ProfilePage() {
  const { user } = useStudentProfile();

  return (
    <AppShell
      title="Profile"
      eyebrow="Student Settings"
      description="Identity, permit category, favorite destinations, alert preferences, and future category history all live in the same profile workspace."
    >
      <EditableProfileForm user={user} />
    </AppShell>
  );
}
