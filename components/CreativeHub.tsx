import React from 'react';

export const CreativeHub: React.FC<{ onModeSelect: (mode: 'quick' | 'adventure' | 'manual') => void }> = ({ onModeSelect }) => {
  return (
    <div className="w-full flex flex-col items-center gap-6 text-center">
      <h2 className="text-4xl font-semibold text-white mb-4">How do you want to create?</h2>
      <div className="w-full flex flex-col gap-6">
        <button
          onClick={() => onModeSelect('quick')}
          className="relative overflow-hidden rounded-xl p-10 text-left bg-gradient-to-br from-fuchsia-600 via-rose-500 to-purple-600 hover:opacity-95 transition-all duration-300 transform hover:-translate-y-1 group text-white"
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Quick Hits</h3>
            <p className="text-base text-rose-100">One tap. Our best looks. Instant proof of magic.</p>
          </div>
        </button>
        <button
          onClick={() => onModeSelect('adventure')}
          className="w-full p-10 text-left rounded-xl transition-all duration-300 transform group hover:-translate-y-1 relative overflow-hidden bg-gray-800/70 backdrop-blur-sm border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Adventure Builder</h3>
          <p className="text-base text-gray-400">Guide me through a creative journey, step-by-step.</p>
        </button>
        <button
          onClick={() => onModeSelect('manual')}
          className="w-full p-10 text-left rounded-xl transition-all duration-300 transform group hover:-translate-y-1 relative overflow-hidden bg-gray-800/70 backdrop-blur-sm border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Manual Prompting</h3>
          <p className="text-base text-gray-400">I have a specific vision I want to craft from scratch.</p>
        </button>
      </div>
    </div>
  );
};