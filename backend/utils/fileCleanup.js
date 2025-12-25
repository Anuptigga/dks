// utils/fileCleanup.js - Utility for cleaning up temporary files (ES6)
import fs from 'fs/promises';
import path from 'path';

/**
 * Delete multiple files safely
 * @param {string[]} filePaths - Array of file paths to delete
 * @returns {Promise<void>}
 */
export async function cleanupFiles(filePaths) {
    if (!filePaths || filePaths.length === 0) {
        return;
    }

    const deletePromises = filePaths.map(async (filePath) => {
        try {
            await fs.unlink(filePath);
            console.log(`🗑️  Deleted: ${filePath}`);
        } catch (error) {
            // Ignore errors if file doesn't exist
            if (error.code !== 'ENOENT') {
                console.error(`Failed to delete ${filePath}:`, error.message);
            }
        }
    });

    await Promise.allSettled(deletePromises);
}

/**
 * Clean up old files in uploads directory (optional maintenance task)
 * Delete files older than specified time
 * @param {string} directory - Directory to clean
 * @param {number} maxAgeMs - Maximum age in milliseconds (default: 1 hour)
 */
export async function cleanupOldFiles(directory, maxAgeMs = 3600000) {
    try {
        const files = await fs.readdir(directory);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);

            if (now - stats.mtimeMs > maxAgeMs) {
                await fs.unlink(filePath);
                console.log(`🗑️  Cleaned up old file: ${file}`);
            }
        }
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}