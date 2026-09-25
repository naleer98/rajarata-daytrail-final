import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  MapPinned,
  Route,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  MapPin,
} from 'lucide-react';

const steps = [
  {
    no: '01',
    title: 'Explore verified places',
    description:
      'Browse recorded opening hours, entry fees, facilities and visitor guidance for each attraction.',
    icon: Compass,
  },
  {
    no: '02',
    title: 'Check locations on the map',
    description:
      'See each attraction on the interactive map and understand where it sits around Anuradhapura.',
    icon: MapPinned,
  },
  {
    no: '03',
    title: 'Build your day plan',
    description:
      'Choose your preferred places, starting time and travel pace before generating a route.',
    icon: Route,
  },
  {
    no: '04',
    title: 'Review timing & warnings',
    description:
      'Check the suggested route, estimated timings and opening-hour warnings before travelling.',
    icon: Clock3,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#f6f3ed] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative min-h-[420px] overflow-hidden
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: "url('/home-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/78 to-black/38" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/92 via-black/35 to-transparent" />
        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[130px]" />

        <div
          className="
            relative z-10 mx-auto flex min-h-[420px] max-w-[1600px]
            items-center px-4 py-14
            sm:px-6 lg:px-8 xl:px-10
          "
        >
          <div className="max-w-4xl">
            <div
              className="
                mb-5 inline-flex items-center gap-2
                rounded-full border border-white/15
                bg-white/[0.06]
                px-4 py-2
                text-[10px] font-black uppercase
                tracking-[0.14em]
                text-amber-200
                backdrop-blur-xl
              "
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              About RajaRata DayTrail
            </div>

            <h1
              className="
                max-w-4xl
                text-[42px] font-black leading-[1.02]
                tracking-[-0.05em]
                text-white
                drop-shadow-[0_6px_20px_rgba(0,0,0,.4)]
                sm:text-[58px]
                lg:text-[62px]
              "
            >
              Plan Anuradhapura
              <span
                className="
                  mt-2 block
                  bg-gradient-to-r
                  from-amber-300 via-amber-400 to-orange-500
                  bg-clip-text text-transparent
                "
              >
                With Better Local Context.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-stone-100/95 sm:text-[15px]">
              RajaRata DayTrail brings together places, visitor information and
              a one-day planner for exploring the Anuradhapura area. Browse
              religious, heritage and nature locations, check their details and
              choose the stops that suit your day.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified visitor information
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-amber-300" />
                Anuradhapura day-visit focus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
        {/* Intro card */}
        <section
          className="
            relative overflow-hidden rounded-[28px]
            border border-white/80
            bg-white/95
            p-6
            shadow-[0_16px_45px_rgba(51,38,23,.08)]
            backdrop-blur-xl
            dark:border-stone-800
            dark:bg-stone-900/95
            sm:p-8
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/5" />

          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                Why this platform exists
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-stone-950 dark:text-white sm:text-3xl">
                A simpler way to understand and plan a local day visit
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-400">
                The platform keeps essential visitor information, attraction
                details, map locations and one-day planning tools in one place
                so you can make a clearer visit plan before travelling.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['25 km', 'Planning radius'],
                ['1 Day', 'Trip focus'],
                ['3+', 'Core attraction types'],
                ['Map + Route', 'Planning tools'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="
                    rounded-2xl border border-stone-200/80
                    bg-[#faf8f3] p-4
                    dark:border-stone-800
                    dark:bg-stone-950
                  "
                >
                  <div className="text-xl font-black text-stone-950 dark:text-white">
                    {value}
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-stone-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan steps */}
        <section>
          <div className="mb-5">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
              Plan your visit
            </div>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-stone-950 dark:text-white sm:text-3xl">
              Four clear steps from discovery to itinerary
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.no}
                  className="
                    group relative overflow-hidden
                    rounded-[24px]
                    border border-stone-200/80
                    bg-white p-5
                    shadow-[0_12px_35px_rgba(51,38,23,.06)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-amber-200
                    hover:shadow-[0_18px_45px_rgba(51,38,23,.10)]
                    dark:border-stone-800
                    dark:bg-stone-900
                  "
                >
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">
                      Step {step.no}
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-[16px] font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[12px] leading-6 text-stone-500 dark:text-stone-400">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Estimate explanation */}
        <section
          className="
            grid grid-cols-1 gap-5
            lg:grid-cols-[1.15fr_.85fr]
          "
        >
          <div
            className="
              rounded-[26px]
              border border-amber-200/80
              bg-gradient-to-br
              from-amber-50 via-white to-orange-50/50
              p-6
              shadow-[0_12px_35px_rgba(180,83,9,.06)]
              dark:border-amber-900/40
              dark:from-amber-950/20
              dark:via-stone-900
              dark:to-orange-950/10
            "
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm ring-1 ring-amber-200 dark:bg-stone-950 dark:text-amber-300 dark:ring-amber-900/40">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                  Understand the estimates
                </div>

                <h2 className="mt-1 text-xl font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                  Route and travel times are planning estimates
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-stone-700 dark:text-stone-300">
              Distances use straight-line coordinates from the configured home
              reference. Travel times are estimates, not live traffic
              predictions. The nearest-next-place route is practical and is not
              guaranteed to be the shortest road route.
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200/70 bg-white/80 px-4 py-3 text-xs leading-6 text-amber-950 dark:border-amber-900/40 dark:bg-stone-950/50 dark:text-amber-100">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Confirm current opening hours, fees and visitor rules before
              travelling.
            </div>
          </div>

          <div
            className="
              rounded-[26px]
              border border-stone-200/80
              bg-white p-6
              shadow-[0_12px_35px_rgba(51,38,23,.06)]
              dark:border-stone-800
              dark:bg-stone-900
            "
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 text-white dark:bg-white dark:text-stone-950">
              <Info className="h-4 w-4" />
            </div>

            <h3 className="mt-4 text-lg font-black tracking-[-0.02em] text-stone-950 dark:text-white">
              Information & planning only
            </h3>

            <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-400">
              The system focuses on attraction information and day-visit
              planning. It does not provide bookings or payments.
            </p>

            <div className="mt-5 rounded-2xl bg-stone-50 p-4 dark:bg-stone-950">
              <div className="text-[10px] font-black uppercase tracking-[0.13em] text-stone-400">
                Best use
              </div>
              <p className="mt-2 text-xs leading-6 text-stone-600 dark:text-stone-400">
                Use the platform to compare places, check location context and
                create a practical one-day itinerary before your trip.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="
            relative overflow-hidden
            rounded-[28px]
            bg-gradient-to-br
            from-[#17120e] via-stone-900 to-[#4a2106]
            p-6 text-white
            shadow-[0_20px_55px_rgba(28,25,23,.18)]
            sm:p-8
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-[100px]" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-400">
                Ready to start?
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                Discover places and build your day
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">
                Browse the verified attraction catalogue or move directly into
                the one-day planner.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="
                  inline-flex items-center gap-2
                  rounded-2xl
                  bg-white px-5 py-3
                  text-xs font-black text-stone-950
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-amber-50
                "
              >
                Explore Places
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/planner"
                className="
                  inline-flex items-center gap-2
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.08]
                  px-5 py-3
                  text-xs font-black text-white
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-white/[0.13]
                "
              >
                Start Day Planner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
