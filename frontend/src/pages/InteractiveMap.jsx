import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import API from '../services/api';
import PlaceDetailsModal from '../components/PlaceDetailsModal';

import {
  Navigation,
  Eye,
  ExternalLink,
  Home,
  Compass,
  MapPin,
  Layers3,
  Sparkles,
  MapPinned,
  ShieldCheck,
} from 'lucide-react';

// =========================================================
// REGISTERED HOME LOCATION
// =========================================================

const DEFAULT_HOME_LOCATION = {
  lat: 8.3114,
  lng: 80.4037,
  name: 'Registered Starting Point (Home)',
};

// =========================================================
// PREMIUM MARKERS
// =========================================================

const homeIcon = L.divIcon({
  className: 'daytrail-home-marker',
  html: `
    <div class="daytrail-marker-wrap daytrail-home-wrap">
      <div class="daytrail-home-pulse"></div>
      <div class="daytrail-home-core">
        <span>⌂</span>
      </div>
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const categoryColors = {
  Religious: {
    start: '#b45309',
    end: '#92400e',
  },
  Heritage: {
    start: '#ea580c',
    end: '#c2410c',
  },
  Nature: {
    start: '#059669',
    end: '#047857',
  },
};

const createPlaceIcon = (category) => {
  const colors = categoryColors[category] || {
    start: '#d97706',
    end: '#b45309',
  };

  return L.divIcon({
    className: 'daytrail-place-marker',
    html: `
      <div class="daytrail-pin-shell">
        <div
          class="daytrail-pin"
          style="background:linear-gradient(135deg, ${colors.start}, ${colors.end});"
        >
          <span class="daytrail-pin-dot"></span>
        </div>
      </div>
    `,
    iconSize: [42, 48],
    iconAnchor: [21, 46],
  });
};

const InteractiveMap = () => {
  const [places, setPlaces] = useState([]);
  const [HOME_LOCATION, setHomeLocation] = useState(DEFAULT_HOME_LOCATION);
  const [mapError, setMapError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // =========================================================
  // LOAD PLACES
  // =========================================================

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const res = await API.get('/places');
        setPlaces(res.data.data || []);

        const health = await API.get('/health');

        setHomeLocation({
          lat: Number(health.data.homeLocation.latitude),
          lng: Number(health.data.homeLocation.longitude),
          name: 'Registered Starting Point (Home)',
        });
      } catch (err) {
        console.error('Error fetching places for map:', err);
        setMapError(
          'Some map information could not load. Available place details remain below.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredPlaces =
    selectedCategory === 'All'
      ? places
      : places.filter((place) => place.category === selectedCategory);

  const religiousCount = places.filter(
    (place) => place.category === 'Religious'
  ).length;

  const heritageCount = places.filter(
    (place) => place.category === 'Heritage'
  ).length;

  const natureCount = places.filter(
    (place) => place.category === 'Nature'
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f3ed] dark:bg-stone-950">
      {/* Leaflet UI polish */}
      <style>
        {`
          .daytrail-map .leaflet-control-zoom {
            border: 0 !important;
            box-shadow: 0 12px 30px rgba(28,25,23,.16) !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            margin: 16px !important;
          }

          .daytrail-map .leaflet-control-zoom a {
            width: 38px !important;
            height: 38px !important;
            line-height: 36px !important;
            border: 0 !important;
            color: #292524 !important;
            background: rgba(255,255,255,.94) !important;
            backdrop-filter: blur(12px);
            font-weight: 700 !important;
            transition: all .2s ease;
          }

          .daytrail-map .leaflet-control-zoom a:hover {
            background: #fff7ed !important;
            color: #c2410c !important;
          }

          .daytrail-map .leaflet-control-attribution {
            margin: 0 10px 8px 0 !important;
            padding: 4px 8px !important;
            border-radius: 10px !important;
            background: rgba(255,255,255,.82) !important;
            backdrop-filter: blur(10px);
            font-size: 9px !important;
            color: #78716c !important;
          }

          .daytrail-map .leaflet-popup-content-wrapper {
            border-radius: 20px !important;
            border: 1px solid rgba(231,229,228,.9) !important;
            box-shadow: 0 22px 50px rgba(28,25,23,.20) !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          .daytrail-map .leaflet-popup-content {
            margin: 0 !important;
            width: 248px !important;
          }

          .daytrail-map .leaflet-popup-tip {
            box-shadow: 4px 4px 12px rgba(28,25,23,.08) !important;
          }

          .daytrail-map .leaflet-popup-close-button {
            top: 9px !important;
            right: 9px !important;
            width: 28px !important;
            height: 28px !important;
            line-height: 25px !important;
            border-radius: 50% !important;
            background: rgba(0,0,0,.48) !important;
            color: white !important;
            font-size: 18px !important;
            z-index: 10 !important;
          }

          .daytrail-map .leaflet-popup-close-button:hover {
            background: rgba(0,0,0,.7) !important;
          }

          .daytrail-place-marker,
          .daytrail-home-marker {
            background: transparent !important;
            border: none !important;
          }

          .daytrail-pin-shell {
            width: 42px;
            height: 48px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            filter: drop-shadow(0 10px 12px rgba(0,0,0,.22));
            transition: transform .2s ease;
          }

          .daytrail-pin-shell:hover {
            transform: translateY(-3px) scale(1.06);
          }

          .daytrail-pin {
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 10px;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 8px 18px rgba(0,0,0,.18);
          }

          .daytrail-pin-dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: white;
            transform: rotate(45deg);
            box-shadow: 0 0 0 3px rgba(255,255,255,.16);
          }

          .daytrail-marker-wrap {
            width: 46px;
            height: 46px;
            position: relative;
            display: grid;
            place-items: center;
          }

          .daytrail-home-pulse {
            position: absolute;
            inset: 4px;
            border-radius: 999px;
            background: rgba(245,158,11,.22);
            animation: daytrailPulse 2.2s infinite;
          }

          .daytrail-home-core {
            width: 36px;
            height: 36px;
            border-radius: 14px;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg,#171513,#292524);
            border: 3px solid white;
            box-shadow: 0 10px 22px rgba(0,0,0,.25);
            color: #fbbf24;
            font-size: 20px;
            font-weight: 900;
            position: relative;
            z-index: 2;
          }

          @keyframes daytrailPulse {
            0% { transform: scale(.86); opacity: .85; }
            70% { transform: scale(1.25); opacity: 0; }
            100% { transform: scale(1.25); opacity: 0; }
          }

          .dark .daytrail-map .leaflet-tile-pane {
            filter: brightness(.72) saturate(.8) contrast(1.08);
          }

          .dark .daytrail-map .leaflet-control-zoom a {
            background: rgba(28,25,23,.94) !important;
            color: #f5f5f4 !important;
          }

          .dark .daytrail-map .leaflet-control-zoom a:hover {
            background: #292524 !important;
            color: #fbbf24 !important;
          }

          .dark .daytrail-map .leaflet-control-attribution {
            background: rgba(28,25,23,.84) !important;
            color: #a8a29e !important;
          }
        `}
      </style>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative min-h-[380px] overflow-hidden
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: "url('/map-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/78 to-black/42" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/92 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
        <div className="absolute -left-24 top-16 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex min-h-[380px] max-w-[1600px] items-center px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="max-w-3xl">
              <div
                className="
                  mb-5 inline-flex items-center gap-2
                  rounded-full border border-white/15
                  bg-white/[0.06]
                  px-4 py-2
                  text-[10px] font-extrabold uppercase
                  tracking-[0.13em]
                  text-amber-200
                  backdrop-blur-xl
                "
              >
                <Navigation className="h-4 w-4 text-amber-400" />
                Interactive Location Discovery
              </div>

              <h1
                className="
                  text-[42px] font-black leading-[1.01]
                  tracking-[-0.055em] text-white
                  drop-shadow-[0_7px_22px_rgba(0,0,0,.45)]
                  sm:text-[58px]
                "
                style={{
                  fontFamily: "'Arial Black', 'Segoe UI Black', 'Segoe UI', sans-serif",
                  fontWeight: 900,
                }}
              >
                Explore the Map.
                <span
                  className="
                    mt-2 block
                    bg-gradient-to-r
                    from-amber-300 via-amber-400 to-orange-500
                    bg-clip-text text-transparent
                  "
                  style={{ fontWeight: 900 }}
                >
                  Discover What Is Nearby.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-stone-100/95 sm:text-[15px]">
                View verified attractions around Anuradhapura, explore nearby
                heritage areas, and open place details directly from the map.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Verified locations
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-stone-200 backdrop-blur-md">
                  <Compass className="h-3.5 w-3.5 text-amber-300" />
                  25 km discovery radius
                </span>
              </div>
            </div>

            {/* Overview */}
            <div
              className="
                w-full max-w-[360px]
                rounded-[26px]
                border border-white/10
                bg-black/45
                p-5
                shadow-[0_22px_55px_rgba(0,0,0,.28)]
                backdrop-blur-xl
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-amber-300">
                    Map Overview
                  </div>
                  <div className="mt-1 text-xs text-stone-400">
                    Current discovery snapshot
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-950">
                  <MapPinned className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-extrabold text-white">
                    {filteredPlaces.length}
                  </div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Visible
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-extrabold text-white">25 km</div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Radius
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-xl font-extrabold text-white">3</div>
                  <div className="mt-1 text-[9px] text-stone-400">
                    Categories
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAP WORKSPACE
      ===================================================== */}

      <main className="mx-auto max-w-[1600px] space-y-5 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        {/* Premium toolbar */}
        <div
          className="
            flex flex-col gap-4
            rounded-[24px]
            border border-stone-200/80
            bg-white/95
            p-5
            shadow-[0_12px_35px_rgba(51,38,23,.07)]
            backdrop-blur-xl
            dark:border-stone-800
            dark:bg-stone-900/95
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950">
              <Navigation className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-stone-950 dark:text-white">
                Live Attraction Map
              </h2>
              <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                Click any marker to preview details or open Google Maps directions.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Category summary chips */}
            <div className="hidden items-center gap-2 xl:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[9px] font-bold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-700" />
                Religious {religiousCount}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-[9px] font-bold text-orange-800 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                Heritage {heritageCount}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[9px] font-bold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Nature {natureCount}
              </span>
            </div>

            {/* Filter */}
            <div
              className="
                flex items-center gap-2
                rounded-2xl
                border border-stone-200
                bg-stone-50
                px-3 py-2.5
                dark:border-stone-700
                dark:bg-stone-950
              "
            >
              <Layers3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="
                  cursor-pointer bg-transparent
                  text-[11px] font-bold
                  text-stone-800 outline-none
                  dark:text-stone-200
                "
              >
                <option value="All">
                  All Categories ({places.length})
                </option>
                <option value="Religious">Religious</option>
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
              </select>
            </div>
          </div>
        </div>

        {/* =================================================
            MAP CARD
        ================================================= */}

        <div
          className="
            relative z-0
            h-[650px] w-full
            overflow-hidden
            rounded-[30px]
            border border-stone-200/80
            bg-white
            shadow-[0_22px_70px_rgba(51,38,23,.13)]
            ring-1 ring-white/70
            dark:border-stone-800
            dark:bg-stone-900
            dark:ring-stone-800
          "
        >
          {/* top floating badge */}
          {!loading && !mapError && (
            <div
              className="
                pointer-events-none absolute left-5 top-5 z-[500]
                hidden items-center gap-2
                rounded-full
                border border-white/60
                bg-white/90
                px-3 py-2
                text-[10px] font-bold
                text-stone-700
                shadow-lg
                backdrop-blur-xl
                sm:flex
                dark:border-stone-700
                dark:bg-stone-900/90
                dark:text-stone-200
              "
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {filteredPlaces.length} places on map
            </div>
          )}

          {loading ? (
            <div className="flex h-full items-center justify-center bg-stone-100 dark:bg-stone-900">
              <div className="text-center">
                <div className="mx-auto h-11 w-11 animate-spin rounded-full border-[3px] border-amber-500 border-t-transparent" />
                <span className="mt-4 block text-xs font-bold text-stone-500">
                  Loading map data...
                </span>
              </div>
            </div>
          ) : (
            <>
              {mapError && (
                <div
                  role="alert"
                  className="
                    absolute inset-x-4 top-4 z-[600]
                    rounded-2xl
                    border border-amber-200
                    bg-amber-50/95
                    px-4 py-3
                    text-xs font-semibold
                    text-amber-900
                    shadow-lg
                    backdrop-blur-xl
                  "
                >
                  {mapError}
                </div>
              )}

              <MapContainer
                key={`${HOME_LOCATION.lat},${HOME_LOCATION.lng}`}
                center={[HOME_LOCATION.lat, HOME_LOCATION.lng]}
                zoom={12}
                scrollWheelZoom={true}
                className="daytrail-map"
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >
                <TileLayer
                  eventHandlers={{
                    tileerror: () =>
                      setMapError(
                        'Map tiles are unavailable. You can still view the place list and details.'
                      ),
                  }}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Home Marker */}
                <Marker
                  position={[HOME_LOCATION.lat, HOME_LOCATION.lng]}
                  icon={homeIcon}
                >
                  <Popup>
                    <div className="p-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-amber-300">
                          <Home className="h-4 w-4" />
                        </div>

                        <div>
                          <div className="font-black text-stone-900">
                            Home Base
                          </div>
                          <div className="mt-0.5 text-[10px] text-stone-500">
                            Registered starting point
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-stone-50 px-3 py-2.5 text-[10px] leading-5 text-stone-500">
                        {HOME_LOCATION.lat}, {HOME_LOCATION.lng}
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Place Markers */}
                {filteredPlaces.map((place) => (
                  <Marker
                    key={place._id}
                    position={[
                      place.coordinates.lat,
                      place.coordinates.lng,
                    ]}
                    icon={createPlaceIcon(place.category)}
                  >
                    <Popup>
                      <div className="overflow-hidden bg-white text-xs">
                        {/* Image */}
                        <div className="relative h-32 w-full overflow-hidden bg-stone-100">
                          <img
                            src={
                              place.images?.[0] ||
                              'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=500&q=80'
                            }
                            alt={place.name}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent" />

                          <div className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white backdrop-blur-md">
                            {place.category}
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="text-[14px] font-black leading-tight tracking-[-0.02em] text-stone-950">
                            {place.name}
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="text-[10px] text-stone-500">
                              {place.openingTime} - {place.closingTime}
                            </span>

                            <span className="rounded-lg bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-800">
                              {place.distanceFromHome} km
                            </span>
                          </div>

                          <div className="mt-3 flex gap-2 border-t border-stone-100 pt-3">
                            <button
                              onClick={() => setSelectedPlace(place)}
                              className="
                                flex flex-1 items-center justify-center gap-1.5
                                rounded-xl
                                bg-gradient-to-r from-amber-500 to-orange-500
                                px-3 py-2.5
                                text-[10px] font-black
                                text-white
                                shadow-sm
                                transition-all
                                hover:-translate-y-0.5
                                hover:shadow-md
                              "
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View Details
                            </button>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-xl
                                border border-stone-200
                                bg-stone-50
                                text-stone-700
                                transition
                                hover:border-amber-200
                                hover:bg-amber-50
                                hover:text-amber-700
                              "
                              title="Open directions in Google Maps"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </>
          )}
        </div>

        {/* =================================================
            LEGEND
        ================================================= */}

        <div
          className="
            flex flex-col gap-4
            rounded-[22px]
            border border-stone-200/80
            bg-white/95
            p-4
            text-xs text-stone-600
            shadow-sm
            backdrop-blur-xl
            dark:border-stone-800
            dark:bg-stone-900/95
            dark:text-stone-300
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="font-black text-stone-900 dark:text-white">
              Map Legend
            </span>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-stone-900 ring-2 ring-stone-200 dark:bg-white dark:ring-stone-700" />
              Home Base
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-700" />
              Religious
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-600" />
              Heritage
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-600" />
              Nature
            </div>
          </div>

          <span className="text-[10px] font-medium text-stone-400">
            Powered by OpenStreetMap & Leaflet
          </span>
        </div>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedPlace && (
        <PlaceDetailsModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
};

export default InteractiveMap;
