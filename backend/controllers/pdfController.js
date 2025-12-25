// controllers/pdfController.js - Controller for PDF conversion logic (ES6)
import { generatePdfFromImages } from '../utils/pfdGenerator.js';
import { cleanupFiles } from '../utils/fileCleanup.js';

/**
 * Controller: Convert uploaded images to PDF
 * @route POST /api/upload/images-to-pdf
 */
export const convertImagesToPdf = async (req, res) => {
    let pdfPath = null;
    let imagePaths = [];

    try {
        // Validate files exist
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: 'No files uploaded',
                message: 'Please select at least one image to convert'
            });
        }

        // Get uploaded file paths
        imagePaths = req.files.map(file => file.path);
        console.log(`📥 Received ${imagePaths.length} images for conversion`);

        // Generate PDF from images
        pdfPath = await generatePdfFromImages(imagePaths);
        console.log(`✅ PDF generated successfully: ${pdfPath}`);

        // Send PDF as download
        res.download(pdfPath, 'converted-images.pdf', async (err) => {
            if (err) {
                console.error('Error sending PDF:', err);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Failed to download PDF',
                        message: 'An error occurred while preparing your PDF'
                    });
                }
            }

            // Cleanup files after download (success or error)
            await cleanupFiles([...imagePaths, pdfPath]);
            console.log('🗑️  Temporary files cleaned up');
        });

    } catch (error) {
        console.error('PDF Conversion Error:', error);

        // Cleanup files on error
        const filesToClean = [...imagePaths];
        if (pdfPath) filesToClean.push(pdfPath);
        await cleanupFiles(filesToClean);

        // Send error response
        if (!res.headersSent) {
            res.status(500).json({
                error: 'PDF conversion failed',
                message: error.message || 'Failed to convert images to PDF'
            });
        }
    }
};