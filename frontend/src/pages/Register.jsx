import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  UserPlus,
  User,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  Sparkles,
  Route,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // UI-only state
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/explore');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordReady = formData.password.length >= 6;

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#f6f3ed] dark:bg-stone-950">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-[420px] w-[420px] rounded-full bg-amber-300/20 blur-[120px] dark:bg-amber-500/5" />
        <div className="absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-orange-300/15 blur-[120px] dark:bg-orange-500/5" />
      </div>

      <div
        className="
          relative z-10 mx-auto grid min-h-[calc(100vh-72px)]
          max-w-[1450px] grid-cols-1
          items-center gap-8 px-4 py-8
          sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8
        "
      >
        {/* =====================================================
            LEFT VISUAL PANEL
        ===================================================== */}

        <section
          className="
            relative hidden min-h-[620px] overflow-hidden
            rounded-[34px]
            border border-white/10
            bg-cover bg-center
            shadow-[0_28px_80px_rgba(67,39,16,.20)]
            lg:block
          "
          style={{
            backgroundImage: "url('/explore-bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/76 to-black/48" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-black/20" />
          <div className="absolute -left-24 top-12 h-[360px] w-[360px] rounded-full bg-amber-500/10 blur-[120px]" />

          <div
            className="
              pointer-events-none absolute inset-0 opacity-[0.06]
              [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
              [background-size:42px_42px]
            "
          />

          <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between p-9 xl:p-11">
            <div className="max-w-2xl">
              <div
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-white/15
                  bg-white/[0.06]
                  px-4 py-2
                  text-[9px] font-black uppercase
                  tracking-[0.14em]
                  text-amber-200
                  backdrop-blur-xl
                "
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Join RajaRata DayTrail
              </div>

              <h1
                className="
                  mt-6 max-w-xl
                  text-[44px] font-black
                  leading-[1.02]
                  tracking-[-0.045em]
                  text-white
                  drop-shadow-[0_8px_30px_rgba(0,0,0,.35)]
                  xl:text-[54px]
                "
              >
                Build your day.
                <span
                  className="
                    mt-2 block
                    bg-gradient-to-r
                    from-amber-300
                    via-amber-400
                    to-orange-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  Keep every plan ready.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[13px] leading-7 text-stone-300 xl:text-sm">
                Create a tourist account to save itineraries, revisit your
                selected attractions and continue planning future
                Anuradhapura day visits.
              </p>
            </div>

            <div
              className="
                rounded-[24px]
                border border-white/10
                bg-black/28
                p-4
                shadow-[0_16px_40px_rgba(0,0,0,.20)]
                backdrop-blur-2xl
              "
            >
              <div className="grid grid-cols-3 divide-x divide-white/10">
                <div className="px-3 first:pl-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div className="mt-3 text-[12px] font-black text-white">
                    Tourist account
                  </div>

                  <div className="mt-1 text-[9px] leading-4 text-stone-400">
                    Save and revisit plans
                  </div>
                </div>

                <div className="px-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="mt-3 text-[12px] font-black text-white">
                    Curated places
                  </div>

                  <div className="mt-1 text-[9px] leading-4 text-stone-400">
                    Explore verified attractions
                  </div>
                </div>

                <div className="px-4 pr-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                    <Route className="h-4 w-4" />
                  </div>

                  <div className="mt-3 text-[12px] font-black text-white">
                    Smart planner
                  </div>

                  <div className="mt-1 text-[9px] leading-4 text-stone-400">
                    Build a practical day route
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            REGISTER CARD
        ===================================================== */}

        <section className="mx-auto w-full max-w-[520px]">
          <div
            className="
              relative overflow-hidden
              rounded-[30px]
              border border-white/80
              bg-white/95
              p-6
              shadow-[0_22px_60px_rgba(51,38,23,.12)]
              backdrop-blur-xl
              dark:border-stone-800
              dark:bg-stone-900/95
              sm:p-8
            "
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-amber-200/35 blur-3xl dark:bg-amber-500/5" />

            <div className="relative">
              {/* Mobile badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300 lg:hidden">
                <Sparkles className="h-3.5 w-3.5" />
                RajaRata DayTrail
              </div>

              {/* Header */}
              <div className="mb-7">
                <div
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br from-amber-400 to-orange-500
                    text-stone-950
                    shadow-[0_10px_24px_rgba(245,158,11,.22)]
                  "
                >
                  <UserPlus className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-[30px] font-black tracking-[-0.04em] text-stone-950 dark:text-white">
                  Create tourist account
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
                  Join RajaRata DayTrail to create and save custom day
                  itineraries.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="
                    mb-5 flex items-start gap-3
                    rounded-2xl
                    border border-red-200
                    bg-red-50
                    px-4 py-3
                    text-xs leading-5
                    text-red-700
                    dark:border-red-900
                    dark:bg-red-950/30
                    dark:text-red-300
                  "
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Kamal Perera"
                      className="
                        w-full rounded-2xl
                        border border-stone-200
                        bg-stone-50/80
                        py-3.5 pl-11 pr-4
                        text-sm font-medium text-stone-900
                        outline-none transition-all
                        placeholder:text-stone-400
                        hover:border-stone-300
                        focus:border-amber-400
                        focus:bg-white
                        focus:ring-4 focus:ring-amber-500/10
                        dark:border-stone-700
                        dark:bg-stone-950
                        dark:text-white
                        dark:hover:border-stone-600
                        dark:focus:border-amber-600
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="e.g. kamal@example.com"
                      className="
                        w-full rounded-2xl
                        border border-stone-200
                        bg-stone-50/80
                        py-3.5 pl-11 pr-4
                        text-sm font-medium text-stone-900
                        outline-none transition-all
                        placeholder:text-stone-400
                        hover:border-stone-300
                        focus:border-amber-400
                        focus:bg-white
                        focus:ring-4 focus:ring-amber-500/10
                        dark:border-stone-700
                        dark:bg-stone-950
                        dark:text-white
                        dark:hover:border-stone-600
                        dark:focus:border-amber-600
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                      Password
                    </label>

                    <span
                      className={`
                        inline-flex items-center gap-1 text-[9px] font-bold
                        ${
                          passwordReady
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-stone-400'
                        }
                      `}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Min 6 characters
                    </span>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="
                        w-full rounded-2xl
                        border border-stone-200
                        bg-stone-50/80
                        py-3.5 pl-11 pr-12
                        text-sm font-medium text-stone-900
                        outline-none transition-all
                        placeholder:text-stone-400
                        hover:border-stone-300
                        focus:border-amber-400
                        focus:bg-white
                        focus:ring-4 focus:ring-amber-500/10
                        dark:border-stone-700
                        dark:bg-stone-950
                        dark:text-white
                        dark:hover:border-stone-600
                        dark:focus:border-amber-600
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="
                        absolute right-3 top-1/2
                        flex h-8 w-8 -translate-y-1/2
                        items-center justify-center
                        rounded-lg
                        text-stone-400
                        transition
                        hover:bg-stone-100
                        hover:text-stone-700
                        dark:hover:bg-stone-800
                        dark:hover:text-stone-200
                      "
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group flex w-full items-center justify-center gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-amber-500 to-orange-500
                    px-5 py-3.5
                    text-sm font-black text-white
                    shadow-[0_12px_28px_rgba(217,119,6,.24)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_16px_34px_rgba(217,119,6,.32)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create Account
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="mt-6 border-t border-stone-200 pt-6 text-center dark:border-stone-800">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-black text-amber-700 transition hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-stone-400">
            Create your RajaRata DayTrail tourist account.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
