import React, { useRef } from 'react';
import { TransformationMode } from '../prompts';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  transformationMode: TransformationMode;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const ChangePhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, transformationMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    // Stop the event from bubbling up to parent handlers
    event.stopPropagation();
    fileInputRef.current?.click();
  };
  
  const aspectClass = transformationMode === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';

  return (
    <div 
      className={`relative group w-full ${aspectClass} bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex justify-center items-center cursor-pointer hover:border-purple-500 transition-all duration-300 overflow-hidden`}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imageUrl ? (
        <>
            <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleClick}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gray-700/80 border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    <ChangePhotoIcon />
                    Change Photo
                </button>
            </div>
        </>
      ) : (
        <div className="text-center p-4">
            <UploadIcon />
            <p className="text-xl font-semibold text-gray-400">Choose a photo to transform</p>
            <p className="text-sm text-gray-500">Supports PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};
