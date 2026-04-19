import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const highlights = [
  "Find legal parking faster and reduce time spent searching for a space",
  "Prevent parking violations with permit-aware rules and timely warnings",
  "Reduce unnecessary driving on campus and support lower carbon emissions",
  "Enjoy campus life more with smoother parking, bus access, and trip planning"
];

const permitShowcase = [
  { src: "/permits/resident-male.png", alt: "Resident male permit", label: "Resident Male" },
  { src: "/permits/non-resident-male.png", alt: "Non-resident male permit", label: "Non-Resident Male" },
  { src: "/permits/resident-female.png", alt: "Resident female permit", label: "Resident Female" },
  { src: "/permits/non-resident-female.png", alt: "Non-resident female permit", label: "Non-Resident Female" }
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#008540_0%,#017652_30%,#0c6a5c_100%)] px-4 py-8 lg:px-6 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/15 bg-white shadow-[0_40px_140px_rgba(0,62,81,0.26)] lg:grid-cols-[1.15fr_0.95fr]">
        <section className="bg-[linear-gradient(180deg,#0b4f6c_0%,#0a6a5b_58%,#0b7b5b_100%)] p-8 text-white lg:p-12">
          <div className="inline-flex rounded-[28px] bg-white px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <BrandLogo compact />
          </div>
          <p className="mt-10 text-sm uppercase tracking-[0.38em] text-[#d6f7e2]">Student Login</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight lg:text-6xl">ParkWise - KFUPM Mobility App</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Enter KFUPM ParkWise to explore category-based parking access, bus route guidance, live session monitoring, and compliance alerts in one premium university mobility platform.
          </p>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {permitShowcase.map((item) => (
              <div key={item.alt} className="rounded-[24px] border border-white/20 bg-white/8 p-2 backdrop-blur">
                <Image src={item.src} alt={item.alt} width={92} height={116} className="mx-auto h-[92px] w-[76px] object-contain" />
                <p className="mt-2 text-center text-[11px] font-medium leading-4 text-white/88 lg:text-xs">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="rounded-[28px] border border-white/25 bg-white/6 p-5 text-lg font-medium leading-8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm uppercase tracking-[0.34em] text-[#008540]">Student Login</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black">ParkWise - KFUPM Mobility App</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Use the student sign-in below to enter the connected KFUPM mobility experience and continue with your permit-aware parking journey.
            </p>
            <form className="mt-10 space-y-5">
              <div>
                <label className="label">Student Name</label>
                <input className="field mt-3 rounded-[22px] border-slate-200 bg-[#fdfefe] px-5 py-4" defaultValue="Omar Al-Mutairi" />
              </div>
              <div>
                <label className="label">Student ID</label>
                <input className="field mt-3 rounded-[22px] border-slate-200 bg-[#fdfefe] px-5 py-4" defaultValue="20210233" />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="field mt-3 rounded-[22px] border-slate-200 bg-[#fdfefe] px-5 py-4" type="password" defaultValue="demo-password" />
              </div>
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-[22px] bg-[#007a4d] px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(0,133,64,0.22)] transition hover:bg-[#006c44]"
              >
              Login to KFUPM ParkWise
              </Link>
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link href="/forgot-password" className="text-slate-500 transition hover:text-[#003E51]">
                Forgot password?
              </Link>
              <Link href="/register" className="rounded-full border border-[#d7e7de] px-4 py-2 font-semibold text-[#003E51] transition hover:border-[#008540] hover:text-[#008540]">
                Create account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
