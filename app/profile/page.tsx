import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { getDemoUser } from "@/lib/services/query";

export default function ProfilePage() {
  const user = getDemoUser();

  return (
    <AppShell
      title="Profile"
      eyebrow="Student Settings"
      description="Identity, permit category, favorite destinations, alert preferences, and future category history all live in the same profile workspace."
    >
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <InfoPanel
          title="Student account"
          items={[
            { label: "Name", value: user.name },
            { label: "Student ID", value: user.studentId },
            { label: "Email", value: user.email },
            { label: "Gender", value: user.gender },
            { label: "Residency", value: user.residencyStatus }
          ]}
        />
        <div className="surface p-5">
          <p className="text-sm text-slate-500">Current category</p>
          <div className="mt-3"><CategoryBadge category={user.userCategory} /></div>
          <p className="mt-4 text-sm text-slate-500">Favorite buildings: {user.favoriteBuildings.join(", ")}</p>
          <p className="mt-4 text-sm text-slate-500">Sound alerts: {user.notificationSettings.sound ? "Enabled" : "Disabled"}</p>
        </div>
      </SectionGrid>
    </AppShell>
  );
}
