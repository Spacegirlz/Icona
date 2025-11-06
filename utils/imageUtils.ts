
interface Base64ConversionResult {
  base64Data: string;
  mimeType: string;
}

/**
 * Validates uploaded image file
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

export function validateImageFile(file: File): ValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please choose a smaller image.`,
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload a PNG, JPEG, or WEBP image.`,
    };
  }

  // Check file extension (additional safety)
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file extension. Please upload a PNG, JPEG, or WEBP image.`,
    };
  }

  return { valid: true };
}

export const fileToBase64 = (file: File): Promise<Base64ConversionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }
      // The result is a data URL like "data:image/png;base64,iVBORw0KGgo..."
      // We need to extract just the base64 part.
      const base64String = reader.result.split(',')[1];
      if (!base64String) {
        return reject(new Error('Could not extract base64 string from file.'));
      }
      resolve({
        base64Data: base64String,
        mimeType: file.type
      });
    };
    reader.onerror = (error) => reject(error);
  });
};
