// utils/pdfGenerator.js - PDF generation utility using pdf-lib (ES6)
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert WebP image to PNG using Sharp
 * @param {string} webpPath - Path to WebP file
 * @returns {Promise<Buffer>} - PNG image bytes
 */
async function convertWebpToPng(webpPath) {
    try {
        const pngBuffer = await sharp(webpPath)
            .png()
            .toBuffer();
        return pngBuffer;
    } catch (error) {
        throw new Error(`Failed to convert WebP to PNG: ${error.message}`);
    }
}

/**
 * Generate a PDF from multiple image files
 * Each image is placed on a separate page, scaled to fit
 * @param {string[]} imagePaths - Array of image file paths
 * @returns {Promise<string>} - Path to generated PDF file
 */
export async function generatePdfFromImages(imagePaths) {
    if (!imagePaths || imagePaths.length === 0) {
        throw new Error('No images provided for PDF generation');
    }

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Process each image
        for (const imagePath of imagePaths) {
            // Read image file
            let imageBytes = await fs.readFile(imagePath);
            const ext = path.extname(imagePath).toLowerCase();

            // Convert WebP to PNG if necessary
            if (ext === '.webp') {
                imageBytes = await convertWebpToPng(imagePath);
            }

            // Embed image based on type
            let image;

            if (ext === '.png' || ext === '.webp') {
                // WebP is converted to PNG, so embed as PNG
                image = await pdfDoc.embedPng(imageBytes);
            } else if (ext === '.jpg' || ext === '.jpeg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else {
                throw new Error(`Unsupported image format: ${ext}`);
            }

            // Get image dimensions
            const { width, height } = image;

            // Create a page with image dimensions
            // Standard A4 size: 595 x 842 points, but we'll use image dimensions
            // Scale down if image is too large
            const maxWidth = 595; // A4 width in points
            const maxHeight = 842; // A4 height in points

            let pageWidth = width;
            let pageHeight = height;
            let imgWidth = width;
            let imgHeight = height;

            // Scale down large images to fit A4
            if (width > maxWidth || height > maxHeight) {
                const widthRatio = maxWidth / width;
                const heightRatio = maxHeight / height;
                const scale = Math.min(widthRatio, heightRatio);

                pageWidth = maxWidth;
                pageHeight = maxHeight;
                imgWidth = width * scale;
                imgHeight = height * scale;
            }

            // Add page to PDF
            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            // Center the image on the page
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            // Draw image on page
            page.drawImage(image, {
                x: x,
                y: y,
                width: imgWidth,
                height: imgHeight,
            });
        }

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Generate output path
        const outputPath = path.join(
            __dirname,
            '../uploads',
            `pdf-${Date.now()}.pdf`
        );

        // Write PDF to file
        await fs.writeFile(outputPath, pdfBytes);

        return outputPath;

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
}