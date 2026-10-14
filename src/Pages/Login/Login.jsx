import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => navigate("/Dashboard"), 800);
  };

  return (
    <main className="login-canvas flex min-h-screen w-full items-center justify-center p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden min-h-[620px] flex-col justify-between bg-linear-to-br from-blue-600 via-blue-700 to-blue-950 p-10 text-white lg:flex">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-white/20 p-3"><ShieldCheck className="h-7 w-7" /></div><span className="text-2xl font-bold">GTRACK-MES</span></div>
          <div><p className="text-sm font-semibold tracking-widest text-blue-100">SMART SAFETY MONITORING</p><h1 className="mt-4 text-4xl font-bold leading-tight">A safer workplace starts with clear visibility.</h1><p className="mt-5 max-w-sm text-blue-100">Monitor cameras, investigate events, and respond to safety alerts from one place.</p></div>
          <p className="text-sm text-blue-100">© 2026 GTRACK-MES. All rights reserved.</p>
        </div>

        <div className="flex min-h-[620px] items-center p-7 sm:p-12">
          <div className="w-full">
            <div className="mb-10 lg:hidden"><div className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-2 text-blue-700"><ShieldCheck className="h-5 w-5" /><span className="font-bold">GTRACK-MES</span></div></div>
            <p className="text-sm font-semibold text-blue-600">WELCOME BACK</p><h2 className="mt-2 text-3xl font-bold text-slate-800">Sign in to your account</h2><p className="mt-3 text-slate-500">Enter your details to access the monitoring dashboard.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">Email address<div className="relative mt-2"><Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input required type="email" placeholder="admin@gtrack-mes.com" className="w-full rounded-xl border  py-3 pl-12 pr-4 font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div></label>
              <label className="block text-sm font-semibold text-slate-700">Password<div className="relative mt-2"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input required type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full rounded-xl border  py-3 pl-12 pr-12 font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
              <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-blue-600" /> Remember me</label><button type="button" className="font-semibold text-blue-600 hover:text-blue-700">Forgot password?</button></div>
              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700  cursor-pointer">
                {isLoading ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Signing in...</> : <><LogIn className="h-5 w-5" /> Sign In</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
