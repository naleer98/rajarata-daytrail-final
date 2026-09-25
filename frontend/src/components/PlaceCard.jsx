import React from 'react';
import {
  MapPin,
  Clock,
  Timer,
  Eye,
  ExternalLink,
  Ticket,
  ArrowUpRight,
} from 'lucide-react';

const categoryThemes = {
  Religious: {
    pill: 'border-amber-200/80 bg-amber-50/95 text-amber-900',
    dot: 'bg-amber-600',
    accent: 'from-amber-500 to-orange-500',
  },
  Heritage: {
    pill: 'border-orange-200/80 bg-orange-50/95 text-orange-900',
    dot: 'bg-orange-600',
    accent: 'from-orange-500 to-rose-500',
  },
  Nature: {
    pill: 'border-emerald-200/80 bg-emerald-50/95 text-emerald-900',
    dot: 'bg-emerald-600',
    accent: 'from-emerald-500 to-teal-500',
  },
  Cultural: {
    pill: 'border-violet-200/80 bg-violet-50/95 text-violet-900',
    dot: 'bg-violet-600',
    accent: 'from-violet-500 to-purple-500',
  },
  Museum: {
    pill: 'border-sky-200/80 bg-sky-50/95 text-sky-900',
    dot: 'bg-sky-600',
    accent: 'from-sky-500 to-blue-500',
  },
  Recreational: {
    pill: 'border-teal-200/80 bg-teal-50/95 text-teal-900',
    dot: 'bg-teal-600',
    accent: 'from-teal-500 to-cyan-500',
  },
  Restaurant: {
    pill: 'border-rose-200/80 bg-rose-50/95 text-rose-900',
    dot: 'bg-rose-600',
    accent: 'from-rose-500 to-pink-500',
  },
  'Public Place': {
    pill: 'border-stone-200/80 bg-stone-50/95 text-stone-900',
    dot: 'bg-stone-600',
    accent: 'from-stone-500 to-stone-700',
  },
};

const PlaceCard = ({ place, onViewDetails }) => {
  const theme =
    categoryThemes[place.category] || categoryThemes['Public Place'];

  const defaultImage =
    'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=900&q=80';

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;

  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-[26px]
        border border-stone-200/80
        bg-white
        shadow-[0_12px_35px_rgba(51,38,23,.07)]
        transition-all duration-500
        hover:-translate-y-1.5
        hover:border-stone-300
        hover:shadow-[0_24px_55px_rgba(51,38,23,.13)]
        dark:border-stone-800
        dark:bg-stone-900
        dark:hover:border-stone-700
      "
    >
      {/* Category accent */}
      <div
        className={`absolute inset-x-0 top-0 z-20 h-[3px] bg-gradient-to-r ${theme.accent}`}
      />

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative h-[230px] w-full shrink-0 overflow-hidden bg-stone-100 sm:h-[245px] 2xl:h-[220px]">
        <img
          src={place.images?.[0] || defaultImage}
          alt={place.name}
          className="
            h-full w-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-[1.055]
          "
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-black/20" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span
            className={`
              inline-flex items-center gap-1.5
              rounded-full border px-3 py-1.5
              text-[9px] font-black uppercase tracking-[0.13em]
              shadow-sm backdrop-blur-xl
              ${theme.pill}
            `}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
            {place.category}
          </span>
        </div>

        {/* Image metadata */}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div
            className="
              inline-flex min-w-0 items-center gap-1.5
              rounded-full border border-white/10
              bg-black/55 px-3 py-2
              text-[10px] font-bold text-white
              shadow-lg backdrop-blur-xl
            "
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span className="truncate">
              {place.distanceFromHome} km from home
            </span>
          </div>

          <div
            className="
              inline-flex shrink-0 items-center gap-1.5
              rounded-full border border-white/50
              bg-white/90 px-3 py-2
              text-[10px] font-black text-stone-900
              shadow-lg backdrop-blur-xl
            "
          >
            <Timer className="h-3.5 w-3.5 text-amber-700" />
            ~{place.visitDuration}m
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="flex flex-1 flex-col p-5">
        <div>
          <h3
            className="
              line-clamp-2
              text-[18px] font-black leading-[1.15]
              tracking-[-0.025em]
              text-stone-950
              transition-colors duration-300
              group-hover:text-amber-700
              dark:text-white
              dark:group-hover:text-amber-400
              2xl:text-[17px]
            "
          >
            {place.name}
          </h3>

          <p className="mt-2 flex items-start gap-1.5 text-[10px] font-medium leading-4 text-stone-400">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="line-clamp-1">{place.address}</span>
          </p>

          <p className="mt-3 line-clamp-3 text-[12px] leading-6 text-stone-600 dark:text-stone-400">
            {place.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-5 grid grid-cols-1 gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold text-stone-500 dark:text-stone-400">
              <Clock className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                {place.openingTime} - {place.closingTime}
              </span>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-[0.08em] text-stone-400">
              Open hours
            </span>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#faf7ef] px-3 py-2.5 dark:bg-stone-950">
            <Ticket className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-400" />
            <span
              className="
                line-clamp-2 text-[9px] font-bold uppercase
                leading-4 tracking-[0.04em]
                text-amber-900
                dark:text-amber-300
              "
              title={place.entryFee || 'Free Entry'}
            >
              {place.entryFee || 'Free Entry'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            onClick={() => onViewDetails(place)}
            className="
              group/button flex flex-1 items-center justify-center gap-2
              rounded-2xl
              bg-stone-950 px-4 py-3
              text-[11px] font-black text-white
              shadow-[0_8px_20px_rgba(28,25,23,.14)]
              transition-all duration-300
              hover:bg-amber-600
              hover:shadow-[0_12px_26px_rgba(217,119,6,.24)]
              dark:bg-white dark:text-stone-950
              dark:hover:bg-amber-400
            "
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
            <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5 group-hover/button:opacity-100" />
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex h-[42px] w-[42px] shrink-0
              items-center justify-center
              rounded-2xl border border-stone-200
              bg-stone-50 text-stone-500
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-amber-300
              hover:bg-amber-50
              hover:text-amber-700
              dark:border-stone-700
              dark:bg-stone-800
              dark:text-stone-300
              dark:hover:border-amber-800
              dark:hover:bg-amber-950/30
              dark:hover:text-amber-300
            "
            title="Navigate with Google Maps"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;
