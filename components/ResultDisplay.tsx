import React from 'react';
import { ActionButtons } from './ActionButtons';
import { TransformationMode } from '../prompts';

interface ResultDisplayProps {
  editedImageUrl: string | null;
  isLoading: boolean;
  refinementPrompt: string;
  setRefinementPrompt: (prompt: string) => void;
  onRefine: () => void;
  onGenerateVariation: () => void;
  refinementSuggestions: string[];
  transformationMode: TransformationMode;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-4">
        <svg className="animate-spin h-20 w-20 text-teal-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold text-gray-400">Hold on tight...</p>
        <p className="text-sm text-gray-500">Your new timeline is rendering.</p>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xl font-semibold text-gray-400">Your new reality awaits...</p>
    </div>
);

const RefinementControls: React.FC<{
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  onGenerateVariation: () => void;
  suggestions: string[];
  disabled: boolean;
}> = ({ prompt, setPrompt, onSubmit, onGenerateVariation, suggestions, disabled }) => (
    <div className="w-full flex flex-col gap-4">
        <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'change dress to emerald green', 'add a helmet'"
            disabled={disabled}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        />
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={onSubmit}
                disabled={disabled || !prompt}
                className="w-full px-6 py-3 font-semibold text-white bg-purple-700 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors duration-300 flex items-center justify-center shrink-0"
            >
                {disabled && prompt ? <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Refine ✨'}
            </button>
             <button
                onClick={onGenerateVariation}
                disabled={disabled}
                className="w-full px-6 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 disabled:opacity-50 transition-colors duration-300 flex items-center justify-center shrink-0"
            >
                {disabled && !prompt ? <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Variations 💫'}
            </button>
        </div>
        {suggestions.length > 0 && !disabled && (
            <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="text-sm text-gray-400 mr-2 self-center">Try:</span>
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => setPrompt(suggestion)}
                        disabled={disabled}
                        className="px-4 py-2 text-sm text-purple-200 bg-purple-900/50 border border-purple-800/80 rounded-full hover:bg-purple-900 hover:text-white transition-all duration-200 disabled:opacity-50"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        )}
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ editedImageUrl, isLoading, refinementPrompt, setRefinementPrompt, onRefine, onGenerateVariation, refinementSuggestions, transformationMode }) => {
  const aspectClass = transformationMode === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';
  
  return (
    <div className="flex flex-col gap-4">
        <div className={`w-full min-h-[300px] bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex justify-center items-center overflow-hidden ${aspectClass}`}>
        {isLoading ? (
            <LoadingSpinner />
        ) : editedImageUrl ? (
            <img src={editedImageUrl} alt="Generated result" className="w-full h-full object-contain" />
        ) : (
            <Placeholder />
        )}
        </div>
        
        {!isLoading && editedImageUrl && (
            <>
                <RefinementControls
                    prompt={refinementPrompt}
                    setPrompt={setRefinementPrompt}
                    onSubmit={onRefine}
                    onGenerateVariation={onGenerateVariation}
                    suggestions={refinementSuggestions}
                    disabled={isLoading}
                />
                <ActionButtons imageUrl={editedImageUrl} />
            </>
        )}
    </div>
  );
};
