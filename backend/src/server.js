import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve statically uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check API route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'RajaRata DayTrail API is running smoothly',
    timestamp: new Date().toISOString(),
    homeLocation: {
      latitude: process.env.HOME_LAT || 8.3114,
      longitude: process.env.HOME_LNG || 80.4037,
    },
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] RajaRata DayTrail backend is running on http://localhost:${PORT}`);
});