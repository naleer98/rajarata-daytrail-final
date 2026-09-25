import mongoose from 'mongoose';

const routeStopSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  estimatedArrival: {
    type: String,
    required: true,
  },
  estimatedDeparture: {
    type: String,
    required: true,
  },
  stayDurationMinutes: {
    type: Number,
    required: true,
  },
  travelTimeToNextMinutes: {
    type: Number,
    default: 0,
  },
});

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Itinerary title is required'],
      default: 'My Anuradhapura Day Trip',
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    startTime: {
      type: String,
      default: '08:00',
    },
    pace: {
      type: String,
      enum: ['Relaxed', 'Balanced', 'Fast'],
      default: 'Balanced',
    },
    selectedPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
    routeOrder: [routeStopSchema],
    totalDistance: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTravelTime: {
      type: Number,
      required: true,
      default: 0,
    },
    expectedEndTime: {
      type: String,
      required: true,
    },
    warnings: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;