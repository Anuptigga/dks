// routes/uploadRoutes.js - API routes for image upload and PDF conversion (ES6)
import express from 'express';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';
import { convertImagesToPdf } from '../controllers/pdfController.js';

const router = express.Router();

// POST route: Upload images and convert to PDF
router.post('/images-to-pdf', uploadMultiple, convertImagesToPdf);

export default router;