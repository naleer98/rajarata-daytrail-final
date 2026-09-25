import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PlaceCard from '../components/PlaceCard';
import PlaceDetailsModal from '../components/PlaceDetailsModal';

import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Compass,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Religious',
  'Heritage',
  'Nature',
  'Cultural',
  'Museum',
  'Recreational',
  'Restaurant',
  'Public Place',
];

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalPlace, setActiveModalPlace] = useState(null);

  // =========================================================
  // FETCH PLACES
  // =========================================================

  const fetchPlaces = async (
    category = selectedCategory,
    keyword = searchTerm
  ) => {
    try {
      setLoading(true);
      setError('');

      let url = '/places';
      const params = new URLSearchParams();

      if (category !== 'All') {
        params.append('category', category);
      }

      if (keyword.trim() !== '') {
        params.append('search', keyword.trim());
      }

      const queryString = params.toString();

      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await API.get(url);
      setPlaces(res.data.data || []);
    } catch (err) {
      console.error('Failed to load places:', err);
      setError(
        'Failed to load places. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedCategory]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    fetchPlaces('All', '');
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f3ed] dark:bg-stone-950">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative min-h-[400px] overflow-hidden
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: "url('/explore-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/76 to-black/38" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[130px]" />

        <div
          className="
            relative z-10 mx-auto flex min-h-[400px] max-w-[1600px]
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
                  text-[10px] font-black uppercase tracking-[0.13em]
                  text-amber-200 backdrop-blur-xl
                "
              >
                <Compass className="h-4 w-4 text-amber-400" />
                Curated Heritage Directory
              </div>

              <h1
                className="
                  max-w-3xl text-[42px] font-black leading-[1.02]
                  tracking-[-0.05em] text-white
                  drop-shadow-[0_6px_20px_rgba(0,0,0,.4)]
                  sm:text-[58px] lg:text-[62px]
                "
              >
                Explore Anuradhapura.
                <span
                  className="
                    mt-2 block bg-gradient-to-r
                    from-amber-300 via-amber-400 to-orange-500
                    bg-clip-text text-transparent
                  "
                >
                  Find Your Next Stop.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-stone-100/95 sm:text-[15px]">
                Browse verified historical stupas, rock temples, sacred places,
                scenic reservoirs and heritage attractions situated within
                25 km of your base.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Verified attraction data
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                  <Navigation className="h-3.5 w-3.5 text-amber-300" />
                  25 km discovery radius
                </span>
              </div>
            </div>

            {/* Overview Card */}
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
                    Explore Overview
                  </div>
                  <div className="mt-1 text-xs text-stone-400">
                    Your current discovery view
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-950">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-black text-white">
                    {places.length}
                  </div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Locations
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-black text-white">25 km</div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Radius
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-black text-white">
                    {CATEGORIES.length - 1}
                  </div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Categories
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
          DISCOVERY WORKSPACE
      ===================================================== */}

      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        {/* Search + Filters */}
        <div
          className="
            relative overflow-hidden rounded-[26px]
            border border-white/80 bg-white/95
            p-5 shadow-[0_16px_45px_rgba(51,38,23,.08)]
            backdrop-blur-xl
            dark:border-stone-800 dark:bg-stone-900/95
            sm:p-6
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/5" />

          <div className="relative">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-white dark:bg-white dark:text-stone-950">
                    <Search className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-[15px] font-black tracking-[-0.02em] text-stone-950 dark:text-white">
                      Discover Places
                    </h2>
                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Search by place name, category or attraction keyword
                    </p>
                  </div>
                </div>
              </div>

              {!loading && !error && (
                <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-[10px] font-bold text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {places.length} result{places.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search monuments, temples, lakes or keywords..."
                  className="
                    w-full rounded-2xl border border-stone-200
                    bg-stone-50/80 py-3.5 pl-11 pr-4
                    text-xs font-medium text-stone-800
                    outline-none transition-all
                    placeholder:text-stone-400
                    hover:border-stone-300
                    focus:border-amber-400 focus:bg-white
                    focus:ring-4 focus:ring-amber-500/10
                    dark:border-stone-700 dark:bg-stone-950
                    dark:text-white
                    sm:text-sm
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  group inline-flex items-center justify-center gap-2
                  rounded-2xl bg-gradient-to-r
                  from-amber-500 to-orange-500
                  px-7 py-3.5
                  text-sm font-black text-white
                  shadow-[0_12px_28px_rgba(217,119,6,.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_16px_34px_rgba(217,119,6,.30)]
                "
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>

            {/* Filters */}
            <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="mr-1 flex shrink-0 items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-stone-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter
              </span>

              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      whitespace-nowrap rounded-full
                      border px-4 py-2
                      text-[10px] font-bold
                      transition-all duration-200
                      ${
                        active
                          ? `
                            border-stone-950 bg-stone-950 text-white
                            shadow-md
                            dark:border-amber-400 dark:bg-amber-400
                            dark:text-stone-950
                          `
                          : `
                            border-stone-200 bg-white text-stone-600
                            hover:border-amber-200 hover:bg-amber-50
                            hover:text-amber-800
                            dark:border-stone-700 dark:bg-stone-900
                            dark:text-stone-300
                            dark:hover:border-amber-800
                            dark:hover:bg-amber-950/20
                          `
                      }
                    `}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================
            PLACE GRID
        ===================================================== */}

        <div className="mt-7">
          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-amber-500 border-t-transparent" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                Loading places catalog...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[26px] border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm font-bold">{error}</p>

              <button
                onClick={fetchPlaces}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          ) : places.length === 0 ? (
            <div
              className="
                rounded-[28px] border border-stone-200
                bg-white px-6 py-20 text-center
                shadow-sm
                dark:border-stone-800 dark:bg-stone-900
              "
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                <Sparkles className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-black text-stone-900 dark:text-white">
                No attractions matched your search
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-stone-500">
                Try checking your spelling or clear the current search filters.
              </p>

              <button
                onClick={handleResetFilters}
                className="
                  mt-5 rounded-2xl bg-stone-950
                  px-5 py-2.5 text-xs font-bold text-white
                  transition hover:bg-stone-800
                  dark:bg-white dark:text-stone-900
                "
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className="
                grid grid-cols-1 gap-5
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
              "
            >
              {places.map((place) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  onViewDetails={(p) => setActiveModalPlace(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {activeModalPlace && (
        <PlaceDetailsModal
          place={activeModalPlace}
          onClose={() => setActiveModalPlace(null)}
        />
      )}
    </div>
  );
};

export default Explore;
