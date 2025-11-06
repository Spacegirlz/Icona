import React from 'react';
// TransformationMode is defined and exported from prompts.ts
import { TransformationMode } from '../prompts';

interface ModeToggleButtonProps {
  transformationMode: TransformationMode;
  setTransformationMode: (mode: TransformationMode) => void;
  disabled?: boolean;
}

export const ModeToggleButton: React.FC<ModeToggleButtonProps> = ({
  transformationMode,
  setTransformationMode,
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col gap-3 pt-4 w-full ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-base font-bold text-gray-400">
        Composition
      </label>
      <div className="w-full p-1.5 bg-gray-800 rounded-lg flex relative">
        {/* Animated highlight "pill" */}
        <span
          className={`
            absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] 
            bg-purple-600 rounded-md shadow-lg
            transition-all duration-300 ease-in-out
            ${transformationMode === 'portrait' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}
          `}
          aria-hidden="true"
        />
        
        {/* Buttons (relative to stay on top) */}
        <button
          onClick={() => !disabled && setTransformationMode('portrait')}
          disabled={disabled}
          className={`
            w-1/2 py-3 text-lg font-bold rounded-md transition-colors duration-200
            relative z-10 
            ${transformationMode === 'portrait' ? 'text-white' : 'text-gray-400 hover:text-white'}
          `}
        >
          Portrait
        </button>
        <button
          onClick={() => !disabled && setTransformationMode('immersive')}
          disabled={disabled}
          className={`
            w-1/2 py-3 text-lg font-bold rounded-md transition-colors duration-200
            relative z-10 
            ${transformationMode === 'immersive' ? 'text-white' : 'text-gray-400 hover:text-white'}
          `}
        >
          Immersive
        </button>
      </div>
    </div>
  );
};