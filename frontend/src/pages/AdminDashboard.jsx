import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PlaceFormModal from '../components/PlaceFormModal';
import ChangeLogoModal from '../components/ChangeLogoModal';
import Logo from '../components/Logo';

import {
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Landmark,
  Compass,
  Database,
  Image as ImageIcon,
  Clock3,
  Navigation,
  Layers3,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const [placeToEdit, setPlaceToEdit] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // =========================================================
  // FETCH PLACES
  // =========================================================

  const fetchPlaces = async () => {
    try {
      setLoading(true);

      const res = await API.get('/places?all=true');

      setPlaces(res.data.data || []);
    } catch (err) {
      console.error('Failed to load places for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredPlaces = places.filter((place) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm) ||
      place.address.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'All' ||
      place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All',
    ...new Set(places.map((place) => place.category)),
  ];

  // =========================================================
  // SAVE PLACE
  // =========================================================

  const handleSavePlace = async (payload, id) => {
    try {
      if (id) {
        const res = await API.put(`/places/${id}`, payload);

        setPlaces((currentPlaces) =>
          currentPlaces.map((place) =>
            place._id === id ? res.data.data : place
          )
        );

        triggerSuccess(
          `"${res.data.data.name}" updated successfully!`
        );
      } else {
        const res = await API.post('/places', payload);

        setPlaces((currentPlaces) => [
          res.data.data,
          ...currentPlaces,
        ]);

        triggerSuccess(
          `"${res.data.data.name}" added to catalog!`
        );
      }
    } catch (err) {
      console.error('Failed to save place:', err);
      alert('Failed to save place.');
    }
  };

  // =========================================================
  // DELETE PLACE
  // =========================================================

  const handleDeletePlace = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/places/${id}`);

      setPlaces((currentPlaces) =>
        currentPlaces.filter((place) => place._id !== id)
      );

      triggerSuccess(`"${name}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete place:', err);
      alert('Failed to delete place.');
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const handleToggleStatus = async (place) => {
    try {
      const updatedStatus = !place.isActive;

      const res = await API.put(`/places/${place._id}`, {
        isActive: updatedStatus,
      });

      setPlaces((currentPlaces) =>
        currentPlaces.map((currentPlace) =>
          currentPlace._id === place._id
            ? res.data.data
            : currentPlace
        )
      );

      triggerSuccess(
        `"${place.name}" is now ${
          updatedStatus ? 'Active' : 'Hidden'
        }.`
      );
    } catch (err) {
      console.error('Failed to update place status:', err);
      alert('Failed to update place status.');
    }
  };

  // =========================================================
  // SUCCESS MESSAGE
  // =========================================================

  const triggerSuccess = (message) => {
    setActionSuccess(message);

    setTimeout(() => {
      setActionSuccess('');
    }, 3500);
  };

  // =========================================================
  // METRICS
  // =========================================================

  const totalPlaces = places.length;

  const activePlaces = places.filter(
    (place) => place.isActive
  ).length;

  const categoriesCount = new Set(
    places.map((place) => place.category)
  ).size;

  // =========================================================
  // CATEGORY STYLE
  // =========================================================

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Religious':
        return `
          bg-rose-50
          text-rose-700
          border-rose-100
          dark:bg-rose-950/30
          dark:text-rose-300
          dark:border-rose-900/50
        `;

      case 'Heritage':
        return `
          bg-amber-50
          text-amber-800
          border-amber-100
          dark:bg-amber-950/30
          dark:text-amber-300
          dark:border-amber-900/50
        `;

      case 'Nature':
        return `
          bg-emerald-50
          text-emerald-700
          border-emerald-100
          dark:bg-emerald-950/30
          dark:text-emerald-300
          dark:border-emerald-900/50
        `;

      case 'Museum':
        return `
          bg-violet-50
          text-violet-700
          border-violet-100
          dark:bg-violet-950/30
          dark:text-violet-300
          dark:border-violet-900/50
        `;

      case 'Cultural':
        return `
          bg-orange-50
          text-orange-700
          border-orange-100
          dark:bg-orange-950/30
          dark:text-orange-300
          dark:border-orange-900/50
        `;

      default:
        return `
          bg-stone-100
          text-stone-700
          border-stone-200
          dark:bg-stone-800
          dark:text-stone-200
          dark:border-stone-700
        `;
    }
  };

  return (
    <div
      className="
        relative min-h-screen overflow-hidden
        bg-[#f7f4ee]
        text-stone-900
        dark:bg-stone-950
        dark:text-stone-100
      "
    >
      {/* Ambient page glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <div className="absolute -left-28 -top-36 h-[360px] w-[360px] rounded-full bg-amber-300/20 blur-[110px] dark:bg-amber-500/5" />
        <div className="absolute right-[-120px] top-24 h-[320px] w-[320px] rounded-full bg-orange-300/15 blur-[120px] dark:bg-orange-500/5" />
      </div>

      <div
        className="
          relative z-10 mx-auto
          max-w-[1600px]
          space-y-6
          px-4 py-7
          sm:px-6 sm:py-8
          lg:px-8
          animate-in fade-in duration-300
        "
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-white/10
            bg-cover bg-center bg-no-repeat
            shadow-[0_28px_80px_rgba(67,39,16,0.20)]
          "
          style={{
            backgroundImage: "url('/admin-bg.jpg')",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0906]/95 via-[#17100a]/78 to-[#241306]/35" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

          {/* Fine premium overlays */}
          <div
            className="
              pointer-events-none absolute inset-0 opacity-30
              [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)]
              [background-size:34px_34px]
            "
          />
          <div className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[360px] rounded-full bg-amber-400/20 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[-90px] left-[28%] h-[180px] w-[420px] rounded-full bg-orange-500/10 blur-[100px]" />

          <div
            className="
              relative z-10
              grid min-h-[270px]
              grid-cols-1 gap-8
              px-6 py-8
              sm:px-8 sm:py-9
              lg:grid-cols-[minmax(0,1fr)_auto]
              lg:items-center
              xl:px-10
            "
          >
            {/* Hero content */}
            <div className="max-w-4xl">
              <div className="mb-5 flex items-center gap-4">
                <div
                  className="
                    hidden shrink-0 rounded-[22px]
                    border border-white/15
                    bg-black/25 p-2
                    shadow-[0_14px_35px_rgba(0,0,0,.22)]
                    backdrop-blur-xl
                    sm:block
                  "
                >
                  <Logo size="lg" />
                </div>

                <div>
                  <div
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      border border-amber-300/25
                      bg-amber-400/10
                      px-3 py-1.5
                      text-[10px] font-black uppercase
                      tracking-[0.18em]
                      text-amber-200
                      backdrop-blur-xl
                    "
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Administrator Workspace
                  </div>

                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    RajaRata DayTrail · Catalog Control
                  </p>
                </div>
              </div>

              <h1
                className="
                  max-w-3xl
                  text-[32px] font-black
                  leading-[1.04]
                  tracking-[-0.045em]
                  text-white
                  drop-shadow-sm
                  sm:text-[42px]
                  xl:text-[46px]
                "
              >
                Manage places with a
                <span className="ml-2 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  premium control center
                </span>
              </h1>

              <p
                className="
                  mt-4 max-w-2xl
                  text-[12px] leading-6
                  text-stone-300
                  sm:text-[13px]
                "
              >
                Maintain verified tourist attractions within the 25 km
                Anuradhapura radius. Updates are reflected across Explore,
                Interactive Map and Day Planner.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur-md">
                  <Compass className="h-3.5 w-3.5 text-amber-300" />
                  25 km coverage
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur-md">
                  <Database className="h-3.5 w-3.5 text-emerald-300" />
                  Live catalog sync
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-orange-300" />
                  Curated visitor data
                </div>
              </div>
            </div>

            {/* Hero actions */}
            <div className="flex flex-wrap gap-3 lg:max-w-[290px] lg:justify-end">
              <button
                onClick={() => setIsLogoModalOpen(true)}
                className="
                  group inline-flex items-center justify-center gap-2
                  rounded-2xl
                  border border-white/15
                  bg-white/[0.08]
                  px-4 py-3
                  text-xs font-bold text-white
                  shadow-[0_10px_30px_rgba(0,0,0,.18)]
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-amber-300/30
                  hover:bg-white/[0.13]
                "
              >
                <ImageIcon className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:scale-110" />
                Change Logo
              </button>

              <button
                onClick={() => {
                  setPlaceToEdit(null);
                  setIsModalOpen(true);
                }}
                className="
                  group inline-flex items-center justify-center gap-2
                  rounded-2xl
                  bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500
                  px-5 py-3
                  text-xs font-black text-stone-950
                  shadow-[0_14px_34px_rgba(245,158,11,0.34)]
                  ring-1 ring-white/30
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_18px_42px_rgba(245,158,11,0.44)]
                  sm:text-sm
                "
              >
                <Plus className="h-4 w-4 stroke-[3] transition-transform duration-300 group-hover:rotate-90" />
                Add New Place
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {actionSuccess && (
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-emerald-200/80
              bg-emerald-50/90
              px-4 py-3.5
              text-xs font-bold text-emerald-800
              shadow-[0_10px_30px_rgba(16,185,129,.08)]
              backdrop-blur-xl
              dark:border-emerald-900
              dark:bg-emerald-950/30
              dark:text-emerald-300
              animate-in fade-in slide-in-from-top-2
            "
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            {actionSuccess}
          </div>
        )}

        {/* =====================================================
            METRICS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total */}
          <div
            className="
              group relative overflow-hidden
              rounded-[24px]
              border border-white/70
              bg-white/90
              p-5
              shadow-[0_12px_35px_rgba(51,38,23,0.07)]
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_20px_48px_rgba(51,38,23,0.11)]
              dark:border-stone-800
              dark:bg-stone-900/90
            "
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />
            <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-amber-200/35 blur-2xl dark:bg-amber-500/5" />

            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                  Total Catalog Places
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-[38px] font-black leading-none tracking-[-0.055em] text-stone-950 dark:text-white">
                    {totalPlaces}
                  </span>
                  <span className="pb-1 text-[10px] font-bold text-stone-400">
                    places
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-stone-400">
                  Locations in your managed catalog
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
                <Landmark className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div
            className="
              group relative overflow-hidden
              rounded-[24px]
              border border-white/70
              bg-white/90
              p-5
              shadow-[0_12px_35px_rgba(51,38,23,0.07)]
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_20px_48px_rgba(51,38,23,0.11)]
              dark:border-stone-800
              dark:bg-stone-900/90
            "
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-500" />
            <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-emerald-200/35 blur-2xl dark:bg-emerald-500/5" />

            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                  Active on Public App
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-[38px] font-black leading-none tracking-[-0.055em] text-emerald-600">
                    {activePlaces}
                  </span>
                  <span className="pb-1 text-[10px] font-bold text-stone-400">
                    visible
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-stone-400">
                  Places currently visible to visitors
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div
            className="
              group relative overflow-hidden
              rounded-[24px]
              border border-white/70
              bg-white/90
              p-5
              shadow-[0_12px_35px_rgba(51,38,23,0.07)]
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_20px_48px_rgba(51,38,23,0.11)]
              dark:border-stone-800
              dark:bg-stone-900/90
            "
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-orange-300 via-orange-500 to-rose-400" />
            <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-orange-200/35 blur-2xl dark:bg-orange-500/5" />

            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                  Categories Covered
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-[38px] font-black leading-none tracking-[-0.055em] text-orange-600 dark:text-orange-400">
                    {categoriesCount}
                  </span>
                  <span className="pb-1 text-[10px] font-bold text-stone-400">
                    types
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-stone-400">
                  Attraction categories in the catalog
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-400">
                <Layers3 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CATALOG CARD
        ===================================================== */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border border-white/70
            bg-white/90
            shadow-[0_18px_55px_rgba(51,38,23,0.08)]
            backdrop-blur-xl
            dark:border-stone-800
            dark:bg-stone-900/90
          "
        >
          {/* Catalog heading */}
          <div
            className="
              flex flex-col gap-4
              border-b border-stone-100
              px-5 py-5
              sm:px-6
              lg:flex-row lg:items-center lg:justify-between
              dark:border-stone-800
            "
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950">
                  <Database className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-[15px] font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                    Place Catalog
                  </h2>
                  <p className="mt-0.5 text-[10px] text-stone-400">
                    Search, filter and manage all visitor destinations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-[10px] font-bold text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {filteredPlaces.length} result
                {filteredPlaces.length !== 1 ? 's' : ''}
              </span>

              <button
                onClick={fetchPlaces}
                title="Refresh places"
                className="
                  group flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-stone-200
                  bg-white
                  text-stone-500
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-amber-300
                  hover:text-amber-600
                  hover:shadow-md
                  dark:border-stone-700
                  dark:bg-stone-800
                  dark:text-stone-300
                "
              >
                <RefreshCw
                  className={`
                    h-4 w-4
                    transition-transform duration-500
                    ${loading ? 'animate-spin' : 'group-hover:rotate-180'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div
            className="
              flex flex-col gap-3
              border-b border-stone-100
              bg-[#fbfaf8]/80
              px-5 py-4
              sm:px-6
              md:flex-row md:items-center
              dark:border-stone-800
              dark:bg-stone-950/45
            "
          >
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by place name or address..."
                className="
                  w-full
                  rounded-2xl
                  border border-stone-200
                  bg-white
                  py-3 pl-11 pr-4
                  text-xs font-medium
                  text-stone-800
                  outline-none
                  shadow-[0_3px_10px_rgba(28,25,23,.025)]
                  transition-all
                  placeholder:text-stone-400
                  hover:border-stone-300
                  focus:border-amber-400
                  focus:ring-4 focus:ring-amber-500/10
                  dark:border-stone-700
                  dark:bg-stone-900
                  dark:text-white
                "
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="
                min-w-[170px]
                rounded-2xl
                border border-stone-200
                bg-white
                px-4 py-3
                text-xs font-bold
                text-stone-700
                outline-none
                shadow-[0_3px_10px_rgba(28,25,23,.025)]
                transition-all
                hover:border-stone-300
                focus:border-amber-400
                focus:ring-4 focus:ring-amber-500/10
                dark:border-stone-700
                dark:bg-stone-900
                dark:text-stone-200
              "
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'All' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Loading / Empty / Table */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                <RefreshCw className="h-5 w-5 animate-spin" />
              </div>

              <p className="mt-4 text-xs font-black text-stone-700 dark:text-stone-200">
                Loading catalog
              </p>
              <p className="mt-1 text-[10px] text-stone-400">
                Syncing your latest place data...
              </p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-600 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30">
                <Search className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-black text-stone-900 dark:text-white">
                No places found
              </h3>

              <p className="mt-1 text-xs text-stone-400">
                Try changing your search term or category filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left">
                <thead
                  className="
                    border-b border-stone-200/80
                    bg-stone-50/90
                    text-[9px] font-black uppercase
                    tracking-[0.15em]
                    text-stone-400
                    dark:border-stone-800
                    dark:bg-stone-950/80
                  "
                >
                  <tr>
                    <th className="px-6 py-4">Place & Location</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Distance</th>
                    <th className="px-4 py-4">Hours</th>
                    <th className="px-4 py-4">Visibility</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredPlaces.map((place) => (
                    <tr
                      key={place._id}
                      className="
                        group
                        transition-colors duration-200
                        hover:bg-amber-50/35
                        dark:hover:bg-stone-800/35
                      "
                    >
                      {/* Place */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative shrink-0">
                            <div className="overflow-hidden rounded-[15px] ring-1 ring-stone-200 shadow-[0_5px_14px_rgba(28,25,23,.08)] dark:ring-stone-700">
                              <img
                                src={
                                  place.images?.[0] ||
                                  'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=150&q=80'
                                }
                                alt={place.name}
                                className="
                                  h-12 w-12 object-cover
                                  transition-transform duration-300
                                  group-hover:scale-110
                                "
                              />
                            </div>

                            <span
                              className={`
                                absolute -bottom-1 -right-1
                                h-3.5 w-3.5
                                rounded-full border-[3px]
                                border-white
                                dark:border-stone-900
                                ${
                                  place.isActive
                                    ? 'bg-emerald-500'
                                    : 'bg-stone-400'
                                }
                              `}
                            />
                          </div>

                          <div className="min-w-0">
                            <span
                              className="
                                block max-w-[360px] truncate
                                text-[13px] font-black
                                tracking-[-0.01em]
                                text-stone-950
                                dark:text-white
                              "
                            >
                              {place.name}
                            </span>

                            <span
                              className="
                                mt-1 flex max-w-[360px]
                                items-center gap-1.5
                                truncate
                                text-[10px] text-stone-400
                              "
                            >
                              <MapPin className="h-3 w-3 shrink-0 text-stone-300 dark:text-stone-500" />
                              {place.address}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span
                          className={`
                            inline-flex items-center
                            rounded-full border
                            px-2.5 py-1.5
                            text-[9px] font-black
                            ${getCategoryClass(place.category)}
                          `}
                        >
                          {place.category}
                        </span>
                      </td>

                      {/* Distance */}
                      <td className="px-4 py-4">
                        <div
                          className="
                            inline-flex items-center gap-1.5
                            rounded-xl
                            border border-amber-100
                            bg-amber-50
                            px-2.5 py-1.5
                            text-[10px] font-black
                            text-amber-800
                            dark:border-amber-900/40
                            dark:bg-amber-950/30
                            dark:text-amber-300
                          "
                        >
                          <Navigation className="h-3 w-3" />
                          {place.distanceFromHome} km
                        </div>
                      </td>

                      {/* Hours */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-stone-600 dark:text-stone-300">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-400 dark:bg-stone-800">
                            <Clock3 className="h-3.5 w-3.5" />
                          </div>

                          <span>
                            {place.openingTime} - {place.closingTime}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleStatus(place)}
                          title={
                            place.isActive
                              ? 'Click to hide this place'
                              : 'Click to make this place active'
                          }
                          className={`
                            group/status
                            inline-flex items-center gap-2
                            rounded-full border
                            px-3 py-1.5
                            text-[9px] font-black uppercase
                            tracking-[0.08em]
                            shadow-sm
                            transition-all duration-200
                            hover:-translate-y-0.5
                            ${
                              place.isActive
                                ? `
                                  border-emerald-200
                                  bg-emerald-50
                                  text-emerald-700
                                  hover:bg-emerald-100
                                  dark:border-emerald-900/50
                                  dark:bg-emerald-950/30
                                  dark:text-emerald-300
                                `
                                : `
                                  border-stone-200
                                  bg-stone-100
                                  text-stone-600
                                  hover:bg-stone-200
                                  dark:border-stone-700
                                  dark:bg-stone-800
                                  dark:text-stone-300
                                `
                            }
                          `}
                        >
                          {place.isActive ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}

                          {place.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <div className="inline-flex items-center gap-1 rounded-xl border border-stone-200/80 bg-stone-50 p-1 shadow-sm dark:border-stone-700 dark:bg-stone-800/80">
                            <button
                              onClick={() => {
                                setPlaceToEdit(place);
                                setIsModalOpen(true);
                              }}
                              title="Edit place"
                              className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg
                                text-stone-400
                                transition-all duration-200
                                hover:bg-white
                                hover:text-amber-700
                                hover:shadow-sm
                                dark:hover:bg-stone-700
                                dark:hover:text-amber-300
                              "
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeletePlace(place._id, place.name)
                              }
                              title="Delete place"
                              className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg
                                text-stone-400
                                transition-all duration-200
                                hover:bg-red-50
                                hover:text-red-600
                                hover:shadow-sm
                                dark:hover:bg-red-950/40
                                dark:hover:text-red-400
                              "
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =====================================================
            MODALS
        ===================================================== */}

        <PlaceFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setPlaceToEdit(null);
          }}
          onSave={handleSavePlace}
          placeToEdit={placeToEdit}
        />

        <ChangeLogoModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
