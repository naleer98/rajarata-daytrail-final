import React from 'react';
import { Link } from 'react-router-dom';

import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Route,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="overflow-hidden bg-white dark:bg-stone-950">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        className="
          relative flex min-h-[700px] items-center
          overflow-hidden
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: "url('/home-bg.jpg')",
        }}
      >
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/72 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/15" />

        {/* Warm atmospheric glows */}
        <div className="pointer-events-none absolute -left-24 top-[22%] h-[460px] w-[460px] rounded-full bg-amber-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[8%] h-[300px] w-[520px] rounded-full bg-orange-500/10 blur-[130px]" />

        {/* Fine grid overlay */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-[0.08]
            [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)]
            [background-size:42px_42px]
          "
        />

        {/* Main content */}
        <div
          className="
            relative z-10 mx-auto w-full max-w-[1600px]
            px-4 py-20
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          <div className="max-w-[930px]">
            {/* Badge */}
            <div
              className="
                mb-6 inline-flex items-center gap-2.5
                rounded-full
                border border-white/15
                bg-white/[0.07]
                px-4 py-2
                text-[11px] font-black uppercase
                tracking-[0.08em]
                text-amber-100
                shadow-[0_8px_30px_rgba(0,0,0,.18)]
                backdrop-blur-xl
              "
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
                <Compass className="h-3.5 w-3.5" />
              </span>
              Sacred City of Anuradhapura
              <span className="h-1 w-1 rounded-full bg-amber-300/70" />
              25 km Day Visit System
            </div>

            {/* Heading */}
            <h1
              className="
                max-w-[900px]
                text-[44px] font-black
                leading-[0.98]
                tracking-[-0.055em]
                text-white
                sm:text-[62px]
                lg:text-[76px]
                xl:text-[82px]
              "
            >
              Discover. Plan. Explore.
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
                Anuradhapura in One Day.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-7 max-w-[770px]
                text-sm leading-7
                text-stone-200/95
                sm:text-[17px] sm:leading-8
              "
            >
              A smart local day-visit planner with verified ancient stupas,
              sacred shrines, intelligent nearest-neighbor route sequencing,
              and opening-hour conflict warnings.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/planner"
                className="
                  group inline-flex items-center gap-3
                  rounded-2xl
                  bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500
                  px-6 py-3.5
                  text-sm font-black text-stone-950
                  shadow-[0_16px_38px_rgba(245,158,11,0.35)]
                  ring-1 ring-white/25
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_48px_rgba(245,158,11,0.45)]
                "
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/10">
                  <Sparkles className="h-4 w-4" />
                </span>
                Start Day Planner
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/explore"
                className="
                  group inline-flex items-center gap-3
                  rounded-2xl
                  border border-white/15
                  bg-white/[0.08]
                  px-6 py-3.5
                  text-sm font-black text-white
                  shadow-[0_12px_30px_rgba(0,0,0,.16)]
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-white/25
                  hover:bg-white/[0.13]
                "
              >
                <MapPin className="h-4 w-4 text-amber-300" />
                Browse 10 Verified Places
              </Link>
            </div>

            {/* Metrics */}
            <div
              className="
                mt-11 grid max-w-[780px]
                grid-cols-1 gap-3
                sm:grid-cols-3
              "
            >
              <div
                className="
                  group rounded-2xl
                  border border-white/10
                  bg-black/25
                  p-4
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-amber-300/25
                  hover:bg-black/35
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-white">
                      10+
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-stone-300">
                      Verified Sacred Sights
                    </div>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-amber-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div
                className="
                  group rounded-2xl
                  border border-white/10
                  bg-black/25
                  p-4
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-amber-300/25
                  hover:bg-black/35
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-white">
                      25 km
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-stone-300">
                      Discovery Radius
                    </div>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-amber-300">
                    <Navigation className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div
                className="
                  group rounded-2xl
                  border border-white/10
                  bg-black/25
                  p-4
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-amber-300/25
                  hover:bg-black/35
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-white">
                      1 Day
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-stone-300">
                      Smart Visit Planner
                    </div>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-amber-300">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                'Conflict-Aware Schedule Engine',
                'Cultural Etiquette Guidelines',
                'Verified Attraction Data',
              ].map((item) => (
                <div
                  key={item}
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    border border-white/10
                    bg-white/[0.05]
                    px-3 py-2
                    text-[10px] font-bold
                    text-stone-300
                    backdrop-blur-md
                  "
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom blend */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f8f5ef] to-transparent dark:from-stone-950" />
      </section>

      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section className="relative bg-[#f8f5ef] py-20 dark:bg-stone-950">
        {/* Background ambience */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[280px] w-[760px] -translate-x-1/2 rounded-full bg-amber-200/25 blur-[110px] dark:bg-amber-500/5" />

        <div
          className="
            relative mx-auto max-w-[1600px]
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* Heading */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div
              className="
                mx-auto inline-flex items-center gap-2
                rounded-full
                border border-amber-200
                bg-amber-50
                px-3 py-1.5
                text-[10px] font-black uppercase
                tracking-[0.16em]
                text-amber-700
                shadow-sm
                dark:border-amber-900/40
                dark:bg-amber-950/30
                dark:text-amber-300
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
              Core Features
            </div>

            <h2
              className="
                mt-4
                text-3xl font-black
                tracking-[-0.045em]
                text-stone-950
                sm:text-4xl
                lg:text-[44px]
                dark:text-white
              "
            >
              Designed for the Perfect
              <span className="ml-2 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Local Day Trip
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-500 dark:text-stone-400">
              Everything you need to experience the ancient royal capital
              without rushing or missing closing times.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Card 1 */}
            <div
              className="
                group relative overflow-hidden
                rounded-[28px]
                border border-white/80
                bg-white/90
                p-7
                shadow-[0_16px_45px_rgba(74,55,34,0.08)]
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-2
                hover:border-amber-200
                hover:shadow-[0_24px_55px_rgba(74,55,34,0.13)]
                dark:border-stone-800
                dark:bg-stone-900/90
              "
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-amber-200/35 blur-3xl dark:bg-amber-500/5" />

              <div className="relative">
                <div
                  className="
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    border border-amber-100
                    bg-amber-50
                    text-amber-700
                    shadow-sm
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:rotate-[-3deg]
                    dark:border-amber-900/40
                    dark:bg-amber-950/30
                    dark:text-amber-400
                  "
                >
                  <MapPin className="h-6 w-6" />
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">
                    Verified Data
                  </span>
                  <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
                    Local Catalog
                  </span>
                </div>

                <h3 className="mt-2 text-[20px] font-black tracking-[-0.025em] text-stone-950 dark:text-white">
                  Verified Local Catalogue
                </h3>

                <p className="mt-3 text-[13px] leading-7 text-stone-600 dark:text-stone-400">
                  Curated locations within 25 km of Anuradhapura city with exact
                  coordinates, verified opening hours, and mandatory cultural
                  dress code guidance.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="
                group relative overflow-hidden
                rounded-[28px]
                border border-white/80
                bg-white/90
                p-7
                shadow-[0_16px_45px_rgba(74,55,34,0.08)]
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-2
                hover:border-orange-200
                hover:shadow-[0_24px_55px_rgba(74,55,34,0.13)]
                dark:border-stone-800
                dark:bg-stone-900/90
              "
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-orange-300 via-orange-500 to-rose-400" />
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-orange-200/35 blur-3xl dark:bg-orange-500/5" />

              <div className="relative">
                <div
                  className="
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    border border-orange-100
                    bg-orange-50
                    text-orange-700
                    shadow-sm
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:rotate-[3deg]
                    dark:border-orange-900/40
                    dark:bg-orange-950/30
                    dark:text-orange-400
                  "
                >
                  <Clock className="h-6 w-6" />
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.14em] text-orange-700 dark:text-orange-400">
                    Time Smart
                  </span>
                  <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
                    Conflict Detection
                  </span>
                </div>

                <h3 className="mt-2 text-[20px] font-black tracking-[-0.025em] text-stone-950 dark:text-white">
                  Conflict-Aware Engine
                </h3>

                <p className="mt-3 text-[13px] leading-7 text-stone-600 dark:text-stone-400">
                  Computes your estimated arrival time at each attraction and
                  automatically alerts you if a sacred site will close before
                  you get there.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="
                group relative overflow-hidden
                rounded-[28px]
                border border-white/80
                bg-white/90
                p-7
                shadow-[0_16px_45px_rgba(74,55,34,0.08)]
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-2
                hover:border-emerald-200
                hover:shadow-[0_24px_55px_rgba(74,55,34,0.13)]
                dark:border-stone-800
                dark:bg-stone-900/90
              "
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-500" />
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/5" />

              <div className="relative">
                <div
                  className="
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    border border-emerald-100
                    bg-emerald-50
                    text-emerald-700
                    shadow-sm
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:rotate-[-3deg]
                    dark:border-emerald-900/40
                    dark:bg-emerald-950/30
                    dark:text-emerald-400
                  "
                >
                  <Route className="h-6 w-6" />
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
                    Smart Routing
                  </span>
                  <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
                    Flexible Pace
                  </span>
                </div>

                <h3 className="mt-2 text-[20px] font-black tracking-[-0.025em] text-stone-950 dark:text-white">
                  Pace-Adapted Routing
                </h3>

                <p className="mt-3 text-[13px] leading-7 text-stone-600 dark:text-stone-400">
                  Select Relaxed, Balanced, or Fast travel pace. The system
                  orders stops using nearest-neighbor logic to minimize travel
                  fatigue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
