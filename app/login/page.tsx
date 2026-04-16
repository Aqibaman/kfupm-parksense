import Link from "next/link";
import { appName } from "@/lib/constants";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f2f7f4_100%)] px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(0,62,81,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-[#f3f7f8] p-8 text-[#003E51] lg:p-12">
          <BrandLogo />
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#008540]">Student Login</p>
          <h1 className="mt-4 text-5xl font-semibold">{appName}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">Access live parking availability, bus routes, session timers, and category-based rules from one serious mobility workspace.</p>
        </section>
        <section className="p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-3xl font-semibold text-black">Enter the demo</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Use any seeded user profile and continue into the responsive dashboard.</p>
            <form className="mt-8 space-y-5">
              <div>
                <label className="label">Email</label>
                <input className="field" defaultValue="omar.mutairi@kfupm.edu.sa" />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="field" type="password" defaultValue="demo-password" />
              </div>
              <Link href="/dashboard" className="inline-flex w-full items-center justify-center rounded-2xl bg-[#008540] px-4 py-3 text-sm font-semibold text-white">
                Login to dashboard
              </Link>
            </form>
            <div className="mt-5 flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-slate-500">Forgot password?</Link>
              <Link href="/register" className="font-semibold text-[#003E51]">Create account</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
