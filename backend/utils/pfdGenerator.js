// utils/pdfGenerator.js - PDF generation utility using pdf-lib (ES6)
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            const imageBytes = await fs.readFile(imagePath);

            // Embed image based on type
            let image;
            const ext = path.extname(imagePath).toLowerCase();

            if (ext === '.png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else if (ext === '.jpg' || ext === '.jpeg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (ext === '.webp') {
                // pdf-lib doesn't support WebP directly, so we convert to PNG
                // For production, use sharp or canvas to convert WebP
                // For now, we'll throw an error with instructions
                throw new Error('WebP format requires additional processing. Please convert to JPG or PNG first.');
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