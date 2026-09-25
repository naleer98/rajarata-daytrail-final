import Place from '../models/Place.js';
import { randomUUID } from 'node:crypto';
import { fail, validId, placeInput, respondError } from '../utils/validation.js';

export const getPlaces = async (req, res) => {
  try {
    const { category, search, all } = req.query;
    const query = all === 'true' && req.user?.role === 'admin' ? {} : { isActive: true };
    if (category && category !== 'All') query.category = category;
    if (search !== undefined) {
      if (typeof search !== 'string' || search.length > 200) throw fail('Search must be text up to 200 characters.');
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (escaped) query.$or = ['name', 'description', 'address'].map(field => ({ [field]: new RegExp(escaped, 'i') }));
    }
    const places = await Place.find(query).sort({ distanceFromHome: 1 });
    res.json({ success: true, count: places.length, data: places });
  } catch (error) { respondError(res, error); }
};
export const getPlaceById = async (req, res) => {
  try {
    if (!validId(req.params.id)) throw fail('Invalid place ID.');
    const place = await Place.findOne({ _id: req.params.id, isActive: true });
    if (!place) throw fail('Place of interest not found.', 404);
    res.json({ success: true, data: place });
  } catch (error) { respondError(res, error); }
};
export const createPlace = async (req, res) => {
  try {
    const data = placeInput(req.body);
    const base = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'place';
    const place = await Place.create({ ...data, slug: `${base}-${randomUUID()}` });
    res.status(201).json({ success: true, message: 'Place created successfully.', data: place });
  } catch (error) { respondError(res, error); }
};
export const updatePlace = async (req, res) => {
  try {
    if (!validId(req.params.id)) throw fail('Invalid place ID.');
    const place = await Place.findById(req.params.id);
    if (!place) throw fail('Place not found.', 404);
    const data = placeInput(req.body, place.toObject());
    const updated = await Place.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, message: 'Place updated successfully.', data: updated });
  } catch (error) { respondError(res, error); }
};
export const deletePlace = async (req, res) => {
  try {
    if (!validId(req.params.id)) throw fail('Invalid place ID.');
    const place = await Place.findById(req.params.id);
    if (!place) throw fail('Place not found.', 404);
    await place.deleteOne();
    res.json({ success: true, message: 'Place removed successfully.' });
  } catch (error) { respondError(res, error); }
};
