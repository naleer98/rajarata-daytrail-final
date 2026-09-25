import express from 'express';
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/placeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for visitors
router.get('/', (req, res, next) => {
  if (req.query.all === 'true') return protect(req, res, () => adminOnly(req, res, next));
  next();
}, getPlaces);
router.get('/:id', getPlaceById);

// Protected Admin-only routes
router.post('/', protect, adminOnly, createPlace);
router.put('/:id', protect, adminOnly, updatePlace);
router.delete('/:id', protect, adminOnly, deletePlace);

export default router;