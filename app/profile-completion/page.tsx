"use client";

import Link from "next/link";
import { PermitSelector } from "@/components/forms/permit-selector";
import { useStudentProfile } from "@/components/providers/student-profile-provider";

export default function ProfileCompletionPage() {
  const { user, selectCategory } = useStudentProfile();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[32px] border border-[#003E51]/10 bg-white p-8 text-[#003E51] shadow-[0_18px_60px_rgba(0,62,81,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#008540]">Profile Completion</p>
          <h1 className="mt-3 text-4xl font-semibold">Confirm your permit category</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Pick the full category directly instead of entering gender or residency separately.</p>
        </div>
        <div className="rounded-[30px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] p-4 md:p-5">
          <h2 className="text-2xl font-semibold text-[#003E51]">Choose your permit category</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Pick the full category directly instead of entering gender or residency separately.</p>
          <div className="mt-4">
            <PermitSelector value={user.userCategory} onChange={selectCategory} appearance="register" />
          </div>
        </div>
        <Link href="/dashboard" className="inline-flex rounded-full bg-[#008540] px-5 py-3 text-sm font-semibold text-white">Open dashboard</Link>
      </div>
    </main>
  );
}
