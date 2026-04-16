import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_24px_100px_rgba(15,23,42,0.12)]">
        <h1 className="text-3xl font-semibold text-slate-950">Reset password</h1>
        <p className="mt-3 text-sm text-slate-500">This demo flow shows how password recovery would fit into the production app.</p>
        <div className="mt-6">
          <label className="label">University email</label>
          <input className="field" placeholder="student@kfupm.edu.sa" />
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Send reset link</Link>
          <Link href="/login" className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950">Back</Link>
        </div>
      </div>
    </main>
  );
}
