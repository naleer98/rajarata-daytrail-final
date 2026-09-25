import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Timer,
  Coins,
  Phone,
  Sun,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Compass,
  Navigation,
  Images,
} from 'lucide-react';

const PlaceDetailsModal = ({ place, onClose }) => {
  if (!place) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;

  const heroImage =
    place.images && place.images[0]
      ? place.images[0]
      : 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80';

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        overflow-y-auto
        bg-stone-950/75
        p-2 sm:p-5
        backdrop-blur-md
        animate-in fade-in duration-200
      "
    >
      <div
        className="
          relative flex w-full max-w-4xl flex-col
          overflow-hidden
          rounded-[30px]
          border border-white/10
          bg-white
          shadow-[0_28px_90px_rgba(0,0,0,0.38)]
          max-h-[94vh]
          dark:border-stone-800
          dark:bg-stone-950
        "
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="relative h-[250px] shrink-0 bg-stone-900 sm:h-[290px]">
          <img
            src={heroImage}
            alt={place.name}
            className="h-full w-full object-cover"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

          {/* Category */}
          <div
            className="
              absolute left-5 top-5
              inline-flex items-center gap-2
              rounded-full
              border border-white/15
              bg-black/25
              px-3 py-1.5
              text-[10px] font-black uppercase
              tracking-[0.12em]
              text-amber-100
              backdrop-blur-xl
              sm:left-6 sm:top-6
            "
          >
            <Compass className="h-3.5 w-3.5 text-amber-300" />
            {place.category}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close place details"
            className="
              absolute right-4 top-4
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-white/15
              bg-black/20
              text-white
              shadow-lg
              backdrop-blur-xl
              transition-all duration-200
              hover:scale-105
              hover:bg-white
              hover:text-stone-900
              sm:right-5 sm:top-5
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* Hero text */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="max-w-3xl">
              <h2
                className="
                  text-[30px] font-black
                  leading-tight tracking-[-0.04em]
                  text-white
                  sm:text-[38px]
                "
              >
                {place.name}
              </h2>

              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-stone-200 sm:text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <span>{place.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ===================================================== */}

        <div
          className="
            flex-1 overflow-y-auto
            bg-white
            dark:bg-stone-950
          "
        >
          <div className="space-y-7 p-5 sm:p-7">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div
                className="
                  rounded-2xl
                  border border-stone-200/80
                  bg-stone-50/80
                  p-4
                  dark:border-stone-800
                  dark:bg-stone-900
                "
              >
                <div className="flex items-center gap-2 text-stone-400">
                  <Navigation className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                    Distance
                  </span>
                </div>

                <div className="mt-2 text-[15px] font-black text-amber-800 dark:text-amber-300">
                  {place.distanceFromHome} km
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-stone-200/80
                  bg-stone-50/80
                  p-4
                  dark:border-stone-800
                  dark:bg-stone-900
                "
              >
                <div className="flex items-center gap-2 text-stone-400">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                    Visiting Hours
                  </span>
                </div>

                <div className="mt-2 text-[13px] font-black text-stone-900 dark:text-white">
                  {place.openingTime} - {place.closingTime}
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-stone-200/80
                  bg-stone-50/80
                  p-4
                  dark:border-stone-800
                  dark:bg-stone-900
                "
              >
                <div className="flex items-center gap-2 text-stone-400">
                  <Timer className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                    Visit Time
                  </span>
                </div>

                <div className="mt-2 text-[13px] font-black text-stone-900 dark:text-white">
                  ~{place.visitDuration} minutes
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-stone-200/80
                  bg-stone-50/80
                  p-4
                  dark:border-stone-800
                  dark:bg-stone-900
                "
              >
                <div className="flex items-center gap-2 text-stone-400">
                  <Coins className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                    Entry Ticket
                  </span>
                </div>

                <div
                  className="
                    mt-2 truncate
                    text-[13px] font-black
                    text-emerald-700
                    dark:text-emerald-400
                  "
                  title={place.entryFee || 'Free'}
                >
                  {place.entryFee || 'Free'}
                </div>
              </div>
            </div>

            {/* Main context */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                  Historical & Visitor Context
                </h4>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-stone-700 dark:text-stone-300">
                {place.description}
              </p>
            </section>

            {/* Etiquette */}
            <section
              className="
                relative overflow-hidden
                rounded-[24px]
                border border-amber-200/80
                bg-gradient-to-br
                from-amber-50
                via-white
                to-orange-50/60
                p-5
                shadow-[0_8px_24px_rgba(180,83,9,0.06)]
                dark:border-amber-900/40
                dark:from-amber-950/30
                dark:via-stone-900
                dark:to-orange-950/20
              "
            >
              <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-amber-300/25 blur-3xl" />

              <div className="relative flex items-start gap-3">
                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-amber-200
                    bg-white
                    text-amber-700
                    shadow-sm
                    dark:border-amber-900/50
                    dark:bg-stone-900
                    dark:text-amber-300
                  "
                >
                  <ShieldAlert className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-sm font-black text-amber-950 dark:text-amber-200">
                    Cultural Etiquette & Sacred Protocol
                  </h4>

                  <p className="mt-1 text-[11px] text-amber-800/70 dark:text-amber-300/70">
                    Please review before visiting this location.
                  </p>
                </div>
              </div>

              <div
                className="
                  relative mt-4
                  rounded-2xl
                  border border-amber-200/70
                  bg-white/85
                  px-4 py-3.5
                  text-xs leading-6
                  text-amber-950
                  dark:border-amber-900/40
                  dark:bg-stone-950/60
                  dark:text-amber-100
                "
              >
                <span className="font-black">Visitor Dress Guidance:</span>{' '}
                {place.dressCode || 'No specific guidance recorded.'}
              </div>
            </section>

            {/* Visit advice */}
            {(place.bestVisitTime || place.travelTips) && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                    Visit Advice
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {place.bestVisitTime && (
                    <div
                      className="
                        rounded-2xl
                        border border-stone-200/80
                        bg-stone-50/70
                        p-4
                        dark:border-stone-800
                        dark:bg-stone-900
                      "
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300">
                          <Sun className="h-4 w-4" />
                        </div>

                        <div className="text-xs font-black text-stone-900 dark:text-white">
                          Best Visiting Time
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-stone-600 dark:text-stone-400">
                        {place.bestVisitTime}
                      </p>
                    </div>
                  )}

                  {place.travelTips && (
                    <div
                      className="
                        rounded-2xl
                        border border-stone-200/80
                        bg-stone-50/70
                        p-4
                        dark:border-stone-800
                        dark:bg-stone-900
                      "
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300">
                          <Sparkles className="h-4 w-4" />
                        </div>

                        <div className="text-xs font-black text-stone-900 dark:text-white">
                          Local Travel Tip
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-stone-600 dark:text-stone-400">
                        {place.travelTips}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Contact */}
            {place.contactNumber && place.contactNumber !== 'N/A' && (
              <section>
                <div
                  className="
                    flex items-center justify-between gap-4
                    rounded-2xl
                    border border-stone-200/80
                    bg-white
                    px-4 py-3.5
                    shadow-sm
                    dark:border-stone-800
                    dark:bg-stone-900
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <Phone className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.12em] text-stone-400">
                        Contact
                      </div>
                      <div className="mt-0.5 text-xs font-bold text-stone-800 dark:text-stone-200">
                        {place.contactNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Gallery */}
            {place.images?.length > 1 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Images className="h-4 w-4 text-amber-600" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                    More Views
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {place.images.slice(1).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${place.name} view ${index + 2}`}
                      className="
                        h-28 w-full rounded-2xl
                        border border-stone-200
                        object-cover
                        shadow-sm
                        transition-transform duration-300
                        hover:scale-[1.02]
                        dark:border-stone-800
                      "
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Facilities */}
            {place.facilities && place.facilities.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                    Available On-Site Facilities
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {place.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="
                        inline-flex items-center gap-2
                        rounded-full
                        border border-stone-200
                        bg-stone-50
                        px-3 py-2
                        text-[11px] font-semibold
                        text-stone-700
                        dark:border-stone-800
                        dark:bg-stone-900
                        dark:text-stone-300
                      "
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {fac}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* =====================================================
            STICKY FOOTER
        ===================================================== */}

        <div
          className="
            shrink-0
            border-t border-stone-200
            bg-white/95
            px-5 py-4
            backdrop-blur-xl
            dark:border-stone-800
            dark:bg-stone-950/95
            sm:px-7
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="hidden text-[10px] font-mono text-stone-400 sm:inline">
              Geo: {place.coordinates.lat}, {place.coordinates.lng}
            </span>

            <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
              <button
                onClick={onClose}
                className="
                  flex-1 rounded-xl
                  border border-stone-300
                  bg-white
                  px-4 py-2.5
                  text-xs font-bold
                  text-stone-700
                  transition-all duration-200
                  hover:bg-stone-100
                  sm:flex-none
                  dark:border-stone-700
                  dark:bg-stone-900
                  dark:text-stone-300
                  dark:hover:bg-stone-800
                "
              >
                Close
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex flex-[2] items-center justify-center gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-amber-600
                  to-orange-600
                  px-5 py-2.5
                  text-xs font-black
                  text-white
                  shadow-[0_10px_24px_rgba(180,83,9,0.25)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_30px_rgba(180,83,9,0.32)]
                  sm:flex-none
                "
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Navigate in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsModal;
