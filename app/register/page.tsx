"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PermitSelector } from "@/components/forms/permit-selector";
import { useStudentProfile } from "@/components/providers/student-profile-provider";

export default function RegisterPage() {
  const { user, selectCategory } = useStudentProfile();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7faf8_100%)] px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_100px_rgba(0,62,81,0.1)] lg:p-10">
        <BrandLogo />
        <p className="mt-6 text-sm uppercase tracking-[0.28em] text-[#008540]">Registration</p>
        <h1 className="mt-3 text-4xl font-semibold text-black">Create your KFUPM ParkSense profile</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Choose your official permit color first. The same permit styling will follow your access badges, rule views, and parking recommendations throughout the app.
        </p>
        <div className="mt-8">
          <PermitSelector value={user.userCategory} onChange={selectCategory} />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            "Full name",
            "Student ID",
            "Email",
            "Password",
            "Preferred class building 1",
            "Preferred class building 2",
            "Preferred class building 3"
          ].map((field) => (
            <div key={field}>
              <label className="label">{field}</label>
              <input className="field" placeholder={field} />
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500">Registration now uses the four full permit buttons directly. Students choose the exact category instead of typing gender and residency separately.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/profile-completion" className="inline-flex rounded-full bg-[#008540] px-5 py-3 text-sm font-semibold text-white">Continue profile setup</Link>
          <Link href="/login" className="inline-flex rounded-full border border-[#003E51]/20 px-5 py-3 text-sm font-semibold text-[#003E51]">Back to login</Link>
        </div>
      </div>
    </main>
  );
}
