import express from 'express';
import {
  generateItinerary,
  saveItinerary,
  getUserItineraries,
  deleteItinerary,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: generate plan algorithm
router.post('/generate', generateItinerary);

// Private routes: saving and viewing plans
router.post('/save', protect, saveItinerary);
router.get('/my-plans', protect, getUserItineraries);
router.delete('/:id', protect, deleteItinerary);

export default router;