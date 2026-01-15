"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { BackgroundRippleEffect } from "../../components/ui/background-ripple-effect";
import "@/lib/firebase";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[0-9]/, "Password must contain one number"),
});

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = registerSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created successfully");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace("Firebase:", "").trim());
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ---------- BACKGROUND ---------- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fbff] via-white to-[#eef4ff]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.15),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(147,197,253,0.2),transparent_40%)]" />
      {/* Ripple Effect Layer */}
      <div className="absolute inset-0 z-0">
        <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />
      </div>
      <div className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute top-1/4 -right-48 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[140px]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.35\"/></svg>')",
        }}
      />

      {/* ---------- CARD ---------- */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-8 ring-1 ring-white/60">
        <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Join the Prizm AI platform
        </p>

        <form onSubmit={handleRegister} className="space-y-5 mt-6">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye Off */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.014 6 9.75 6 1.797 0 3.49-.427 4.97-1.177M6.228 6.228A9.956 9.956 0 0 1 12 4.5c3.736 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.272 1.977M6.228 6.228l11.544 11.544M6.228 6.228 3 3m15 15-3-3"
                    />
                  </svg>
                ) : (
                  /* Eye */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12c2.083-3.61 6.014-6 9.75-6s7.667 2.39 9.75 6c-2.083 3.61-6.014 6-9.75 6s-7.667-2.39-9.75-6Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>


          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
              {success}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-900 px-8 py-3 text-lg font-semibold text-white shadow-xl shadow-blue-900/25 transition-all hover:opacity-95 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
