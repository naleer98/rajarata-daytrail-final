import { calculateHaversineDistance } from './distance.js';

export const fail = (message, status = 400) => Object.assign(new Error(message), { status });
export const validTime = value => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export const validId = value => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
export const homeCoordinates = () => ({
  lat: Number(process.env.HOME_LAT || 8.3114),
  lng: Number(process.env.HOME_LNG || 80.4037),
});
export const respondError = (res, error) => res.status(
  error.status || (error.code === 11000 ? 409 : ['ValidationError', 'CastError'].includes(error.name) ? 400 : 500)
).json({ success: false, message: error.status || error.name === 'ValidationError' ? error.message : error.code === 11000 ? 'This record already exists.' : 'Unable to process this request.' });

export function placeInput(body = {}, existing = {}) {
  const fields = ['name', 'description', 'category', 'address', 'coordinates', 'openingTime', 'closingTime', 'visitDuration', 'entryFee', 'contactNumber', 'images', 'travelTips', 'dressCode', 'facilities', 'bestVisitTime', 'isActive'];
  const data = {};
  for (const key of fields) if (body[key] !== undefined) data[key] = body[key];
  const merged = { ...existing, ...data };
  for (const key of ['name', 'description', 'address']) {
    if (typeof merged[key] !== 'string' || !merged[key].trim()) throw fail(`${key} is required.`);
    if (key in data) data[key] = data[key].trim();
  }
  const categories = ['Religious', 'Heritage', 'Nature', 'Cultural', 'Museum', 'Recreational', 'Restaurant', 'Public Place'];
  if (!categories.includes(merged.category)) throw fail('Select a valid category.');
  const {lat, lng} = merged.coordinates || {};
  if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw fail('Valid latitude and longitude are required.');
  const home = homeCoordinates();
  const distance = calculateHaversineDistance(home.lat, home.lng, lat, lng);
  if (!Number.isFinite(distance)) throw fail('Home coordinates are not configured correctly.', 500);
  if (distance > 25) throw fail('Place must be within 25 km of the registered home.');
  data.distanceFromHome = Math.round(distance * 10) / 10;
  for (const key of ['openingTime', 'closingTime']) {
    if (merged[key] !== undefined && merged[key] !== '' && !validTime(merged[key])) throw fail(`${key} must use HH:MM, or be blank when unknown.`);
  }
  if (merged.visitDuration !== undefined && (typeof merged.visitDuration !== 'number' || !Number.isFinite(merged.visitDuration) || merged.visitDuration <= 0 || merged.visitDuration > 1440)) throw fail('Visit duration must be greater than zero and at most 1440 minutes.');
  if (merged.isActive !== undefined && typeof merged.isActive !== 'boolean') throw fail('Active status must be true or false.');
  for (const key of ['images', 'facilities']) if (merged[key] !== undefined && (!Array.isArray(merged[key]) || merged[key].some(x => typeof x !== 'string'))) throw fail(`${key} must be a list of text values.`);
  for (const url of merged.images || []) if (!/^(https?:\/\/|\/uploads\/)/i.test(url)) throw fail('Images must use an HTTP(S) URL or a local uploads path.');
  for (const key of ['entryFee', 'contactNumber', 'travelTips', 'dressCode', 'bestVisitTime']) if (merged[key] !== undefined && typeof merged[key] !== 'string') throw fail(`${key} must be text.`);
  return data;
}
