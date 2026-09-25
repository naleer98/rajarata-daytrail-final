import Itinerary from '../models/Itinerary.js';
import Place from '../models/Place.js';
import { planOneDayTrip } from '../utils/plannerEngine.js';
import { fail, validId, validTime, homeCoordinates, respondError } from '../utils/validation.js';

async function generateFromData(ids, startTime = '08:00', pace = 'Balanced') {
  if (!Array.isArray(ids) || ids.length === 0) throw fail('Please select at least one place.');
  if (ids.some(id => !validId(id))) throw fail('Each selected place must have a valid ID.');
  if (!validTime(startTime)) throw fail('Start time must use HH:MM.');
  if (!['Relaxed', 'Balanced', 'Fast'].includes(pace)) throw fail('Select a valid travel pace.');
  const uniqueIds = [...new Set(ids)];
  const places = await Place.find({ _id: { $in: uniqueIds }, isActive: true });
  if (places.length !== uniqueIds.length) throw fail('Some selected places are no longer available. Refresh the catalogue.', 409);
  return planOneDayTrip({ places, homeCoord: homeCoordinates(), startTime, pace });
}
export const generateItinerary = async (req, res) => {
  try {
    const { placeIds, startTime = '08:00', pace = 'Balanced' } = req.body || {};
    const data = await generateFromData(placeIds, startTime, pace);
    res.json({ success: true, data });
  } catch (error) { respondError(res, error); }
};
export const saveItinerary = async (req, res) => {
  try {
    const { title = 'Anuradhapura Day Tour', visitDate, startTime = '08:00', pace = 'Balanced', selectedPlaces } = req.body || {};
    if (typeof title !== 'string' || !title.trim() || title.length > 200) throw fail('A title of 1 to 200 characters is required.');
    const date = visitDate ? new Date(visitDate) : new Date();
    if (Number.isNaN(date.getTime())) throw fail('Provide a valid visit date.');
    // Recalculate from stored places rather than trusting client-supplied totals or route data.
    const plan = await generateFromData(selectedPlaces, startTime, pace);
    const routeOrder = plan.routeOrder.map((stop, index) => ({
      place: stop.place._id, order: stop.order,
      estimatedArrival: stop.estimatedArrival, estimatedDeparture: stop.estimatedDeparture,
      stayDurationMinutes: stop.stayDurationMinutes,
      travelTimeToNextMinutes: plan.routeOrder[index + 1]?.travelTimeFromPrevMinutes ?? plan.returnTravelMinutes,
    }));
    const itinerary = await Itinerary.create({
      userId: req.user._id, title: title.trim(), visitDate: date, startTime, pace,
      selectedPlaces: plan.routeOrder.map(stop => stop.place._id), routeOrder,
      totalDistance: plan.totalDistanceKm, totalTravelTime: plan.totalTravelMinutes,
      expectedEndTime: plan.expectedEndTime, warnings: plan.warnings,
    });
    res.status(201).json({ success: true, message: 'Itinerary saved successfully.', data: itinerary });
  } catch (error) { respondError(res, error); }
};

/**
 * @desc    Get all saved itineraries for the logged-in user (FR-045)
 * @route   GET /api/itineraries/my-plans
 * @access  Private (Registered Users Only)
 */
export const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user._id })
      .populate('selectedPlaces', 'name category images openingTime closingTime')
      .populate('routeOrder.place', 'name category address images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries,
    });
  } catch (error) {
    console.error('[Get My Plans Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your saved itineraries.',
    });
  }
};

/**
 * @desc    Delete a saved itinerary
 * @route   DELETE /api/itineraries/:id
 * @access  Private (Registered Users Only)
 */
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found or you do not have permission to delete it.',
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Itinerary deleted successfully.',
    });
  } catch (error) {
    console.error('[Delete Itinerary Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary.',
    });
  }
};