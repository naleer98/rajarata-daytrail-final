import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

import {
  Bookmark,
  Clock,
  Trash2,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Compass,
  Route,
  CalendarDays,
  Navigation,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TimerReset,
  MapPinned,
} from 'lucide-react';

const SavedPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePlan, setActivePlan] = useState(null);

  // =========================================================
  // FETCH SAVED PLANS
  // =========================================================

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await API.get('/itineraries/my-plans');

      setPlans(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch saved itineraries:', err);

      setError('Failed to fetch your saved itineraries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // =========================================================
  // DELETE PLAN
  // =========================================================

  const handleDeletePlan = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this itinerary?'
      )
    ) {
      return;
    }

    try {
      await API.delete(`/itineraries/${id}`);

      setPlans((currentPlans) =>
        currentPlans.filter((plan) => plan._id !== id)
      );

      if (activePlan?._id === id) {
        setActivePlan(null);
      }
    } catch (err) {
      console.error('Failed to delete itinerary:', err);

      alert('Failed to delete itinerary.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3ed] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative min-h-[390px] overflow-hidden
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: "url('/savedplans-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/77 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/92 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[130px]" />

        <div
          className="
            relative z-10 mx-auto flex min-h-[390px] max-w-[1600px]
            items-center px-4 py-12
            sm:px-6 lg:px-8 xl:px-10
          "
        >
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div
                className="
                  mb-5 inline-flex items-center gap-2
                  rounded-full border border-white/15
                  bg-white/[0.06] px-4 py-2
                  text-[10px] font-black uppercase tracking-[0.14em]
                  text-amber-200 backdrop-blur-xl
                "
              >
                <Bookmark className="h-4 w-4 text-amber-400" />
                Your Saved Journeys
              </div>

              <h1
                className="
                  max-w-3xl text-[42px] font-black leading-[1.02]
                  tracking-[-0.05em] text-white
                  drop-shadow-[0_6px_20px_rgba(0,0,0,.4)]
                  sm:text-[58px] lg:text-[62px]
                "
              >
                Revisit Your Plans.
                <span
                  className="
                    mt-2 block bg-gradient-to-r
                    from-amber-300 via-amber-400 to-orange-500
                    bg-clip-text text-transparent
                  "
                >
                  Continue Your Journey.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-stone-100/95 sm:text-[15px]">
                Review your personalized Anuradhapura day trips, check route
                schedules and manage the itineraries you have saved for future
                visits.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Saved to your account
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                  <MapPinned className="h-3.5 w-3.5 text-amber-300" />
                  Route & timing review
                </span>
              </div>
            </div>

            {/* Overview */}
            <div
              className="
                w-full max-w-[360px]
                rounded-[26px] border border-white/10
                bg-black/42 p-5
                shadow-[0_22px_55px_rgba(0,0,0,.28)]
                backdrop-blur-xl
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.17em] text-amber-300">
                    Journey Library
                  </div>
                  <div className="mt-1 text-xs text-stone-400">
                    Saved planning snapshot
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-950">
                  <Route className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-black text-white">
                    {plans.length}
                  </div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Saved
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-black text-white">
                    1 Day
                  </div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Format
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-black text-white">
                    25 km
                  </div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Radius
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-amber-500 border-t-transparent" />

            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
              Loading your saved journeys...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-[26px] border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-600" />

            <p className="mt-3 text-sm font-bold text-red-700 dark:text-red-300">
              {error}
            </p>

            <button
              onClick={fetchPlans}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white"
            >
              Try Again
            </button>
          </div>
        ) : plans.length === 0 ? (
          /* =================================================
              EMPTY STATE
          ================================================= */

          <div
            className="
              relative overflow-hidden rounded-[30px]
              border border-stone-200/80
              bg-white px-6 py-16 text-center
              shadow-[0_16px_45px_rgba(51,38,23,.07)]
              dark:border-stone-800 dark:bg-stone-900
            "
          >
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/40 blur-[100px] dark:bg-amber-900/10" />

            <div className="relative z-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700 shadow-sm dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                <Compass className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                Your journey library is empty
              </h3>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-stone-500">
                Use the One-Day Visit Planner to choose your favourite
                Anuradhapura sights, calculate a practical route and save your
                first itinerary here.
              </p>

              <Link
                to="/planner"
                className="
                  group mt-6 inline-flex items-center gap-2
                  rounded-2xl bg-gradient-to-r
                  from-amber-500 to-orange-500
                  px-6 py-3 text-xs font-black text-white
                  shadow-[0_12px_28px_rgba(217,119,6,.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_16px_34px_rgba(217,119,6,.30)]
                "
              >
                <CalendarDays className="h-4 w-4" />
                Create Your First Plan
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          /* =================================================
              SAVED PLANS WORKSPACE
          ================================================= */

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[370px_minmax(0,1fr)] lg:items-start">
            {/* =================================================
                LEFT: PLAN LIBRARY
            ================================================= */}

            <aside
              className="
                h-fit rounded-[28px]
                border border-stone-200/80
                bg-white/95 p-5
                shadow-[0_16px_45px_rgba(51,38,23,.08)]
                backdrop-blur-xl
                dark:border-stone-800 dark:bg-stone-900/95
                lg:sticky lg:top-24
              "
            >
              <div className="flex items-end justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
                    Your Journeys
                  </div>

                  <h2 className="mt-1 text-[20px] font-black tracking-[-0.03em] text-stone-950 dark:text-white">
                    Saved Itineraries
                  </h2>
                </div>

                <div className="rounded-full bg-stone-100 px-3 py-1.5 text-[10px] font-bold text-stone-500 dark:bg-stone-800 dark:text-stone-300">
                  {plans.length}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {plans.map((plan) => {
                  const isSelected = activePlan?._id === plan._id;

                  return (
                    <article
                      key={plan._id}
                      onClick={() => setActivePlan(plan)}
                      className={`
                        group relative cursor-pointer overflow-hidden
                        rounded-[22px] border p-4
                        transition-all duration-300
                        ${
                          isSelected
                            ? `
                              border-amber-300 bg-[#fff9ed]
                              shadow-[0_12px_30px_rgba(180,83,9,.10)]
                              ring-1 ring-amber-300
                              dark:border-amber-800
                              dark:bg-amber-950/20
                              dark:ring-amber-800
                            `
                            : `
                              border-stone-200 bg-white
                              hover:-translate-y-0.5
                              hover:border-stone-300
                              hover:shadow-[0_10px_25px_rgba(51,38,23,.08)]
                              dark:border-stone-700
                              dark:bg-stone-950
                              dark:hover:border-stone-600
                            `
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500" />
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-stone-500 dark:bg-stone-800 dark:text-stone-300">
                            <Route className="h-3 w-3" />
                            {plan.pace} Pace
                          </div>

                          <h3 className="line-clamp-2 text-[14px] font-black leading-5 tracking-[-0.015em] text-stone-950 dark:text-white">
                            {plan.title}
                          </h3>
                        </div>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeletePlan(plan._id);
                          }}
                          className="
                            flex h-8 w-8 shrink-0 items-center justify-center
                            rounded-xl text-stone-400 transition
                            hover:bg-red-50 hover:text-red-600
                            dark:hover:bg-red-950/30
                          "
                          title="Delete Plan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-stone-900">
                          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.09em] text-stone-400">
                            <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                            Schedule
                          </div>

                          <div className="mt-1 text-[10px] font-bold text-stone-700 dark:text-stone-200">
                            {plan.startTime} → {plan.expectedEndTime}
                          </div>
                        </div>

                        <div className="rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-stone-900">
                          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.09em] text-stone-400">
                            <MapPin className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                            Journey
                          </div>

                          <div className="mt-1 text-[10px] font-bold text-stone-700 dark:text-stone-200">
                            {plan.routeOrder?.length || 0} stops • {plan.totalDistance} km
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
                        <span className="text-[9px] font-semibold text-stone-400">
                          Select to review
                        </span>

                        <span className="flex items-center gap-1 text-[9px] font-black text-amber-700 dark:text-amber-400">
                          View Route
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Link
                to="/planner"
                className="
                  group mt-4 flex w-full items-center justify-center gap-2
                  rounded-2xl border border-stone-200
                  bg-stone-50 px-4 py-3
                  text-[10px] font-black text-stone-700
                  transition-all
                  hover:border-amber-200 hover:bg-amber-50
                  hover:text-amber-800
                  dark:border-stone-700 dark:bg-stone-950
                  dark:text-stone-300
                  dark:hover:border-amber-900
                  dark:hover:bg-amber-950/20
                "
              >
                <Sparkles className="h-3.5 w-3.5" />
                Create Another Plan
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </aside>

            {/* =================================================
                RIGHT: DETAIL VIEW
            ================================================= */}

            <section>
              {activePlan ? (
                <div
                  className="
                    overflow-hidden rounded-[28px]
                    border border-stone-200/80
                    bg-white
                    shadow-[0_16px_45px_rgba(51,38,23,.07)]
                    dark:border-stone-800 dark:bg-stone-900
                  "
                >
                  {/* Detail header */}
                  <div className="relative overflow-hidden border-b border-stone-100 p-6 dark:border-stone-800 sm:p-7">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/5" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                          <Route className="h-3.5 w-3.5" />
                          Detailed Route
                        </div>

                        <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-[-0.035em] text-stone-950 dark:text-white sm:text-3xl">
                          {activePlan.title}
                        </h2>

                        <p className="mt-2 text-[10px] text-stone-500 dark:text-stone-400">
                          Saved on{' '}
                          {new Date(
                            activePlan.createdAt
                          ).toLocaleDateString()}{' '}
                          • {activePlan.pace} pace
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-950">
                          <div className="text-[8px] font-black uppercase tracking-[0.1em] text-stone-400">
                            Stops
                          </div>
                          <div className="mt-1 text-lg font-black text-stone-950 dark:text-white">
                            {activePlan.routeOrder?.length || 0}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/30">
                          <div className="text-[8px] font-black uppercase tracking-[0.1em] text-amber-700 dark:text-amber-400">
                            Distance
                          </div>
                          <div className="mt-1 text-lg font-black text-amber-900 dark:text-amber-300">
                            {activePlan.totalDistance}
                            <span className="ml-1 text-[10px]">km</span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-950">
                          <div className="text-[8px] font-black uppercase tracking-[0.1em] text-stone-400">
                            Finish
                          </div>
                          <div className="mt-1 text-lg font-black text-stone-950 dark:text-white">
                            {activePlan.expectedEndTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    {/* Warnings */}
                    {activePlan.warnings?.length > 0 && (
                      <div className="mb-6 rounded-[20px] border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <div className="flex items-center gap-2 text-[11px] font-black text-amber-900 dark:text-amber-300">
                          <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                          Schedule Alerts
                        </div>

                        <div className="mt-2 space-y-1.5">
                          {activePlan.warnings.map((warning, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-[10px] leading-5 text-amber-800 dark:text-amber-300/80"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline heading */}
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                          Route Schedule
                        </div>

                        <h3 className="mt-1 text-lg font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                          Your day, stop by stop
                        </h3>
                      </div>

                      <div className="hidden items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-[9px] font-bold text-stone-500 dark:bg-stone-800 dark:text-stone-300 sm:flex">
                        <TimerReset className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        Starts {activePlan.startTime}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-amber-300 via-stone-200 to-transparent dark:via-stone-700" />

                      <div className="space-y-3">
                        {activePlan.routeOrder?.map((stop, index) => (
                          <div
                            key={index}
                            className="
                              group relative flex items-center justify-between gap-4
                              rounded-[20px] border border-stone-200
                              bg-stone-50/70 p-4 pl-14
                              transition-all duration-300
                              hover:-translate-y-0.5
                              hover:border-amber-200
                              hover:bg-amber-50/40
                              hover:shadow-[0_10px_24px_rgba(51,38,23,.06)]
                              dark:border-stone-700
                              dark:bg-stone-950
                              dark:hover:border-amber-900
                              dark:hover:bg-amber-950/10
                            "
                          >
                            <span
                              className="
                                absolute left-2.5 top-1/2 z-10
                                flex h-8 w-8 -translate-y-1/2
                                items-center justify-center
                                rounded-xl
                                bg-gradient-to-br from-amber-500 to-orange-500
                                text-[10px] font-black text-white
                                shadow-sm
                              "
                            >
                              {stop.order}
                            </span>

                            <div className="min-w-0">
                              <div className="truncate text-[12px] font-black text-stone-950 dark:text-white">
                                {stop.place?.name || 'Attraction'}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-stone-500 dark:text-stone-400">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                  {stop.place?.category}
                                </span>

                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                  {stop.stayDurationMinutes} mins
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 rounded-xl border border-stone-200 bg-white px-3 py-2 text-right dark:border-stone-700 dark:bg-stone-900">
                              <div className="text-[8px] font-bold uppercase tracking-[0.08em] text-stone-400">
                                Arrive
                              </div>

                              <div className="mt-0.5 text-[11px] font-black text-amber-800 dark:text-amber-300">
                                {stop.estimatedArrival}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom summary strip */}
                    <div className="mt-6 grid grid-cols-1 gap-3 border-t border-stone-100 pt-6 dark:border-stone-800 sm:grid-cols-3">
                      <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-950">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.1em] text-stone-400">
                          <Navigation className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          Total stops
                        </div>

                        <div className="mt-2 text-xl font-black text-stone-950 dark:text-white">
                          {activePlan.routeOrder?.length || 0}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.1em] text-amber-700 dark:text-amber-400">
                          <Route className="h-3.5 w-3.5" />
                          Distance
                        </div>

                        <div className="mt-2 text-xl font-black text-amber-900 dark:text-amber-300">
                          {activePlan.totalDistance} km
                        </div>
                      </div>

                      <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-950">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.1em] text-stone-400">
                          <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          Planned finish
                        </div>

                        <div className="mt-2 text-xl font-black text-stone-950 dark:text-white">
                          {activePlan.expectedEndTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* =================================================
                    NO SELECTED PLAN
                ================================================= */

                <div
                  className="
                    relative flex min-h-[390px] items-center justify-center
                    overflow-hidden rounded-[28px]
                    border border-stone-200/80 bg-white
                    p-8 text-center
                    shadow-[0_16px_45px_rgba(51,38,23,.06)]
                    dark:border-stone-800 dark:bg-stone-900
                  "
                >
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/40 blur-[100px] dark:bg-amber-900/10" />

                  <div className="relative z-10 max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700 shadow-sm dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                      <Navigation className="h-6 w-6" />
                    </div>

                    <div className="mt-5 text-[9px] font-black uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                      Route Preview
                    </div>

                    <h3 className="mt-1 text-lg font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                      Select a saved itinerary
                    </h3>

                    <p className="mx-auto mt-2 text-[11px] leading-6 text-stone-500 dark:text-stone-400">
                      Choose a journey from the left to review its route,
                      estimated schedule, stops and travel details.
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-[9px] font-bold text-stone-500 dark:bg-stone-800 dark:text-stone-300">
                      <Bookmark className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      {plans.length} saved plan{plans.length !== 1 ? 's' : ''} available
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedPlans;
