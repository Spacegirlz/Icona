

import React from 'react';
import { ModeToggleButton } from './ModeToggleButton';
import { ERAS, STYLES, MOODS, VITALITY_MAKEOVER_LEVELS, ARCHETYPES, TransformationMode, QUICK_HITS } from '../prompts';
import type { CreationMode } from '../App';

interface PromptBuilderProps {
  moodId: string;
  setMoodId: (id: string) => void;
  vitalityLevelId: string;
  setVitalityLevelId: (id: string) => void;
  archetypeId: string;
  setArchetypeId: (id: string) => void;
  eraId: string;
  onEraChange: (id: string) => void;
  settingId: string | undefined;
  setSettingId: (id: string | undefined) => void;
  manualEraText: string;
  setManualEraText: (text: string) => void;
  styleId: string;
  setStyleId: (id: string) => void;
  additionalDetails: string;
  setAdditionalDetails: (text: string) => void;
  transformationMode: TransformationMode;
  setTransformationMode: (mode: TransformationMode) => void;
  disabled: boolean;
  creationMode: CreationMode;
  onPresetSelect: (presetId: string) => void;
  onBackToChoice: () => void;
  adventurePath: 'creative' | 'professional' | null;
  professionalPresetId: string | null;
}

const BuilderSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  children: React.ReactNode;
}> = ({ label, value, onChange, disabled, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-base font-semibold text-gray-400">{label}</label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white text-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {children}
    </select>
  </div>
);

const ProfessionalArchetypeChooser: React.FC<{
  presets: typeof QUICK_HITS;
  onSelect: (id: string) => void;
  selectedId: string | null;
  disabled: boolean;
}> = ({ presets, onSelect, selectedId, disabled }) => (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/50 border border-teal-500/30 rounded-lg">
        <label className="text-xl font-semibold text-teal-300 text-center">Choose a Professional Archetype</label>
        <div className="grid grid-cols-1 gap-4">
            {presets.map(preset => (
                <button
                    key={preset.id}
                    onClick={() => !disabled && onSelect(preset.id)}
                    disabled={disabled}
                    className={`
                        relative overflow-hidden rounded-xl p-6 text-left 
                        bg-gray-800/70 backdrop-blur-sm border border-gray-600 shadow-lg
                        transition-all duration-300 transform h-full disabled:opacity-50
                        ${selectedId === preset.id
                            ? 'ring-2 ring-teal-400 border-teal-500'
                            : 'hover:border-purple-500 hover:shadow-purple-500/20 hover:-translate-y-1 group'
                        }
                    `}
                >
                     <div className="relative z-10 flex flex-row items-center gap-6 h-full">
                        <span className="text-5xl">{preset.emoji || '✨'}</span>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-white">{preset.label}</h3>
                            <p className="text-base text-gray-400">{preset.description}</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
);


export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  moodId, setMoodId,
  vitalityLevelId, setVitalityLevelId,
  archetypeId, setArchetypeId,
  eraId, onEraChange,
  settingId, setSettingId,
  manualEraText, setManualEraText,
  styleId, setStyleId,
  additionalDetails, setAdditionalDetails,
  transformationMode, setTransformationMode,
  disabled,
  creationMode,
  onPresetSelect,
  onBackToChoice,
  adventurePath,
  professionalPresetId,
}) => {
  const selectedEra = ERAS.find(e => e.id === eraId);
  const isManualMode = eraId === 'manual' && adventurePath !== 'professional';

  const professionalPresets = QUICK_HITS.filter(qh => qh.category === 'professional');

  const renderTopNav = () => {
    if (creationMode === 'build' && adventurePath !== null) {
       return null; // The back button is now outside the component
    }
    if (creationMode === 'manual') {
       return (
         <div className="text-right -mb-4">
              <button
                  onClick={() => onEraChange('vogue_photoshoot')}
                  disabled={disabled}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
              >
                  Switch to Adventure Builder &rarr;
              </button>
          </div>
       );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col gap-6">
       {renderTopNav()}

      {adventurePath === 'professional' ? (
        <ProfessionalArchetypeChooser
            presets={professionalPresets}
            onSelect={onPresetSelect}
            selectedId={professionalPresetId}
            disabled={disabled}
        />
      ) : (
        <>
            <BuilderSelect label="1. Mood" value={moodId} onChange={(e) => setMoodId(e.target.value)} disabled={disabled}>
                {MOODS.map(mood => <option key={mood.id} value={mood.id}>{mood.label}</option>)}
            </BuilderSelect>

            <BuilderSelect label="2. Vitality Makeover" value={vitalityLevelId} onChange={(e) => setVitalityLevelId(e.target.value)} disabled={disabled}>
                {VITALITY_MAKEOVER_LEVELS.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
            </BuilderSelect>

            <BuilderSelect label="3. Archetype" value={archetypeId} onChange={(e) => setArchetypeId(e.target.value)} disabled={disabled}>
                {ARCHETYPES.map(archetype => <option key={archetype.id} value={archetype.id}>{archetype.label}</option>)}
            </BuilderSelect>

            {!isManualMode && (
                <BuilderSelect label="4. Era" value={eraId} onChange={(e) => onEraChange(e.target.value)} disabled={disabled}>
                    <option value="" disabled>Select an Era...</option>
                    {ERAS.filter(e => e.id !== 'manual').map(era => <option key={era.id} value={era.id}>{era.label}</option>)}
                </BuilderSelect>
            )}
            
            {isManualMode && (
                <div className="flex flex-col gap-2">
                <label className="text-base font-semibold text-gray-400">Your Vision</label>
                <textarea
                    value={manualEraText}
                    onChange={(e) => setManualEraText(e.target.value)}
                    placeholder="Describe the era, attire, and setting..."
                    className="w-full pl-4 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-400 resize-none text-lg"
                    disabled={disabled}
                    rows={3}
                />
                </div>
            )}

            {selectedEra && selectedEra.settings.length > 0 && (
                <BuilderSelect label="5. Setting" value={settingId || ''} onChange={(e) => setSettingId(e.target.value)} disabled={disabled}>
                <option value="">Select a Setting...</option>
                {selectedEra.settings.map(setting => <option key={setting.id} value={setting.id}>{setting.label}</option>)}
                </BuilderSelect>
            )}

            {selectedEra && (
                <BuilderSelect 
                label="6. Style" 
                value={styleId || ''} 
                onChange={(e) => setStyleId(e.target.value)} 
                disabled={disabled}
                >
                {STYLES.map(style => <option key={style.id} value={style.id}>{style.label}</option>)}
                </BuilderSelect>
            )}
        </>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-base font-semibold text-gray-400">Anything else to add?</label>
        <input
            type="text"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="e.g., 'wearing a silver crown', 'smiling warmly'"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-400 text-lg"
            disabled={disabled}
        />
      </div>

      <ModeToggleButton
        transformationMode={transformationMode}
        setTransformationMode={setTransformationMode}
        disabled={disabled}
      />
    </div>
  );
};