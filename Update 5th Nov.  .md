# **Implementation Instructions for Gemini Build (Vibe Coding)**

---

## **Context Brief**

You are implementing Quick Hits: a one-tap preset system for ICONA that lives alongside Adventure Builder and Manual Prompting. Quick Hits delivers 8 curated looks (Classic Glam, Press-Ready LinkedIn, Disco Flash, Y2K Diva, Idol Stage K-Pop, Dreamhouse Barbiecore, Ghibli Meadow, Library Dark Academia) with zero configuration friction. Users tap once, get proof of magic.

Additionally, you're integrating 4 LinkedIn-specific presets into both Quick Hits and Adventure Builder to serve the professional headshot market.

Your code follows this stack:

* React \+ TypeScript  
* State managed in `App.tsx`  
* Prompt orchestration in `prompts.ts` via `buildFinalPrompt()`  
* UI entry via `CreativeHub.tsx` and configuration via `PromptBuilder.tsx`  
* Gemini 2.5 Flash Nano Banana as the generation engine

---

## **Phase 1: Add Quick Hits Config to `prompts.ts`**

**Goal:** Define 12 presets (8 original Quick Hits \+ 4 LinkedIn) with all parameters needed to bypass the builder.

**Location:** `/src/prompts.ts` (or wherever your `ERAS`, `STYLES`, `buildFinalPrompt` live)

**Instructions:**

1. **Add the Quick Hit type definition** at the top of `prompts.ts`, near your other type exports:

export type QuickHit \= {

  id: string;

  label: string;

  emoji?: string;

  description?: string;  // for UI tooltip or card subtitle

  // buildFinalPrompt inputs

  moodId: string;

  vitalityLevelId: string;

  archetypeId: string;

  eraId: string;

  settingId?: string;

  manualEraText?: string;

  styleId: string;

  additionalDetails: string;

  transformationMode: 'portrait' | 'immersive';

};

2. **Export the Quick Hits array**. Place this below your existing `STYLES` or `ERAS` exports:

export const QUICK\_HITS: QuickHit\[\] \= \[

  // \========== Original 8 Quick Hits \==========

  {

    id: 'classic\_glam',

    label: 'Classic Glam',

    emoji: '🎬',

    description: 'Old Hollywood red carpet elegance',

    moodId: 'confident',

    vitalityLevelId: 'polish',

    archetypeId: 'editorial',

    eraId: 'golden-age-hollywood',

    settingId: 'premiere',

    styleId: 'editorial-vogue',

    additionalDetails: 'calm, grounded confidence; subtle half-smile; composed shoulders',

    transformationMode: 'portrait'

  },

  {

    id: 'press\_ready',

    label: 'Press-Ready',

    emoji: '💼',

    description: 'LinkedIn-grade professional headshot',

    moodId: 'approachable',

    vitalityLevelId: 'polish',

    archetypeId: 'professional',

    eraId: 'manual',

    manualEraText: 'window light at 45°, neutral seamless backdrop, crisp catchlight, tailored wardrobe simplicity',

    styleId: 'photo-real-iphone',

    additionalDetails: 'half-smile; relaxed brow; natural jawline clarity; three-quarter angle, chin forward-down',

    transformationMode: 'portrait'

  },

  {

    id: 'disco\_flash',

    label: 'Disco Flash',

    emoji: '🪩',

    description: 'Studio 54 dancefloor energy',

    moodId: 'playful',

    vitalityLevelId: 'polish',

    archetypeId: 'candid',

    eraId: 'manual',

    manualEraText: 'Studio 54 dancefloor candid, on-camera flash realism, mirror-ball caustics, metallic fabrics, crowd bokeh',

    styleId: 'photo-real-iphone',

    additionalDetails: 'soft laugh micro-expression; candid motion; no posed hands',

    transformationMode: 'immersive'

  },

  {

    id: 'y2k\_diva',

    label: 'Y2K Diva',

    emoji: '✨',

    description: 'Pop princess studio glam',

    moodId: 'playful',

    vitalityLevelId: 'polish',

    archetypeId: 'editorial',

    eraId: 'y2k',

    settingId: 'studio',

    styleId: 'editorial-vogue',

    additionalDetails: 'playful side-eye; colored gel highlights; shimmering wardrobe accents',

    transformationMode: 'portrait'

  },

  {

    id: 'idol\_stage',

    label: 'Idol Stage',

    emoji: '🎤',

    description: 'K-Pop editorial perfection',

    moodId: 'confident',

    vitalityLevelId: 'polish',

    archetypeId: 'editorial',

    eraId: 'manual',

    manualEraText: 'K-Pop editorial styling, pastel gel gradients, immaculate hair finish, soft rim-light separation on clean stage backdrop',

    styleId: 'photo-real-iphone',

    additionalDetails: 'calm power, direct eyes; photocard-style crop feel',

    transformationMode: 'portrait'

  },

  {

    id: 'dreamhouse\_muse',

    label: 'Dreamhouse Muse',

    emoji: '💖',

    description: 'Barbiecore pink paradise',

    moodId: 'playful',

    vitalityLevelId: 'polish',

    archetypeId: 'editorial',

    eraId: 'manual',

    manualEraText: 'Barbiecore pink studio set, pearly highlights, playful posture cues, softbox wrap light',

    styleId: 'photo-real-iphone',

    additionalDetails: 'gentle laugh; relaxed shoulders; glossy but natural skin finish',

    transformationMode: 'portrait'

  },

  {

    id: 'ghibli\_meadow',

    label: 'Ghibli Meadow',

    emoji: '🌿',

    description: 'Hand-painted whimsical escape',

    moodId: 'serene',

    vitalityLevelId: 'polish',

    archetypeId: 'illustrative',

    eraId: 'manual',

    manualEraText: 'meadow grasses, dappled sunlight, gentle breeze, hand-painted softness',

    styleId: 'ghibli',

    additionalDetails: 'distant, thoughtful gaze; tender atmosphere; clean edges, no text elements',

    transformationMode: 'immersive'

  },

  {

    id: 'library\_light',

    label: 'Library Light',

    emoji: '📚',

    description: 'Dark academia contemplation',

    moodId: 'serene',

    vitalityLevelId: 'polish',

    archetypeId: 'cinematic',

    eraId: 'manual',

    manualEraText: 'oak shelves, lamp-gold chiaroscuro, dust motes in light beam, leather-bound stack',

    styleId: 'photo-real-iphone',

    additionalDetails: 'half-smile; composed stillness; book held loosely at chest',

    transformationMode: 'portrait'

  },

  // \========== LinkedIn Professional Presets \==========

  {

    id: 'linkedin\_window\_light',

    label: 'Window Light Pro',

    emoji: '💼',

    description: 'Natural directional professional',

    moodId: 'approachable',

    vitalityLevelId: 'polish',

    archetypeId: 'professional',

    eraId: 'manual',

    manualEraText: 'window light at 45 degrees, neutral seamless backdrop, crisp catchlight',

    styleId: 'photo-real-iphone',

    additionalDetails: 'half-smile, relaxed brow, natural jawline clarity; three-quarter angle, chin forward-down',

    transformationMode: 'portrait'

  },

  {

    id: 'linkedin\_boardroom\_gray',

    label: 'Boardroom Gray',

    emoji: '🏢',

    description: 'Executive studio authority',

    moodId: 'confident',

    vitalityLevelId: 'polish',

    archetypeId: 'professional',

    eraId: 'manual',

    manualEraText: 'seamless studio gray, matte, subtle vignette',

    styleId: 'photo-real-iphone',

    additionalDetails: 'calm authority expression; tailored blazer; soft rim light for separation; three-quarter angle',

    transformationMode: 'portrait'

  },

  {

    id: 'linkedin\_brand\_gradient',

    label: 'Brand Gradient',

    emoji: '🎨',

    description: 'Custom brand backdrop polish',

    moodId: 'approachable',

    vitalityLevelId: 'polish',

    archetypeId: 'professional',

    eraId: 'manual',

    manualEraText: 'soft brand-hue gradient background, smooth tonal falloff, no banding',

    styleId: 'photo-real-iphone',

    additionalDetails: 'warm professional expression; monochrome wardrobe texture; catchlight priority; three-quarter angle',

    transformationMode: 'portrait'

  },

  {

    id: 'linkedin\_office\_blur',

    label: 'Office Blur',

    emoji: '🖥️',

    description: 'Contemporary workspace aesthetic',

    moodId: 'approachable',

    vitalityLevelId: 'polish',

    archetypeId: 'professional',

    eraId: 'manual',

    manualEraText: 'contemporary office background with tasteful bokeh, no logos, neutral palette',

    styleId: 'photo-real-iphone',

    additionalDetails: 'thoughtful focus expression; smart casual layers; window light with soft fill; three-quarter angle',

    transformationMode: 'portrait'

  }

\];

3. **Add helper function** to convert a Quick Hit ID into `buildFinalPrompt` options:

export function quickHitToOpts(qhId: string) {

  const qh \= QUICK\_HITS.find(q \=\> q.id \=== qhId);

  if (\!qh) {

    throw new Error(\`Unknown Quick Hit: ${qhId}\`);

  }

  return {

    characterId: 'default',

    moodId: qh.moodId,

    vitalityLevelId: qh.vitalityLevelId,

    archetypeId: qh.archetypeId,

    eraId: qh.eraId,

    settingId: qh.settingId,

    manualEraText: qh.manualEraText || '',

    styleId: qh.styleId,

    additionalDetails: qh.additionalDetails,

    transformationMode: qh.transformationMode

  };

}

**Validation:** Run `tsc` (TypeScript compiler) to confirm no type errors. Import `QUICK_HITS` in a test file and log the first item to verify structure.

---

## **Phase 2: Update `CreativeHub.tsx` to Show Three Tiles**

**Goal:** Add a "Quick Hits" tile between Adventure Builder and Manual Prompting. When tapped, it routes to a Quick Hits picker.

**Location:** `/src/components/CreativeHub.tsx`

**Instructions:**

1. **Update the component signature** to accept `'quick'` as a mode option:

export const CreativeHub: React.FC\<{

  onModeSelect: (mode: 'adventure' | 'manual' | 'quick') \=\> void;

}\> \= ({ onModeSelect }) \=\> {

2. **Add a third tile** for Quick Hits. Insert this **above** the existing Adventure Builder and Manual tiles:

{/\* Quick Hits Tile \*/}

\<button

  onClick={() \=\> onModeSelect('quick')}

  className="

    relative overflow-hidden rounded-xl p-10 text-left 

    bg-gradient-to-br from-fuchsia-500 via-rose-500 to-pink-600

    hover:opacity-95 transition-all duration-300 transform hover:-translate-y-1

    group

  "

\>

  \<div className="absolute inset-0 opacity-30 bg-\[radial-gradient(circle\_at\_30%\_20%,white,transparent\_40%)\]" /\>

  \<div className="relative z-10"\>

    \<svg className="w-10 h-10 mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"\>

      \<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /\>

    \</svg\>

    \<h3 className="text-2xl font-bold text-white mb-2"\>Quick Hits\</h3\>

    \<p className="text-base text-pink-100"\>One tap. Our best-selling looks. Instant proof of magic.\</p\>

  \</div\>

\</button\>

3. **Keep existing tiles** (Adventure Builder, Manual Prompting) below this new tile.

**Validation:** Load the app. Confirm three tiles appear. Clicking "Quick Hits" should trigger `onModeSelect('quick')` (log in parent to verify).

---

## **Phase 3: Build `QuickHitsPicker.tsx` Component**

**Goal:** Create a dedicated picker UI that displays Quick Hits as tappable cards. When a card is tapped, it returns the `quickHitId` to the parent.

**Location:** Create new file `/src/components/QuickHitsPicker.tsx`

**Instructions:**

1. **Component scaffold:**

import React, { useState } from 'react';

import { QUICK\_HITS, QuickHit } from '../prompts';

interface QuickHitsPickerProps {

  onQuickHitSelect: (quickHitId: string) \=\> void;

  onBack: () \=\> void;

}

export const QuickHitsPicker: React.FC\<QuickHitsPickerProps\> \= ({ 

  onQuickHitSelect, 

  onBack 

}) \=\> {

  const \[selectedCategory, setSelectedCategory\] \= useState\<'all' | 'linkedin'\>('all');

  // Filter Quick Hits by category

  const displayedHits \= selectedCategory \=== 'linkedin'

    ? QUICK\_HITS.filter(qh \=\> qh.id.startsWith('linkedin\_'))

    : QUICK\_HITS.filter(qh \=\> \!qh.id.startsWith('linkedin\_'));

  return (

    \<div className="w-full flex flex-col gap-6"\>

      {/\* Header with Back Button \*/}

      \<div className="flex items-center justify-between"\>

        \<button

          onClick={onBack}

          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"

        \>

          \<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"\>

            \<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /\>

          \</svg\>

          Back

        \</button\>

        \<h2 className="text-2xl font-semibold text-white"\>Quick Hits\</h2\>

        \<div className="w-16" /\> {/\* Spacer for centering \*/}

      \</div\>

      {/\* Category Toggle \*/}

      \<div className="flex gap-2 bg-gray-800 rounded-lg p-1"\>

        \<button

          onClick={() \=\> setSelectedCategory('all')}

          className={\`

            flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all

            ${selectedCategory \=== 'all' 

              ? 'bg-purple-600 text-white' 

              : 'text-gray-400 hover:text-white'

            }

          \`}

        \>

          Creative

        \</button\>

        \<button

          onClick={() \=\> setSelectedCategory('linkedin')}

          className={\`

            flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all

            ${selectedCategory \=== 'linkedin' 

              ? 'bg-purple-600 text-white' 

              : 'text-gray-400 hover:text-white'

            }

          \`}

        \>

          Professional

        \</button\>

      \</div\>

      {/\* Quick Hit Cards Grid \*/}

      \<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"\>

        {displayedHits.map(qh \=\> (

          \<button

            key={qh.id}

            onClick={() \=\> onQuickHitSelect(qh.id)}

            className="

              relative overflow-hidden rounded-xl p-6 text-left 

              bg-gray-800/70 backdrop-blur-sm border border-gray-700

              hover:border-purple-500 transition-all duration-300 

              transform hover:-translate-y-1 group

            "

          \>

            {/\* Hover gradient effect \*/}

            \<span 

              className="

                absolute \-inset-px rounded-xl opacity-0 

                group-hover:opacity-100 transition-opacity duration-300

                bg-gradient-to-br from-purple-500 to-pink-500

              "

              aria-hidden="true"

            /\>

            

            {/\* Content \*/}

            \<div className="relative z-10"\>

              \<div className="flex items-center gap-3 mb-2"\>

                \<span className="text-3xl"\>{qh.emoji || '✨'}\</span\>

                \<h3 className="text-lg font-bold text-white"\>{qh.label}\</h3\>

              \</div\>

              \<p className="text-sm text-gray-400"\>{qh.description}\</p\>

            \</div\>

          \</button\>

        ))}

      \</div\>

    \</div\>

  );

};

**Validation:** Import this component in a test view and confirm cards render with correct emojis, labels, and descriptions. Clicking a card should fire `onQuickHitSelect` with the correct ID.

---

## **Phase 4: Wire Quick Hits into `App.tsx`**

**Goal:** Add state to track Quick Hits mode, apply preset values when a Quick Hit is selected, then navigate to the builder (prefilled) or directly to generation.

**Location:** `/src/App.tsx`

**Instructions:**

1. **Import the new components and helpers:**

import { quickHitToOpts, QUICK\_HITS } from './prompts';

import { QuickHitsPicker } from './components/QuickHitsPicker';

2. **Add state for Quick Hits mode:**

const \[showQuickHitsPicker, setShowQuickHitsPicker\] \= useState(false);

3. **Update `handleModeSelect` function** to handle the `'quick'` case:

const handleModeSelect \= (mode: 'adventure' | 'manual' | 'quick') \=\> {

  if (mode \=== 'manual') {

    setEraId('manual');

    setCreationMode('build');

    setShowQuickHitsPicker(false);

    return;

  }

  if (mode \=== 'adventure') {

    if (eraId \=== 'manual') setEraId('near-future'); // or your default era

    setCreationMode('build');

    setShowQuickHitsPicker(false);

    return;

  }

  if (mode \=== 'quick') {

    setShowQuickHitsPicker(true);

    return;

  }

};

4. **Add handler for Quick Hit selection:**

const handleQuickHitSelect \= (quickHitId: string) \=\> {

  const opts \= quickHitToOpts(quickHitId);


  // Apply all preset values to state

  setCharacterId(opts.characterId);

  setMoodId(opts.moodId);

  setVitalityLevelId(opts.vitalityLevelId);

  setArchetypeId(opts.archetypeId);

  setEraId(opts.eraId);

  setSettingId(opts.settingId);

  setManualEraText(opts.manualEraText || '');

  setStyleId(opts.styleId);

  setAdditionalDetails(opts.additionalDetails || '');

  setTransformationMode(opts.transformationMode);


  // Option A: Go straight to generation (one-tap magic)

  // handleSubmit(); // Uncomment this line for instant generation


  // Option B: Show the builder prefilled (allows tweaking)

  setCreationMode('build');

  setShowQuickHitsPicker(false);

};

5. **Update the render logic** to conditionally show `QuickHitsPicker`:

{creationMode \=== 'choose' && \!showQuickHitsPicker && (

  \<CreativeHub onModeSelect={handleModeSelect} /\>

)}

{showQuickHitsPicker && (

  \<QuickHitsPicker

    onQuickHitSelect={handleQuickHitSelect}

    onBack={() \=\> setShowQuickHitsPicker(false)}

  /\>

)}

{creationMode \=== 'build' && \!showQuickHitsPicker && (

  \<PromptBuilder

    moodId={moodId}

    setMoodId={setMoodId}

    // ... all other props

  /\>

)}

**Validation:**

* Tap Quick Hits → see picker  
* Tap a Quick Hit → state updates correctly (log values)  
* Builder opens with prefilled values  
* Tapping Back returns to CreativeHub

---

## **Phase 5: Add LinkedIn Option to Adventure Builder**

**Goal:** Insert a new step in the Adventure Builder flow that lets users choose "Creative Journey" or "Professional Headshot". If they choose Professional, skip to LinkedIn-specific presets.

**Location:** Modify `PromptBuilder.tsx` or create a new `AdventureRouter.tsx` component

**Instructions (using inline step approach):**

1. **Add new state in `App.tsx`** to track professional mode:

const \[isProfessionalMode, setIsProfessionalMode\] \= useState(false);

2. **Add a pre-builder step** that asks "What kind of image?" This appears right after selecting Adventure Builder but before the main prompt builder:

// In App.tsx, between CreativeHub and PromptBuilder:

{creationMode \=== 'adventure-route' && (

  \<div className="w-full flex flex-col gap-6 text-center"\>

    \<h2 className="text-2xl font-semibold text-white mb-4"\>What kind of image?\</h2\>

    \<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"\>

      \<button

        onClick={() \=\> {

          setIsProfessionalMode(false);

          setCreationMode('build');

        }}

        className="p-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl hover:opacity-95 transition"

      \>

        \<span className="text-4xl mb-2 block"\>🎨\</span\>

        \<h3 className="text-xl font-bold text-white mb-2"\>Creative Journey\</h3\>

        \<p className="text-sm text-purple-100"\>Eras, styles, and storytelling\</p\>

      \</button\>

      

      \<button

        onClick={() \=\> {

          setIsProfessionalMode(true);

          setCreationMode('build');

          // Pre-apply LinkedIn defaults:

          setMoodId('approachable');

          setVitalityLevelId('polish');

          setArchetypeId('professional');

          setEraId('manual');

          setStyleId('photo-real-iphone');

          setTransformationMode('portrait');

        }}

        className="p-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl hover:opacity-95 transition"

      \>

        \<span className="text-4xl mb-2 block"\>💼\</span\>

        \<h3 className="text-xl font-bold text-white mb-2"\>Professional Headshot\</h3\>

        \<p className="text-sm text-blue-100"\>LinkedIn-ready portraits\</p\>

      \</button\>

    \</div\>

  \</div\>

)}

3. **Modify `handleModeSelect`** to set `creationMode` to `'adventure-route'` instead of directly to `'build'`:

if (mode \=== 'adventure') {

  setCreationMode('adventure-route'); // New intermediate step

  return;

}

4. **In `PromptBuilder.tsx`**, conditionally show LinkedIn-specific options when `isProfessionalMode === true`:

// Add prop to PromptBuilder

interface PromptBuilderProps {

  // ... existing props

  isProfessionalMode: boolean;

}

// Inside PromptBuilder component, before the Era selector:

{isProfessionalMode && (

  \<div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4"\>

    \<h4 className="text-white font-semibold mb-3"\>Professional Headshot Presets\</h4\>

    \<div className="grid grid-cols-2 gap-3"\>

      {QUICK\_HITS

        .filter(qh \=\> qh.id.startsWith('linkedin\_'))

        .map(qh \=\> (

          \<button

            key={qh.id}

            onClick={() \=\> {

              // Apply this LinkedIn preset

              setManualEraText(qh.manualEraText || '');

              setAdditionalDetails(qh.additionalDetails || '');

            }}

            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition"

          \>

            \<div className="flex items-center gap-2 mb-1"\>

              \<span className="text-xl"\>{qh.emoji}\</span\>

              \<span className="text-sm font-medium text-white"\>{qh.label}\</span\>

            \</div\>

            \<p className="text-xs text-gray-400"\>{qh.description}\</p\>

          \</button\>

        ))

      }

    \</div\>

  \</div\>

)}

**Validation:**

* Select Adventure Builder → see "Creative Journey" vs "Professional Headshot" choice  
* Choose Professional → builder opens with LinkedIn defaults  
* Four LinkedIn preset buttons appear and correctly update `manualEraText` and `additionalDetails` when clicked

---

## **Phase 6: Gemini Prompt Engineering Optimizations**

**Goal:** Ensure `buildFinalPrompt()` output is optimized for Gemini 2.5 Flash Nano Banana's strengths and iOS rendering.

**Location:** `/src/prompts.ts` inside the `buildFinalPrompt` function

**Instructions:**

1. **Add Gemini-specific routing prefix** at the very start of the prompt array:

const sections: string\[\] \= \[

  // Gemini 2.5 routing anchor

  "PHOTOGRAPHIC TRANSFORMATION TASK: Generate a new photograph of this person with precise identity preservation and creative scene reconstruction"

\];

2. **Strengthen iOS optimization** in the composition section:

// Find the composition section and add:

"Optimize for iOS display: sRGB color space, avoid extreme highlights that clip on mobile screens, ensure legibility at thumbnail size"

3. **Add LinkedIn-specific negatives** when professional mode is active:

// At the end of buildFinalPrompt, before final join:

if (opts.archetypeId \=== 'professional') {

  sections.push(

    "Professional headshot requirements: no visible brand logos or corporate signage in background; clean anti-glare on eyewear; no harsh sharpening halos; three-quarter angle preferred; eye-level camera position"

  );

}

4. **Ensure Vitality Makeover "Polish" level** explicitly avoids body morphing:

// In the section where you handle vitalityLevelId \=== 'polish':

"Vitality level: Polish. Well-rested appearance via lighting (soft under-eye fill, gentle cheekbone highlight); upright posture cue; subtle jawline clarity through lighting angle only—never alter bone structure or body proportions; even skin tone via color grading; no body morphing, no weight change, no face reshaping"

**Validation:** Generate test images with each Quick Hit. Verify:

* Identity preservation across all presets  
* No plastic skin on LinkedIn shots  
* Eyewear appears clean (no green tint or heavy reflections)  
* Colors look natural on iOS Safari  
* Thumbnails remain legible

---

## **Phase 7: UI Polish and Error Handling**

**Goal:** Add loading states, error messages, and accessibility improvements.

**Instructions:**

1. **Add loading state in `App.tsx`:**

const \[isGenerating, setIsGenerating\] \= useState(false);

const handleSubmit \= async () \=\> {

  setIsGenerating(true);

  try {

    // ... existing generation logic

  } catch (error) {

    console.error('Generation failed:', error);

    alert('Something went wrong. Please try again.');

  } finally {

    setIsGenerating(false);

  }

};

2. **Disable all controls during generation:**

// Pass isGenerating to all relevant components:

\<PromptBuilder

  // ... existing props

  disabled={isGenerating}

/\>

\<QuickHitsPicker

  // ... existing props

  disabled={isGenerating} // Add this prop to component definition

/\>

3. **Add ARIA labels to Quick Hit cards:**

\<button

  aria-label={\`Generate ${qh.label} style portrait\`}

  // ... rest of button props

\>

4. **Add success feedback** after generation completes:

// In handleSubmit, after successful generation:

// Show a subtle toast or checkmark animation

**Validation:**

* During generation, all buttons should be disabled and show loading state  
* Screen readers should announce Quick Hit options correctly  
* Generation errors display user-friendly messages

---

## **Testing Protocol (Run This Before Launch)**

1. **Cross-device testing:**

   * iPhone 12+ (Safari)  
   * iPhone SE (small screen validation)  
   * iPad (ensure grid layouts adapt)  
   * Android device (Chrome)  
2. **Preset verification:** Run each of the 12 Quick Hits with:

   * Various face shapes  
   * Different skin tones  
   * With and without eyewear  
   * Different hair textures (curly, straight, coily)  
3. **LinkedIn validation:**

   * Generate all 4 LinkedIn presets  
   * Compare against real LinkedIn headshots  
   * Verify no "camera adds 10 pounds" effect  
   * Check eyewear clarity and natural jawlines  
4. **Performance benchmarks:**

   * Generation time \< 15 seconds on 4G connection  
   * Initial load time \< 3 seconds  
   * UI remains responsive during generation  
5. **A/B test:**

   * Track which Quick Hits have highest save rate  
   * Monitor which path (Quick Hits vs Adventure vs Manual) converts best  
   * Test Quick Hits tile position (first vs last)

---

## **Launch Checklist**

* \[ \] All 12 Quick Hits generate successfully  
* \[ \] LinkedIn presets produce professional-grade results  
* \[ \] No identity drift across generations  
* \[ \] Loading states work correctly  
* \[ \] Back button navigation functions properly  
* \[ \] Mobile UI layouts correctly on iPhone SE and iPad  
* \[ \] Analytics tracking fires for Quick Hit selections  
* \[ \] Error handling gracefully manages API failures  
* \[ \] Accessibility: keyboard navigation works  
* \[ \] Professional mode correctly pre-fills builder  
* \[ \] Category toggle (Creative vs Professional) functions smoothly

---

## **Suggested Copy for Launch Announcement**

**App Store Description Addition:**

NEW: Quick Hits — One tap. Instant transformation. Choose from 12 curated looks including Classic Glam, K-Pop Idol, Barbiecore Dreamhouse, and LinkedIn-ready professional headshots. No configuration needed. Pure magic in seconds.

**In-App First-Time User Prompt:**

"Want to see what ICONA can do? Try a Quick Hit—our best-selling looks, zero setup required."

---

## **Advanced: Future Enhancements**

Once core Quick Hits ship:

1. **Quick Hit Collections**: Group by occasion (Date Night, Job Search, Creative Portfolio)  
2. **Seasonal Quick Hits**: Holiday themes, summer vibes, awards season glamour  
3. **User-Submitted Quick Hits**: Let power users save and share their custom presets  
4. **Quick Hit Previews**: Show sample result before user commits their upload  
5. **Blend Mode**: "Mix Classic Glam \+ Ghibli Meadow at 60/40"

---

That's your complete implementation map. Every section is copy-pasteable and maps directly to your existing code structure. Ship Quick Hits first, validate conversion lift, then iterate on Adventure Builder LinkedIn integration.

