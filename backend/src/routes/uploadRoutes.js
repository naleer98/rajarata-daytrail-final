import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the local uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Cloudinary if credentials exist in .env
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configure Multer Storage
// If using Cloudinary, store in memory buffer; otherwise store on local disk
const storage = hasCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, uploadDir);
      },
      filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `place-${uniqueSuffix}${ext}`);
      },
    });

// File validation: allow only images up to 5MB
const fileFilter = (req, file, cb) => {
  const allowed = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed[ext] === file.mimetype.toLowerCase()) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

const router = express.Router();

/**
 * @desc    Upload an image for places
 * @route   POST /api/upload
 * @access  Private / Admin Only
 */
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file was provided.',
      });
    }

    // 1. Cloudinary upload branch
    if (hasCloudinary) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'rajarata-daytrail',
          transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]', error);
            return res.status(500).json({
              success: false,
              message: 'Cloudinary upload failed: ' + error.message,
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully to Cloudinary!',
            imageUrl: result.secure_url,
          });
        }
      );
      return uploadStream.end(req.file.buffer);
    }

    // 2. Local disk upload branch
    const relativeUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to local storage!',
      imageUrl: relativeUrl,
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'File upload failed.',
    });
  }
});

export default router;