"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PermitSelector } from "@/components/forms/permit-selector";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { academicBuildingOptions, categoryMeta } from "@/lib/constants";

const buildingFieldLabels = [
  "Preferred Building 1",
  "Preferred Building 2",
  "Preferred Building 3",
  "Preferred Building 4",
  "Preferred Building 5"
];

export default function RegisterPage() {
  const router = useRouter();
  const { user, selectCategory, updateUser } = useStudentProfile();
  const [name, setName] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.passwordHash);
  const [buildings, setBuildings] = useState<string[]>([
    user.favoriteBuildings[0] ?? "",
    user.favoriteBuildings[1] ?? "",
    user.favoriteBuildings[2] ?? "",
    user.favoriteBuildings[3] ?? "",
    user.favoriteBuildings[4] ?? ""
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUser({
      name,
      studentId,
      email,
      passwordHash: password,
      favoriteBuildings: buildings.filter(Boolean)
    });
    router.push("/dashboard");
  }

  function updateBuilding(index: number, value: string) {
    setBuildings((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3faf6_0%,#ffffff_100%)] px-4 py-8 lg:px-6 lg:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 rounded-[36px] border border-[#dbe9e1] bg-white p-6 shadow-[0_30px_120px_rgba(0,62,81,0.12)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <section className="rounded-[30px] bg-[linear-gradient(180deg,#0b4f6c_0%,#0a6a5b_58%,#0b7b5b_100%)] p-7 text-white lg:p-9">
          <div className="inline-flex rounded-[28px] bg-white px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <BrandLogo compact />
          </div>
          <p className="mt-8 text-sm uppercase tracking-[0.34em] text-[#d6f7e2]">Create Account</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">Register your mobility profile</h1>
          <p className="mt-5 text-base leading-8 text-white/85">
            Every required field is marked with an asterisk. Students choose one of the four permit categories directly, and can optionally save up to five academic building preferences.
          </p>
          <div className="mt-8 rounded-[28px] border border-white/20 bg-white/8 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6f7e2]">Building dropdown scope</p>
            <p className="mt-3 text-sm leading-7 text-white/85">
              Core Academic Zone uses Building 1 to Building 25. Preparatory Year options include Building 57 and Building 58.
            </p>
          </div>
        </section>

        <section className="p-2 lg:px-4 lg:py-2">
          <BrandLogo compact />
          <p className="mt-6 text-sm uppercase tracking-[0.32em] text-[#008540]">Registration</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black">Create your KFUPM ParkSense profile</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            The selected permit controls your lot eligibility, special rules, bus network, and dashboard colors across the application.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <p className="text-sm font-semibold text-[#003E51]">Current category</p>
              <div className="mt-3 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: categoryMeta[user.userCategory].border, backgroundColor: categoryMeta[user.userCategory].soft, color: categoryMeta[user.userCategory].text }}>
                {categoryMeta[user.userCategory].label}
              </div>
              <h3 className="mt-7 text-2xl font-semibold text-[#003E51]">Choose your permit category</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Pick the full category directly instead of entering gender or residency separately.</p>
              <div className="mt-4 rounded-[30px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] p-4 md:p-5">
                <PermitSelector value={user.userCategory} onChange={selectCategory} appearance="register" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label">
                  Full name <span className="text-rose-600">*</span>
                </label>
                <input className="field mt-3" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div>
                <label className="label">
                  Student ID <span className="text-rose-600">*</span>
                </label>
                <input className="field mt-3" value={studentId} onChange={(event) => setStudentId(event.target.value)} required />
              </div>
              <div>
                <label className="label">
                  Email <span className="text-rose-600">*</span>
                </label>
                <input className="field mt-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div>
                <label className="label">
                  Password <span className="text-rose-600">*</span>
                </label>
                <input className="field mt-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Preferred academic buildings</label>
              <p className="mt-2 text-sm text-slate-500">Optional. Choose up to 5 academic destinations from the campus building list.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {buildingFieldLabels.map((label, index) => (
                  <div key={label}>
                    <label className="label">{label}</label>
                    <select className="field mt-3" value={buildings[index] ?? ""} onChange={(event) => updateBuilding(index, event.target.value)}>
                      <option value="">Select a building</option>
                      {academicBuildingOptions.map((option) => (
                        <option key={`${label}-${option}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="inline-flex rounded-full bg-[#007a4d] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,133,64,0.18)]">
                Create demo account
              </button>
              <Link href="/login" className="inline-flex rounded-full border border-[#d6e6dc] px-6 py-3 text-sm font-semibold text-[#003E51]">
                Back to login
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
