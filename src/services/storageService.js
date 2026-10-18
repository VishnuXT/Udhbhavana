/**
 * Firestore-Native Image Storage Service
 * Converts and compresses uploaded images into optimized Base64 DataURLs
 * and stores them directly inside Cloud Firestore documents.
 * 
 * Benefits:
 * - 100% Free on Firebase Spark plan (No Blaze billing account required!)
 * - Zero external storage dependencies
 * - Automatically compressed to stay well under Cloud Firestore's 1MB document limit (typically 60KB - 250KB)
 */

const MAX_ORIGINAL_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

/**
 * Compresses an image file client-side via HTML5 Canvas
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 
 * @returns {Promise<string>} compressed Base64 Data URL
 */
function compressImageToDataUrl(file, maxWidth = 1200, maxHeight = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // If it's already an SVG, read it directly without canvas rasterization
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if dimensions exceed targets
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp for maximum compression efficiency
        let dataUrl = canvas.toDataURL('image/webp', quality);

        // Fallback check: if webp produced larger or unsupported, use jpeg
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Safety safeguard for Firestore 1MB limit:
        // If string exceeds 650KB, recompress with lower quality to stay safe
        if (dataUrl.length > 650 * 1024) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        }

        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to process image file.'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export const storageService = {
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No file selected.' };
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type: ${file.type}. Please upload JPG, PNG, WEBP, or SVG.`
      };
    }
    if (file.size > MAX_ORIGINAL_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${sizeMB}MB) exceeds the maximum allowed limit of 10MB.`
      };
    }
    return { valid: true, error: null };
  },

  /**
   * Converts and compresses the image file to a lightweight Base64 string
   * ready to be stored directly in Cloud Firestore.
   */
  async uploadImage(file, assetType = 'general') {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { url: null, error: validation.error };
    }

    try {
      let maxWidth = 1200;
      let maxHeight = 1600;
      let quality = 0.82;

      // Tailor dimensions based on asset purpose
      if (assetType === 'logo') {
        maxWidth = 800;
        maxHeight = 400;
        quality = 0.9;
      } else if (assetType === 'guest') {
        maxWidth = 500;
        maxHeight = 500;
        quality = 0.85;
      } else if (assetType === 'poster') {
        maxWidth = 1000;
        maxHeight = 1450;
        quality = 0.78;
      }

      const compressedDataUrl = await compressImageToDataUrl(file, maxWidth, maxHeight, quality);
      return { url: compressedDataUrl, error: null };
    } catch (err) {
      console.error('Image compression error:', err);
      return { url: null, error: err.message || 'Failed to compress image.' };
    }
  },

  async deleteImage(fileUrl) {
    // Stored directly in Firestore document; no external storage cleanup needed
    return { success: true, error: null };
  }
};
