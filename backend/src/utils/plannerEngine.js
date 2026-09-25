import { fail, validTime } from './validation.js';
import { calculateHaversineDistance } from './distance.js';

// Average local travel speed in Anuradhapura area (km/h) for tuk-tuk/car
const AVERAGE_SPEED_KMH = 30;

/**
 * Converts "HH:MM" string into total minutes from midnight.
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 480; // default 8:00 AM (480 mins)
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Converts total minutes from midnight into 12-hour AM/PM and 24-hour "HH:MM" format.
 */
export const minutesToTime = (totalMinutes) => {
  // Normalize to 24-hour cycle
  const normalized = Math.floor(totalMinutes) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  // Format 12-hour for friendly display
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayTime = `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;

  return {
    time24: `${hh}:${mm}`,
    displayTime,
  };
};

/**
 * Adjusts base visit duration based on user-selected travel pace.
 * - Relaxed: +25% duration for slow, immersive visit
 * - Balanced: standard estimated duration
 * - Fast: -25% duration to fit more locations
 */
export const adjustDurationForPace = (baseDuration, pace) => {
  const duration = Number(baseDuration) || 45;
  switch (pace) {
    case 'Relaxed':
      return Math.round(duration * 1.25);
    case 'Fast':
      return Math.max(20, Math.round(duration * 0.75));
    case 'Balanced':
    default:
      return duration;
  }
};

/**
 * Estimates travel time in minutes between two coordinate pairs.
 * Formula: (Distance / Speed) * 60 + 5 minutes buffer for parking/traffic
 */
export const estimateTravelTimeMinutes = (lat1, lon1, lat2, lon2) => {
  const distanceKm = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  if (distanceKm <= 0.2) return 5; // Minimal buffer for adjacent places
  const travelMinutes = Math.round((distanceKm / AVERAGE_SPEED_KMH) * 60) + 5;
  return travelMinutes;
};

/**
 * Generates an optimized one-day itinerary from selected places.
 *
 * @param {Array} places - Array of Mongoose Place objects
 * @param {Object} homeCoord - { lat, lng } registered home coordinate
 * @param {string} startTime - "HH:MM" (default "08:00")
 * @param {string} pace - "Relaxed" | "Balanced" | "Fast"
 */
export const planOneDayTrip = ({ places, homeCoord, startTime = '08:00', pace = 'Balanced' }) => {
  if (!places || places.length === 0) {
    throw new Error('Please select at least one place of interest to plan your trip.');
  }

  if (!validTime(startTime)) throw fail('Start time must use HH:MM.');
  if (!['Relaxed', 'Balanced', 'Fast'].includes(pace)) throw fail('Select a valid travel pace.');
  const unvisited = [...places];
  const orderedRoute = [];
  const warnings = [];

  let currentLat = homeCoord.lat;
  let currentLng = homeCoord.lng;
  let currentMinutes = timeToMinutes(startTime);
  let totalDistanceKm = 0;
  let totalTravelMinutes = 0;
  let stopNumber = 1;

  // Nearest-Next-Place Sequencing Algorithm
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let shortestDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateHaversineDistance(
        currentLat,
        currentLng,
        unvisited[i].coordinates.lat,
        unvisited[i].coordinates.lng
      );
      if (dist < shortestDistance) {
        shortestDistance = dist;
        nearestIndex = i;
      }
    }

    const currentPlace = unvisited.splice(nearestIndex, 1)[0];

    // Calculate travel from previous position to this place
    const travelTime = estimateTravelTimeMinutes(
      currentLat,
      currentLng,
      currentPlace.coordinates.lat,
      currentPlace.coordinates.lng
    );

    totalDistanceKm += shortestDistance;
    totalTravelMinutes += travelTime;

    // Arrival time
    const arrivalMinutes = currentMinutes + travelTime;
    const arrivalTime = minutesToTime(arrivalMinutes);

    // Visit stay duration based on pace
    const stayMinutes = adjustDurationForPace(currentPlace.visitDuration, pace);
    const departureMinutes = arrivalMinutes + stayMinutes;
    const departureTime = minutesToTime(departureMinutes);

    // Conflict Detection (FR-038 to FR-041)
    const hasOpen = validTime(currentPlace.openingTime);
    const hasClose = validTime(currentPlace.closingTime);
    let placeOpenMins = hasOpen ? timeToMinutes(currentPlace.openingTime) : null;
    let placeCloseMins = hasClose ? timeToMinutes(currentPlace.closingTime) : null;
    if (hasOpen && hasClose && placeCloseMins < placeOpenMins) {
      if (arrivalMinutes <= placeCloseMins) placeOpenMins -= 1440;
      else placeCloseMins += 1440;
    }

    if (hasClose && arrivalMinutes > placeCloseMins) {
      warnings.push(
        `Schedule Alert at "${currentPlace.name}": Expected arrival is ${arrivalTime.displayTime}, but it closes at ${minutesToTime(placeCloseMins).displayTime}.`
      );
    } else if (hasOpen && arrivalMinutes < placeOpenMins) {
      warnings.push(
        `Early Arrival at "${currentPlace.name}": Expected arrival is ${arrivalTime.displayTime}, but it does not open until ${minutesToTime(placeOpenMins).displayTime}.`
      );
    }

    if (hasClose && arrivalMinutes <= placeCloseMins && departureMinutes > placeCloseMins) {
      warnings.push(`Visit at "${currentPlace.name}" would finish after closing time. Shorten the visit or change the start time.`);
    }

    orderedRoute.push({
      place: currentPlace,
      order: stopNumber++,
      travelTimeFromPrevMinutes: travelTime,
      distanceFromPrevKm: Math.round(shortestDistance * 10) / 10,
      estimatedArrival: arrivalTime.time24,
      displayArrival: arrivalTime.displayTime,
      stayDurationMinutes: stayMinutes,
      estimatedDeparture: departureTime.time24,
      displayDeparture: departureTime.displayTime,
    });

    // Advance pointer for next stop
    currentLat = currentPlace.coordinates.lat;
    currentLng = currentPlace.coordinates.lng;
    currentMinutes = departureMinutes;
  }

  // Calculate return trip distance back to Home
  const returnDistance = calculateHaversineDistance(
    currentLat,
    currentLng,
    homeCoord.lat,
    homeCoord.lng
  );
  const returnTravelMinutes = estimateTravelTimeMinutes(
    currentLat,
    currentLng,
    homeCoord.lat,
    homeCoord.lng
  );

  totalDistanceKm += returnDistance;
  totalTravelMinutes += returnTravelMinutes;

  const finalMinutes = currentMinutes + returnTravelMinutes;
  const finalEndTime = minutesToTime(finalMinutes);
  const endDayOffset = Math.floor(finalMinutes / 1440);
  if (endDayOffset > 0) warnings.push('This plan extends beyond the starting day. Select fewer places or start earlier.');

  return {
    startTime: minutesToTime(timeToMinutes(startTime)).displayTime,
    expectedEndTime: finalEndTime.displayTime + (endDayOffset ? ` (+${endDayOffset} day)` : ''),
    totalDurationMinutes: finalMinutes - timeToMinutes(startTime),
    endDayOffset,
    expectedEndTime24: finalEndTime.time24,
    pace,
    totalPlaces: orderedRoute.length,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    totalTravelMinutes,
    returnTravelMinutes,
    returnDistanceKm: Math.round(returnDistance * 10) / 10,
    routeOrder: orderedRoute,
    warnings,
  };
};