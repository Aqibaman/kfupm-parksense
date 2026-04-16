import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_24px_100px_rgba(15,23,42,0.12)] lg:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Registration</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">Create your KFUPM ParkSense profile</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            "Full name",
            "Student ID",
            "Email",
            "Password",
            "Gender",
            "Resident or non-resident",
            "Preferred class building 1",
            "Preferred class building 2"
          ].map((field) => (
            <div key={field}>
              <label className="label">{field}</label>
              <input className="field" placeholder={field} />
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500">The system maps gender and residency into one of the four official parking categories, with manual profile updates supported later.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/profile-completion" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Continue profile setup</Link>
          <Link href="/login" className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950">Back to login</Link>
        </div>
      </div>
    </main>
  );
}
