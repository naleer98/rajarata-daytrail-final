import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  GraduationCap,
  Landmark,
  ArrowUpRight,
} from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer
      className="
        relative mt-auto overflow-hidden
        border-t border-stone-800/80
        bg-[#151210]
        text-stone-300
      "
    >
      {/* Decorative Top Glow */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-0
          h-[220px] w-[700px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-amber-500/[0.05]
          blur-[90px]
        "
      />

      {/* Top Accent Line */}
      <div
        className="
          absolute left-1/2 top-0
          h-px w-[70%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-amber-500/40
          to-transparent
        "
      />

      <div className="relative mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-14">
          {/* ================= BRAND ================= */}

          <div>
            <Link
              to="/"
              className="
                group inline-flex items-center gap-3
                rounded-2xl
                transition-all duration-300
              "
            >
              <div
                className="
                  transition-transform duration-300
                  group-hover:-translate-y-0.5
                  group-hover:scale-[1.03]
                "
              >
                <Logo size="sm" />
              </div>

              <div>
                <div
                  className="
                    text-[19px] font-black
                    tracking-[-0.035em]
                    text-white
                  "
                >
                  RajaRata
                  <span
                    className="
                      ml-1.5
                      bg-gradient-to-r
                      from-amber-400
                      via-orange-400
                      to-orange-500
                      bg-clip-text
                      text-transparent
                    "
                  >
                    DayTrail
                  </span>
                </div>

                <div
                  className="
                    mt-1
                    text-[9px] font-bold
                    uppercase
                    tracking-[0.18em]
                    text-stone-500
                  "
                >
                  Anuradhapura Visit Planner
                </div>
              </div>
            </Link>

            <p
              className="
                mt-5 max-w-[470px]
                text-[14px] leading-7
                text-stone-400
              "
            >
              A smart, responsive local tourist day-visit planning system for
              Anuradhapura, Sri Lanka. Discover ancient heritage, sacred shrines,
              and scenic landscapes within a 25 km radius.
            </p>

            {/* About Link */}
            <Link
              to="/about"
              className="
                group mt-5 inline-flex items-center gap-2
                rounded-xl
                border border-amber-500/15
                bg-amber-500/[0.07]
                px-4 py-2.5
                text-xs font-bold
                text-amber-400
                transition-all duration-300

                hover:-translate-y-0.5
                hover:border-amber-500/30
                hover:bg-amber-500/[0.12]
                hover:text-amber-300
              "
            >
              About Anuradhapura Day Visits

              <ArrowUpRight
                className="
                  h-3.5 w-3.5
                  transition-transform duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>

          {/* ================= CULTURAL NOTE ================= */}

          <div>
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-amber-500/10
                  bg-gradient-to-br
                  from-amber-500/15
                  to-orange-500/[0.05]
                  text-amber-400
                  shadow-[0_8px_30px_rgba(245,158,11,0.05)]
                "
              >
                <Landmark className="h-[18px] w-[18px]" />
              </div>

              <div>
                <h4
                  className="
                    text-[13px] font-black
                    uppercase tracking-[0.1em]
                    text-stone-100
                  "
                >
                  Cultural Heritage
                </h4>

                <p className="mt-0.5 text-[10px] font-medium text-stone-600">
                  Visitor etiquette
                </p>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border border-stone-800/80
                bg-white/[0.025]
                p-5
                transition-all duration-300
                hover:border-amber-500/15
                hover:bg-white/[0.035]
              "
            >
              <p className="text-[13px] leading-7 text-stone-400">
                Anuradhapura is a UNESCO World Heritage sacred city. When
                visiting ancient sites, please wear respectful white or modest
                attire covering shoulders and knees, and remove footwear at
                sacred precincts.
              </p>
            </div>
          </div>

          {/* ================= ACADEMIC CONTEXT ================= */}

          <div>
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-amber-500/10
                  bg-gradient-to-br
                  from-amber-500/15
                  to-orange-500/[0.05]
                  text-amber-400
                  shadow-[0_8px_30px_rgba(245,158,11,0.05)]
                "
              >
                <GraduationCap className="h-[18px] w-[18px]" />
              </div>

              <div>
                <h4
                  className="
                    text-[13px] font-black
                    uppercase tracking-[0.1em]
                    text-stone-100
                  "
                >
                  Academic Context
                </h4>

                <p className="mt-0.5 text-[10px] font-medium text-stone-600">
                  Project information
                </p>
              </div>
            </div>

            <div
              className="
                overflow-hidden rounded-2xl
                border border-stone-800/80
                bg-white/[0.025]
              "
            >
              {/* Module */}
              <div
                className="
                  flex gap-4
                  border-b border-stone-800/70
                  px-5 py-3.5
                "
              >
                <span
                  className="
                    w-[72px] shrink-0
                    text-[11px] font-bold
                    uppercase tracking-[0.08em]
                    text-stone-600
                  "
                >
                  Module
                </span>

                <span className="text-[12px] font-medium text-stone-300">
                  ITE2953 - Programming Group Project 25S1
                </span>
              </div>

              {/* Institution */}
              <div
                className="
                  flex gap-4
                  border-b border-stone-800/70
                  px-5 py-3.5
                "
              >
                <span
                  className="
                    w-[72px] shrink-0
                    text-[11px] font-bold
                    uppercase tracking-[0.08em]
                    text-stone-600
                  "
                >
                  Institute
                </span>

                <span className="text-[12px] font-medium text-stone-300">
                  University of Moratuwa
                </span>
              </div>

              {/* Student */}
              <div className="flex gap-4 px-5 py-3.5">
                <span
                  className="
                    w-[72px] shrink-0
                    text-[11px] font-bold
                    uppercase tracking-[0.08em]
                    text-stone-600
                  "
                >
                  Student
                </span>

                <span className="text-[12px] font-medium text-stone-300">
                  Naleer Khan
                  <span className="ml-1 text-stone-500">
                    (Reg: E2410076)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div
          className="
            mt-10
            border-t border-stone-800/80
            pt-6
          "
        >
          <div
            className="
              flex flex-col
              items-center justify-between
              gap-4
              text-center
              sm:flex-row
              sm:text-left
            "
          >
            {/* Copyright */}
            <div className="text-[11px] font-medium text-stone-600">
              © 2026{' '}
              <span className="font-semibold text-stone-500">
                RajaRata DayTrail
              </span>
              . Built for ITE2953.
            </div>

            {/* Right Info */}
            <div
              className="
                flex flex-wrap
                items-center justify-center
                gap-3
                sm:justify-end
              "
            >
              <div
                className="
                  flex items-center gap-2
                  rounded-full
                  border border-stone-800
                  bg-white/[0.025]
                  px-3 py-2
                  text-[11px] font-medium
                  text-stone-500
                "
              >
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                Anuradhapura, Sri Lanka
              </div>

              <div
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-full
                  border border-stone-800
                  bg-white/[0.025]
                "
                title="Made with care"
              >
                <Heart
                  className="
                    h-3.5 w-3.5
                    fill-amber-500
                    text-amber-500
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;