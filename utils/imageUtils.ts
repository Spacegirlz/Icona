
interface Base64ConversionResult {
  base64Data: string;
  mimeType: string;
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
