import Link from "next/link";
import { categoryMeta } from "@/lib/constants";

export default function ProfileCompletionPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[32px] bg-slate-950 p-8 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-200">Profile Completion</p>
          <h1 className="mt-3 text-4xl font-semibold">Mapped permit category preview</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">This step confirms the parking category generated from gender and residency, then lets the student add favorites and alert preferences.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <div key={key} className="rounded-3xl border border-slate-200 bg-white p-5">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}>{meta.label}</span>
              <p className="mt-3 text-sm text-slate-500">Generated from the registration profile and editable from account settings.</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Open dashboard</Link>
      </div>
    </main>
  );
}
