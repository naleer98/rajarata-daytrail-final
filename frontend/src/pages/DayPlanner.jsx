import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

import {
  Calendar,
  Clock,
  Gauge,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  BookmarkPlus,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Check,
  Plus,
  Coffee,
  Zap,
  Smile,
  Route,
  Navigation,
  House,
  Flag,
  Timer,
  MapPinned,
  ChevronRight,
  CircleDot,
} from 'lucide-react';

const DayPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);
  const [startTime, setStartTime] = useState('08:00');
  const [pace, setPace] = useState('Balanced');
  const [planTitle, setPlanTitle] = useState('My Anuradhapura Heritage Tour');

  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planning, setPlanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const latestInputs = useRef('');
  const inputKey = JSON.stringify([selectedPlaceIds, startTime, pace]);
  latestInputs.current = inputKey;
  useEffect(() => { setGeneratedPlan(null); setSaveSuccess(false); }, [inputKey]);

  // =========================================================
  // LOAD PLACES
  // =========================================================

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await API.get('/places');
        setPlaces(res.data.data || []);
      } catch (err) {
        setErrorMessage(
          'Failed to load places. Please ensure backend is running.'
        );
      } finally {
        setLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

  // =========================================================
  // PLACE SELECTION
  // =========================================================

  const handleTogglePlace = (id) => {
    setErrorMessage('');

    if (selectedPlaceIds.includes(id)) {
      setSelectedPlaceIds(
        selectedPlaceIds.filter((pId) => pId !== id)
      );
    } else {
      setSelectedPlaceIds([...selectedPlaceIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPlaceIds.length === places.length) {
      setSelectedPlaceIds([]);
    } else {
      setSelectedPlaceIds(places.map((p) => p._id));
    }
  };

  // =========================================================
  // GENERATE PLAN
  // =========================================================

  const handleGeneratePlan = async () => {
    if (selectedPlaceIds.length === 0) {
      setErrorMessage(
        'Please select at least one place of interest to generate an itinerary .'
      );
      return;
    }

    try {
      setPlanning(true);
      setErrorMessage('');
      setSaveSuccess(false);

      const requestKey = latestInputs.current;
      const res = await API.post('/itineraries/generate', {
        placeIds: selectedPlaceIds,
        startTime,
        pace,
      });

      if (requestKey !== latestInputs.current) return;
      setGeneratedPlan(res.data.data);

      setTimeout(() => {
        document
          .getElementById('plan-results')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to calculate itinerary. Please try again.'
      );
    } finally {
      setPlanning(false);
    }
  };

  // =========================================================
  // SAVE PLAN
  // =========================================================

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    if (!user) {
      navigate('/login', {
        state: { from: { pathname: '/planner' } },
      });
      return;
    }

    try {
      setSavingPlan(true);
      setErrorMessage('');

      await API.post('/itineraries/save', {
        title: planTitle,
        startTime,
        pace,
        selectedPlaces: selectedPlaceIds,
        routeOrder: generatedPlan.routeOrder,
        totalDistance: generatedPlan.totalDistanceKm,
        totalTravelTime: generatedPlan.totalTravelMinutes,
        expectedEndTime: generatedPlan.expectedEndTime,
        warnings: generatedPlan.warnings,
      });

      setSaveSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to save itinerary to your account.'
      );
    } finally {
      setSavingPlan(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    setGeneratedPlan(null);
    setSelectedPlaceIds([]);
    setErrorMessage('');
    setSaveSuccess(false);
  };

  const selectedCount = selectedPlaceIds.length;
  const selectionProgress =
    places.length > 0 ? Math.min((selectedCount / places.length) * 100, 100) : 0;

  const paceOptions = [
    {
      name: 'Relaxed',
      desc: '+25% time',
      icon: Coffee,
      helper: 'More breathing room',
    },
    {
      name: 'Balanced',
      desc: 'Standard',
      icon: Smile,
      helper: 'Recommended pace',
    },
    {
      name: 'Fast',
      desc: '-25% quick',
      icon: Zap,
      helper: 'Cover more places',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* =====================================================
          PLANNER NOTICE
      ===================================================== */}
      <div className="border-b border-amber-200/70 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-2 px-4 py-2.5 text-center text-[11px] font-semibold leading-5 tracking-[0.005em] text-amber-950/75 sm:text-xs dark:text-amber-200/80">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Distances are straight-line estimates. Travel times are not live road or traffic predictions; the nearest-next route is not guaranteed optimal.
          </span>
        </div>
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        className="relative min-h-[360px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/planner-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/72 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
        <div className="pointer-events-none absolute -left-20 top-10 h-[360px] w-[360px] rounded-full bg-amber-500/12 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[10%] h-[280px] w-[480px] rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto grid min-h-[360px] max-w-[1600px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 xl:px-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-amber-200 backdrop-blur-xl">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              Smart Route & Schedule Engine
            </div>

            <h1 className="
              max-w-3xl
              text-[40px] font-extrabold
              leading-[1.02]
              tracking-[-0.045em]
              text-white
              drop-shadow-[0_6px_20px_rgba(0,0,0,.38)]
              sm:text-[54px]
              lg:text-[62px]
            ">
              Build a Better Day.
              <span className="mt-2 block bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Travel Smarter.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-stone-100/95 sm:text-[15px]">
              Pick your favourite Anuradhapura attractions, choose a travel pace,
              and let DayTrail arrange a practical one-day route with opening-hour
              conflict checks.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-semibold text-white/95 backdrop-blur-md">
                <MapPinned className="h-3.5 w-3.5 text-amber-300" />
                {places.length || 10} verified places
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-semibold text-white/95 backdrop-blur-md">
                <Navigation className="h-3.5 w-3.5 text-amber-300" />
                25 km radius
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-semibold text-white/95 backdrop-blur-md">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                Starts {startTime}
              </div>
            </div>
          </div>

          {/* Compact trip snapshot */}
          <div className="w-full rounded-[24px] border border-white/10 bg-black/30 p-4 shadow-[0_20px_55px_rgba(0,0,0,.28)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-300">Trip Snapshot</p>
                <p className="mt-1 text-[11px] text-stone-400">Current planner setup</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20">
                <Route className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <div className="text-lg font-extrabold text-white">{selectedCount}</div>
                <div className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-stone-500">Selected</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <div className="text-lg font-extrabold text-white">{startTime}</div>
                <div className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-stone-500">Start</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <div className="truncate text-sm font-extrabold text-white">{pace}</div>
                <div className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-stone-500">Pace</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-[9px] font-semibold">
                <span className="text-stone-500">Place selection</span>
                <span className="text-amber-300">{selectedCount}/{places.length || 0}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${selectionProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PLANNER WORKSPACE
      ===================================================== */}
      <main className="relative z-20 mx-auto -mt-6 max-w-[1600px] space-y-7 px-4 pb-14 sm:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-8 -z-10 h-[420px] rounded-[40px] bg-gradient-to-b from-amber-100/15 to-transparent blur-3xl dark:from-amber-500/5" />
        {/* Step progress */}
        <div className="grid grid-cols-1 overflow-hidden rounded-[20px] border border-stone-200/80 bg-white shadow-[0_16px_40px_rgba(51,38,23,.08)] dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-3">
          {[
            { no: '01', title: 'Set trip preferences', sub: 'Name, time and pace', done: true },
            { no: '02', title: 'Choose attractions', sub: `${selectedCount} selected`, done: selectedCount > 0 },
            { no: '03', title: 'Generate route', sub: generatedPlan ? 'Plan ready' : 'Smart sequencing', done: Boolean(generatedPlan) },
          ].map((step, index) => (
            <div
              key={step.no}
              className={`relative flex items-center gap-3 px-5 py-3.5 ${index !== 2 ? 'border-b border-stone-100 sm:border-b-0 sm:border-r dark:border-stone-800' : ''}`}
            >
              {step.done && <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500" />}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold ${step.done ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-400 dark:bg-stone-800'}`}>
                {step.done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.no}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-stone-900 dark:text-white">{step.title}</div>
                <div className="mt-0.5 text-[9px] text-stone-400">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main planner grid */}
        <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* LEFT SETTINGS */}
          <aside className="relative h-fit space-y-5 overflow-hidden rounded-[28px] border border-stone-800 bg-[#171513] p-5 text-white shadow-[0_20px_55px_rgba(28,25,23,.18)] dark:border-stone-800 dark:bg-stone-900 lg:sticky lg:top-24">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />
            <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-1">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-300">Step 01</div>
                <h2 className="mt-1 flex items-center gap-2 text-[18px] font-extrabold tracking-[-0.025em] text-stone-950 dark:text-white">
                  <Gauge className="h-[18px] w-[18px] text-amber-400" />
                  Trip Settings
                </h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/10">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-400">Itinerary Name</label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="
                  w-full rounded-2xl
                  border border-white/10
                  bg-white/[0.055]
                  px-4 py-3.5
                  text-xs font-semibold
                  text-white
                  placeholder:text-stone-500
                  outline-none
                  shadow-inner
                  transition-all duration-200
                  hover:border-white/20
                  focus:border-amber-400/70
                  focus:bg-white/[0.08]
                  focus:ring-4 focus:ring-amber-400/10
                "
              />
            </div>

            {/* Time */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-400">Departure Time</label>
                <span className="text-[8px] font-bold text-amber-300">Default 08:00 AM</span>
              </div>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="
                    w-full cursor-pointer
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.055]
                    py-3.5 pl-11 pr-4
                    text-sm font-bold
                    text-white
                    outline-none
                    shadow-inner
                    [color-scheme:dark]
                    transition-all duration-200
                    hover:border-white/20
                    focus:border-amber-400/70
                    focus:bg-white/[0.08]
                    focus:ring-4 focus:ring-amber-400/10
                  "
                />
              </div>
            </div>

            {/* Pace */}
            <div>
              <label className="mb-2.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-400">Travel Pace</label>
              <div className="space-y-2">
                {paceOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = pace === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setPace(item.name)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${isSelected ? 'border-amber-400/70 bg-amber-400/10 shadow-[0_8px_24px_rgba(245,158,11,.08)] ring-1 ring-amber-400/60' : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]'}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-amber-400 text-stone-950' : 'bg-white/[0.07] text-stone-400 ring-1 ring-white/10'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[12px] font-bold ${isSelected ? 'text-amber-200' : 'text-stone-100'}`}>{item.name}</span>
                          <span className={`text-[8px] font-bold ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>{item.desc}</span>
                        </div>
                        <div className="mt-0.5 text-[8px] text-stone-400">{item.helper}</div>
                      </div>
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-white/20 bg-white/[0.04]'}`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ready summary */}
            <div className="rounded-2xl bg-gradient-to-br from-stone-950 to-stone-900 p-4 text-white shadow-lg dark:from-black dark:to-stone-950">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-[0.14em] text-stone-400">Ready to plan</div>
                  <div className="mt-1 text-lg font-black">{selectedCount} {selectedCount === 1 ? 'place' : 'places'}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
                  <Route className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[9px] text-stone-400">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                {startTime} • {pace} pace
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={handleGeneratePlan}
              disabled={planning || selectedCount === 0}
              className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-semibold transition-all duration-300 ${selectedCount === 0 ? 'cursor-not-allowed border border-stone-200 bg-stone-100 text-stone-400 shadow-none dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-500' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-[0_14px_28px_rgba(234,88,12,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(234,88,12,0.30)]'} disabled:cursor-not-allowed disabled:hover:translate-y-0`}
            >
              {planning ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Computing Route...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {selectedCount === 0 ? 'Select a Place to Continue' : 'Generate One-Day Plan'}
                  {selectedCount > 0 && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </>
              )}
            </button>

            <p className="text-center text-[8px] leading-4 text-stone-400">Routes are calculated from your registered home location.</p>
          </aside>

          {/* RIGHT PLACE SELECTOR */}
          <section className="h-fit overflow-hidden rounded-[28px] border border-stone-200/80 bg-[#fffdf9] shadow-[0_18px_50px_rgba(51,38,23,.08)] dark:border-stone-800 dark:bg-stone-900">
            <div className="border-b border-stone-100 px-5 py-4 dark:border-stone-800 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">Step 02</div>
                  <h2 className="mt-1 flex items-center gap-2 text-[18px] font-extrabold tracking-[-0.025em] text-stone-950 dark:text-white">
                    <MapPin className="h-[18px] w-[18px] text-amber-600 dark:text-amber-400" />
                    Select Places
                  </h2>
                  <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">Tap any attraction to add or remove it from your route.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-stone-100 px-3 py-2 text-[9px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">{selectedCount} chosen</div>
                  <button
                    onClick={handleSelectAll}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-[9px] font-semibold text-amber-900 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50"
                  >
                    {selectedCount === places.length ? 'Deselect All' : `Select All ${places.length}`}
                  </button>
                </div>
              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${selectionProgress}%` }} />
              </div>
            </div>

            {errorMessage && (
              <div className="mx-5 mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-[10px] font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 sm:mx-6">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="p-5 sm:p-6">
              {loadingPlaces ? (
                <div className="py-16 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                  <p className="mt-3 text-[10px] font-bold text-stone-400">Loading places list...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {places.map((place) => {
                    const isSelected = selectedPlaceIds.includes(place._id);
                    return (
                      <button
                        key={place._id}
                        type="button"
                        onClick={() => handleTogglePlace(place._id)}
                        className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50/90 shadow-[0_8px_22px_rgba(217,119,6,0.10)] ring-1 ring-amber-400 dark:border-amber-700/70 dark:bg-amber-950/30 dark:ring-amber-700/50'
                            : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_10px_28px_rgba(51,38,23,.08)] dark:border-stone-700 dark:bg-stone-950 dark:hover:border-stone-600 dark:hover:bg-stone-900'
                        }`}
                      >
                        {isSelected && <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 dark:from-amber-300 dark:to-orange-400" />}

                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] bg-stone-100 ring-1 ring-stone-200/80 dark:bg-stone-800 dark:ring-stone-700">
                          <img
                            src={place.images?.[0] || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=160&q=80'}
                            alt={place.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className={`absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg border border-white shadow-sm ${isSelected ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/90 text-stone-400'}`}>
                            {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Plus className="h-3.5 w-3.5" />}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="line-clamp-1 text-[11px] font-bold text-stone-900 dark:text-stone-100">{place.name}</h4>
                            <span className="shrink-0 rounded-lg bg-amber-100 px-2 py-1 text-[8px] font-black text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">{place.distanceFromHome} km</span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] text-stone-400 dark:text-stone-500">
                            <span className="font-semibold text-stone-600 dark:text-stone-300">{place.category}</span>
                            <span>•</span>
                            <span>Closes {place.closingTime}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =====================================================
            RESULTS
        ===================================================== */}
        {generatedPlan && (
          <section id="plan-results" className="space-y-6 scroll-mt-24">
            {/* Result summary */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#17120e] via-stone-900 to-[#4a2106] p-6 text-white shadow-[0_20px_60px_rgba(28,25,23,0.20)] sm:p-7">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-[100px]" />
              <div className="relative z-10">
                <div className="flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Itinerary Ready
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]  sm:text-3xl">{planTitle}</h2>
                    <p className="mt-1.5 text-[10px] text-stone-400">{generatedPlan.pace} pace • Starts {generatedPlan.startTime} • Returns about {generatedPlan.expectedEndTime}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={handleReset} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-[10px] font-bold text-stone-200 transition hover:bg-white/15">
                      <RotateCcw className="h-3.5 w-3.5" />
                      New Plan
                    </button>
                    <button
                      onClick={handleSavePlan}
                      disabled={savingPlan || saveSuccess}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black shadow-md transition ${saveSuccess ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-stone-950 hover:bg-amber-400'}`}
                    >
                      {saveSuccess ? (
                        <><CheckCircle2 className="h-4 w-4" />Saved to My Plans</>
                      ) : savingPlan ? (
                        <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-950 border-t-transparent" />Saving...</>
                      ) : (
                        <><BookmarkPlus className="h-4 w-4" />Save Itinerary</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    { label: 'Total Stops', value: `${generatedPlan.totalPlaces}`, suffix: 'places', icon: MapPin },
                    { label: 'Roundtrip', value: `${generatedPlan.totalDistanceKm}`, suffix: 'km', icon: Navigation },
                    { label: 'Travel Time', value: `~${generatedPlan.totalTravelMinutes}`, suffix: 'mins', icon: Timer },
                    { label: 'Finish Time', value: generatedPlan.expectedEndTime, suffix: 'approx.', icon: Flag },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-stone-400">{metric.label}</span>
                          <Icon className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="mt-2 flex items-end gap-1.5">
                          <span className="text-xl font-black text-white sm:text-2xl">{metric.value}</span>
                          <span className="pb-0.5 text-[8px] font-bold text-stone-500">{metric.suffix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Warnings */}
            {generatedPlan.warnings && generatedPlan.warnings.length > 0 && (
              <div className="rounded-[24px] border border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 p-5 shadow-sm dark:border-red-900/50 dark:from-red-950/30 dark:via-orange-950/20 dark:to-amber-950/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-red-950 dark:text-red-200">Opening-Time Conflicts Detected</h3>
                    <p className="mt-1 text-[10px] leading-5 text-stone-600 dark:text-stone-400">Your selected departure time ({generatedPlan.startTime}) causes one or more operating-hour conflicts.</p>
                    <div className="mt-3 space-y-2">
                      {generatedPlan.warnings.map((warning, index) => (
                        <div key={index} className="rounded-xl border border-red-100 bg-white/80 px-3 py-2.5 text-[10px] font-bold text-red-900 dark:border-red-900/40 dark:bg-stone-900 dark:text-red-300">{warning}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================================
                PREMIUM ROUTE TIMELINE
            ===================================================== */}

            <div
              className="
                overflow-hidden rounded-[30px]
                border border-stone-200/80
                bg-white
                shadow-[0_18px_55px_rgba(51,38,23,.08)]
                dark:border-stone-800
                dark:bg-stone-900
              "
            >
              {/* Header */}
              <div
                className="
                  relative overflow-hidden
                  border-b border-stone-100
                  px-5 py-6
                  dark:border-stone-800
                  sm:px-7
                "
              >
                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/5" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.17em] text-amber-700 dark:text-amber-400">
                      Step 03
                    </div>

                    <h3
                      className="
                        mt-1 flex items-center gap-2
                        text-[24px] font-black
                        tracking-[-0.035em]
                        text-stone-950
                        dark:text-white
                        sm:text-[28px]
                      "
                    >
                      <Route className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      Optimal Route Schedule
                    </h3>

                    <p className="mt-1.5 text-[10px] leading-5 text-stone-500 dark:text-stone-400">
                      Follow the suggested journey from your registered home,
                      through every selected attraction, and back again.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="
                        inline-flex items-center gap-1.5
                        rounded-full
                        border border-stone-200
                        bg-stone-50
                        px-3 py-2
                        text-[9px] font-black
                        text-stone-600
                        dark:border-stone-700
                        dark:bg-stone-950
                        dark:text-stone-300
                      "
                    >
                      <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      {generatedPlan.totalPlaces} stops
                    </span>

                    <span
                      className="
                        inline-flex items-center gap-1.5
                        rounded-full
                        border border-amber-200
                        bg-amber-50
                        px-3 py-2
                        text-[9px] font-black
                        text-amber-800
                        dark:border-amber-900/40
                        dark:bg-amber-950/30
                        dark:text-amber-300
                      "
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {generatedPlan.totalDistanceKm} km roundtrip
                    </span>
                  </div>
                </div>

                {/* Route progress strip */}
                <div className="relative mt-5 flex items-center">
                  <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-stone-200 dark:bg-stone-700" />

                  <div className="relative z-10 flex w-full items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950">
                      <House className="h-3.5 w-3.5" />
                    </span>

                    {generatedPlan.routeOrder.map((stop) => (
                      <span
                        key={`progress-${stop.order}`}
                        className="
                          flex h-7 w-7 items-center justify-center
                          rounded-full
                          border-2 border-white
                          bg-amber-500
                          text-[9px] font-black
                          text-stone-950
                          shadow-sm
                          dark:border-stone-900
                        "
                      >
                        {stop.order}
                      </span>
                    ))}

                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                      <Flag className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {/* =================================================
                    HOME START
                ================================================= */}

                <div className="relative flex gap-4 pb-5">
                  <div className="relative flex w-11 shrink-0 justify-center">
                    <div className="absolute bottom-[-10px] top-10 w-px bg-gradient-to-b from-stone-300 to-amber-200 dark:from-stone-700 dark:to-amber-900" />

                    <div
                      className="
                        z-10 flex h-10 w-10 items-center justify-center
                        rounded-[14px]
                        bg-stone-950 text-white
                        shadow-[0_8px_20px_rgba(28,25,23,.18)]
                        dark:bg-white dark:text-stone-950
                      "
                    >
                      <House className="h-4 w-4" />
                    </div>
                  </div>

                  <div
                    className="
                      flex-1 overflow-hidden rounded-[20px]
                      border border-stone-200
                      bg-gradient-to-r from-stone-50 to-white
                      dark:border-stone-700
                      dark:from-stone-950 dark:to-stone-900
                    "
                  >
                    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-[12px] font-black text-stone-950 dark:text-white">
                          Depart Registered Home Base
                        </div>

                        <div className="mt-1 text-[9px] text-stone-400">
                          Journey begins from your saved origin
                        </div>
                      </div>

                      <div
                        className="
                          inline-flex w-fit items-center gap-2
                          rounded-xl
                          bg-stone-950
                          px-3.5 py-2
                          text-[11px] font-black
                          text-white
                          shadow-sm
                          dark:bg-white
                          dark:text-stone-950
                        "
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {generatedPlan.startTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ROUTE STOPS
                ================================================= */}

                {generatedPlan.routeOrder.map((stop) => {
                  const googleMapsDir = `https://www.google.com/maps/dir/?api=1&destination=${stop.place.coordinates.lat},${stop.place.coordinates.lng}`;

                  return (
                    <div key={stop.order} className="relative flex gap-4 pb-5">
                      {/* Timeline rail */}
                      <div className="relative flex w-11 shrink-0 justify-center">
                        <div className="absolute bottom-[-10px] top-10 w-px bg-gradient-to-b from-amber-300 to-amber-100 dark:from-amber-800 dark:to-stone-700" />

                        <div
                          className="
                            z-10 flex h-10 w-10 items-center justify-center
                            rounded-[14px]
                            bg-gradient-to-br from-amber-400 to-orange-500
                            text-[11px] font-black
                            text-stone-950
                            shadow-[0_8px_20px_rgba(245,158,11,.20)]
                          "
                        >
                          {stop.order}
                        </div>
                      </div>

                      {/* Stop card */}
                      <article
                        className="
                          group flex-1 overflow-hidden
                          rounded-[22px]
                          border border-stone-200
                          bg-white
                          shadow-[0_8px_24px_rgba(51,38,23,.05)]
                          transition-all duration-300
                          hover:-translate-y-0.5
                          hover:border-amber-200
                          hover:shadow-[0_14px_32px_rgba(51,38,23,.09)]
                          dark:border-stone-700
                          dark:bg-stone-950
                          dark:hover:border-amber-900
                        "
                      >
                        {/* Stop top */}
                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div
                              className="
                                h-16 w-16 shrink-0 overflow-hidden
                                rounded-[16px]
                                bg-stone-100
                                ring-1 ring-stone-200
                                dark:bg-stone-800
                                dark:ring-stone-700
                              "
                            >
                              <img
                                src={
                                  stop.place.images?.[0] ||
                                  'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=160&q=80'
                                }
                                alt={stop.place.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-[14px] font-black tracking-[-0.01em] text-stone-950 dark:text-white">
                                  {stop.place.name}
                                </h4>

                                <span
                                  className="
                                    rounded-full
                                    bg-stone-100
                                    px-2.5 py-1
                                    text-[8px] font-bold
                                    text-stone-500
                                    dark:bg-stone-800
                                    dark:text-stone-300
                                  "
                                >
                                  {stop.place.category}
                                </span>
                              </div>

                              <div className="mt-1.5 flex items-start gap-1.5 text-[9px] leading-4 text-stone-400">
                                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span className="line-clamp-1">
                                  {stop.place.address}
                                </span>
                              </div>
                            </div>
                          </div>

                          <a
                            href={googleMapsDir}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              inline-flex shrink-0 items-center justify-center gap-1.5
                              rounded-xl
                              border border-stone-200
                              bg-stone-50
                              px-3 py-2.5
                              text-[9px] font-black
                              text-stone-700
                              transition-all
                              hover:-translate-y-0.5
                              hover:border-amber-300
                              hover:bg-amber-50
                              hover:text-amber-800
                              dark:border-stone-700
                              dark:bg-stone-900
                              dark:text-stone-300
                              dark:hover:border-amber-800
                              dark:hover:bg-amber-950/20
                              dark:hover:text-amber-300
                            "
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            Navigate
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        {/* Stop timing */}
                        <div
                          className="
                            border-t border-stone-100
                            bg-[#faf9f6]
                            px-4 py-4
                            dark:border-stone-800
                            dark:bg-stone-900/70
                          "
                        >
                          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                            {/* Transit */}
                            <div
                              className="
                                rounded-[16px]
                                border border-stone-200/70
                                bg-white
                                p-3
                                dark:border-stone-700
                                dark:bg-stone-950
                              "
                            >
                              <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-[0.11em] text-stone-400">
                                <Navigation className="h-3 w-3 text-stone-400" />
                                Transit
                              </div>

                              <div className="mt-2 text-[13px] font-black text-stone-900 dark:text-white">
                                ~{stop.travelTimeFromPrevMinutes} min
                              </div>

                              <div className="mt-0.5 text-[8px] font-medium text-stone-400">
                                {stop.distanceFromPrevKm} km
                              </div>
                            </div>

                            {/* Arrival */}
                            <div
                              className="
                                rounded-[16px]
                                border border-amber-200
                                bg-gradient-to-br
                                from-amber-50 to-orange-50/60
                                p-3
                                dark:border-amber-900/40
                                dark:from-amber-950/30
                                dark:to-orange-950/10
                              "
                            >
                              <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-[0.11em] text-amber-700 dark:text-amber-400">
                                <Clock className="h-3 w-3" />
                                Arrival
                              </div>

                              <div className="mt-2 text-[15px] font-black text-amber-950 dark:text-amber-300">
                                {stop.displayArrival}
                              </div>
                            </div>

                            {/* Visit */}
                            <div
                              className="
                                rounded-[16px]
                                border border-stone-200/70
                                bg-white
                                p-3
                                dark:border-stone-700
                                dark:bg-stone-950
                              "
                            >
                              <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-[0.11em] text-stone-400">
                                <Timer className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                Visit
                              </div>

                              <div className="mt-2 text-[13px] font-black text-stone-900 dark:text-white">
                                {stop.stayDurationMinutes} min
                              </div>

                              <div className="mt-0.5 text-[8px] font-medium text-stone-400">
                                Planned stay
                              </div>
                            </div>

                            {/* Departure */}
                            <div
                              className="
                                rounded-[16px]
                                border border-stone-200/70
                                bg-white
                                p-3
                                dark:border-stone-700
                                dark:bg-stone-950
                              "
                            >
                              <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-[0.11em] text-stone-400">
                                <Flag className="h-3 w-3 text-stone-400" />
                                Departure
                              </div>

                              <div className="mt-2 text-[15px] font-black text-stone-950 dark:text-white">
                                {stop.displayDeparture}
                              </div>
                            </div>
                          </div>

                          {/* Etiquette */}
                          <div
                            className="
                              mt-3 flex items-start gap-2
                              rounded-[14px]
                              border border-stone-200/70
                              bg-white
                              px-3 py-2.5
                              text-[9px] leading-5
                              text-stone-600
                              dark:border-stone-700
                              dark:bg-stone-950
                              dark:text-stone-400
                            "
                          >
                            <CircleDot className="mt-1 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />

                            <span>
                              <strong className="font-black text-stone-800 dark:text-stone-200">
                                Visitor etiquette:
                              </strong>{' '}
                              {stop.place.dressCode}
                            </span>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}

                {/* =================================================
                    RETURN HOME
                ================================================= */}

                <div className="relative flex gap-4">
                  <div className="relative flex w-11 shrink-0 justify-center">
                    <div
                      className="
                        z-10 flex h-10 w-10 items-center justify-center
                        rounded-[14px]
                        bg-emerald-600
                        text-white
                        shadow-[0_8px_20px_rgba(5,150,105,.18)]
                      "
                    >
                      <Flag className="h-4 w-4" />
                    </div>
                  </div>

                  <div
                    className="
                      flex-1 overflow-hidden
                      rounded-[20px]
                      border border-emerald-200
                      bg-gradient-to-r
                      from-emerald-50 to-teal-50/60
                      dark:border-emerald-900/50
                      dark:from-emerald-950/30
                      dark:to-teal-950/10
                    "
                  >
                    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-[12px] font-black text-emerald-950 dark:text-emerald-300">
                          Return to Home Base
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] text-emerald-700 dark:text-emerald-400">
                          <span>
                            Final drive: {generatedPlan.returnDistanceKm} km
                          </span>

                          <span className="h-1 w-1 rounded-full bg-emerald-400" />

                          <span>Roundtrip complete</span>
                        </div>
                      </div>

                      <div
                        className="
                          inline-flex w-fit items-center gap-2
                          rounded-xl
                          bg-emerald-600
                          px-3.5 py-2
                          text-[11px] font-black
                          text-white
                          shadow-sm
                        "
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Finish ~{generatedPlan.expectedEndTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        )}
      </main>
    </div>
  );
};

export default DayPlanner;
