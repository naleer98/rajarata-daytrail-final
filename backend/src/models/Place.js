import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, 'Place description is required'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Religious',
        'Heritage',
        'Nature',
        'Cultural',
        'Museum',
        'Recreational',
        'Restaurant',
        'Public Place',
      ],
    },

    address: {
      type: String,
      required: [true, 'Address or location is required'],
    },

    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },

    openingTime: {
      type: String,
      default: '',
    },

    closingTime: {
      type: String,
      default: '',
    },

    visitDuration: {
      type: Number,
      required: [true, 'Estimated visit duration in minutes is required'],
      default: 60,
    },

    entryFee: {
      type: String,
      default: 'Free',
    },

    contactNumber: {
      type: String,
      default: 'N/A',
    },

    images: {
      type: [String],
      default: [],
    },

    travelTips: {
      type: String,
      default: '',
    },

    dressCode: {
      type: String,
      default: 'Modest casual attire.',
    },

    facilities: {
      type: [String],
      default: [],
    },

    bestVisitTime: {
      type: String,
      default: 'Morning or late afternoon',
    },

    distanceFromHome: {
      type: Number,
      required: true,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model('Place', placeSchema);

export default Place;