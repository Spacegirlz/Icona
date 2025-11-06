import React, { useState } from 'react';
import { QUICK_HITS } from '../prompts';

interface QuickHitsPickerProps {
  onPresetSelect: (quickHitId: string) => void;
  onBack: () => void;
}

const categoryDescriptions = {
  creative: 'One-tap presets for artistic, cinematic, and fantasy transformations.',
  professional: 'Polished, high-quality headshots perfect for LinkedIn and corporate profiles.',
};

export const QuickHitsPicker: React.FC<QuickHitsPickerProps> = ({ 
  onPresetSelect, 
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'creative' | 'professional'>('creative');

  const displayedHits = QUICK_HITS.filter(qh => qh.category === selectedCategory);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-3xl font-semibold text-white">Quick Hits</h2>
        <div className="w-20" /> 
      </div>

      <div className="w-full max-w-sm mx-auto p-1.5 bg-gray-800 rounded-lg flex relative">
        <span
          className={`
            absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] 
            bg-purple-600 rounded-md shadow-lg
            transition-all duration-300 ease-in-out
            ${selectedCategory === 'creative' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}
          `}
          aria-hidden="true"
        />
        <button
          onClick={() => setSelectedCategory('creative')}
          className={`
            w-1/2 py-3 text-lg font-bold rounded-md transition-colors duration-200
            relative z-10 
            ${selectedCategory === 'creative' ? 'text-white' : 'text-gray-400 hover:text-white'}
          `}
        >
          Creative
        </button>
        <button
          onClick={() => setSelectedCategory('professional')}
          className={`
            w-1/2 py-3 text-lg font-bold rounded-md transition-colors duration-200
            relative z-10 
            ${selectedCategory === 'professional' ? 'text-white' : 'text-gray-400 hover:text-white'}
          `}
        >
          Professional
        </button>
      </div>
      
      <div className="text-center text-gray-400 -mt-2">
          <p>{categoryDescriptions[selectedCategory]}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4">
        {displayedHits.map(qh => (
          <button
            key={qh.id}
            onClick={() => onPresetSelect(qh.id)}
            aria-label={`Select the ${qh.label} preset`}
            className="
              relative overflow-hidden rounded-xl p-6 text-left 
              bg-gray-800/70 backdrop-blur-sm border border-gray-600 shadow-lg
              hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300 
              transform hover:-translate-y-1 group h-full
            "
          >
            <span 
              className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500 to-pink-500"
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-row items-center gap-6 h-full">
                <span className="text-5xl">{qh.emoji || '✨'}</span>
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white">{qh.label}</h3>
                    <p className="text-base text-gray-400">{qh.description}</p>
                </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};