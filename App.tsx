
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { PromptBuilder } from './components/PromptBuilder';
import { CreativeHub } from './components/CreativeHub';
import { QuickHitsPicker } from './components/QuickHitsPicker';
import { editImageWithGemini, getRefinementSuggestions, generateDetailedPromptFromTextModel } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { buildFinalPrompt, quickHitToOpts, TransformationMode, QUICK_HITS, buildCreativeMetaPrompt } from './prompts';
import { LandingPage } from './components/LandingPage';
import { WelcomeBanner } from './components/WelcomeBanner';
import { sanitizeRefinementPrompt, sanitizeManualEraText, sanitizeAdditionalDetails } from './utils/promptSanitizer';
import { getCurrentUser, getUserProfile, deductCredits } from './services/supabaseClient';

export type CreationMode = 'choice' | 'build' | 'manual' | 'adventure-choice';

const App = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [creationMode, setCreationMode] = useState<CreationMode>('choice');
  const [onCooldown, setOnCooldown] = useState<boolean>(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [refinementPrompt, setRefinementPrompt] = useState<string>('');
  const [refinementSuggestions, setRefinementSuggestions] = useState<string[]>([]);
  const [showQuickHitsPicker, setShowQuickHitsPicker] = useState(false);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string | null>(null);
  const [credits, setCreditsState] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // State for the prompt builder
  const [transformationMode, setTransformationMode] = useState<TransformationMode>('portrait');
  const [moodId, setMoodId] = useState<string>('half_smile');
  const [vitalityLevelId, setVitalityLevelId] = useState<string>('vitality_0_off');
  const [archetypeId, setArchetypeId] = useState<string>('default');
  const [eraId, setEraId] = useState<string>('vogue_photoshoot');
  const [settingId, setSettingId] = useState<string | undefined>(undefined);
  const [manualEraText, setManualEraText] = useState<string>('');
  const [styleId, setStyleId] = useState<string>('photo-real-iphone');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  
  // State for landing page showcase flow
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);
  
  // State for Adventure Builder path
  const [adventurePath, setAdventurePath] = useState<'creative' | 'professional' | null>(null);
  const [professionalPresetId, setProfessionalPresetId] = useState<string | null>(null);

  useEffect(() => {
    if (onCooldown && cooldownTimer > 0) {
      const interval = setInterval(() => {
        setCooldownTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (cooldownTimer === 0) {
      setOnCooldown(false);
    }
  }, [onCooldown, cooldownTimer]);

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalImageUrl);
      }
    };
  }, [originalImageUrl]);

  useEffect(() => {
    return () => {
      if (editedImageUrl && editedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(editedImageUrl);
      }
    };
  }, [editedImageUrl]);

  // Initialize auth and load credits
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for OAuth callback in URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // OAuth callback - get session explicitly
          const { getSession } = await import('./services/authService');
          const session = await getSession();
          
          if (session?.user) {
            await handleAuthChange(session.user);
            // Clean up URL hash
            window.history.replaceState({}, '', window.location.pathname);
            return;
          }
        }
        
        // Normal auth check
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const profile = await getUserProfile(currentUser.id);
          if (profile) {
            setCreditsState(profile.credits || 0);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();

    // Check for successful payment and refresh credits
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      // Verify payment with backend (credits are added server-side)
      const verifyPayment = async () => {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
          const response = await fetch(`${API_BASE_URL}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.credits > 0) {
              // Refresh credits from Supabase
              const currentUser = await getCurrentUser();
              if (currentUser) {
                const profile = await getUserProfile(currentUser.id);
                if (profile) {
                  setCreditsState(profile.credits || 0);
                }
              }
              // Show success message
              alert(`Success! ${data.credits} credits added to your account.`);
            }
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
        }
      };
      
      verifyPayment();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Refresh credits function
  const refreshCredits = async () => {
    if (user) {
      const profile = await getUserProfile(user.id);
      if (profile) {
        setCreditsState(profile.credits || 0);
      }
    }
  };

  // Handle auth changes
  const handleAuthChange = async (authUser: any) => {
    const wasLoggedOut = user && !authUser;
    const wasLoggedIn = !user && authUser;
    
    setUser(authUser);
    if (authUser) {
      const profile = await getUserProfile(authUser.id);
      if (profile) {
        const newCredits = profile.credits || 0;
        setCreditsState(newCredits);
        
        // Show welcome banner for new users (has 1 credit and profile was just created)
        if (wasLoggedIn && newCredits === 1 && profile.created_at) {
          const createdDate = new Date(profile.created_at);
          const now = new Date();
          const minutesSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60);
          
          // Show banner if profile was created in last 5 minutes (new signup)
          if (minutesSinceCreation < 5) {
            setIsNewUser(true);
            setShowWelcomeBanner(true);
          }
        }
      }
    } else {
      setCreditsState(0);
      setShowWelcomeBanner(false);
      setIsNewUser(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setEditedImageUrl(null);
    setIsLoading(false);
    setError(null);
    setRefinementPrompt('');
    setRefinementSuggestions([]);
    setLastUsedPrompt(null);
    
    if (pendingPresetId) {
      generateFromPreset(pendingPresetId);
      setPendingPresetId(null); 
    }
  };
  
  const handleReset = (fullReset = true) => {
    if (fullReset) {
      setOriginalImageFile(null);
      setOriginalImageUrl(null);
    }
    setEditedImageUrl(null);
    setIsLoading(false);
    setError(null);
    setTransformationMode('portrait');
    setCreationMode('choice');
    setMoodId('half_smile');
    setVitalityLevelId('vitality_0_off');
    setArchetypeId('default');
    setEraId('vogue_photoshoot');
    setSettingId(undefined);
    setManualEraText('');
    setStyleId('photo-real-iphone');
    setAdditionalDetails('');
    setRefinementPrompt('');
    setRefinementSuggestions([]);
    setShowQuickHitsPicker(false);
    setAdventurePath(null);
    setProfessionalPresetId(null);
    setLastUsedPrompt(null);
    setPendingPresetId(null);
  };
  
  const handleBackToChoice = () => {
    setCreationMode('choice');
    setEditedImageUrl(null);
    setError(null);
    setRefinementSuggestions([]);
    setShowQuickHitsPicker(false);
    setAdventurePath(null);
    setProfessionalPresetId(null);
  };

  const onEraChange = (nextEraId: string) => {
    setEraId(nextEraId);
    setSettingId(undefined);
    if (nextEraId !== 'manual') setManualEraText('');
  };

  const handleModeSelect = (mode: 'quick' | 'adventure' | 'manual') => {
    setShowQuickHitsPicker(false);
    setAdventurePath(null);

    if (mode === 'quick') {
      setShowQuickHitsPicker(true);
    } else if (mode === 'adventure') {
      setCreationMode('adventure-choice'); 
    } else if (mode === 'manual') {
      onEraChange('manual');
      setCreationMode('manual');
    }
  };

  const applyPresetOptions = (presetId: string) => {
    const opts = quickHitToOpts(presetId);
    const preset = QUICK_HITS.find(p => p.id === presetId);

    setMoodId(opts.moodId);
    setVitalityLevelId(opts.vitalityLevelId);
    setArchetypeId(opts.archetypeId);
    onEraChange(opts.eraId);
    setSettingId(opts.settingId);
    setManualEraText(opts.manualEraText);
    setStyleId(opts.styleId);
    setAdditionalDetails(opts.additionalDetails);
    setTransformationMode(opts.mode);
    
    if (preset?.category === 'professional') {
      setProfessionalPresetId(preset.id);
    } else {
      setProfessionalPresetId(null);
    }
  };

  const triggerCooldown = () => {
      setOnCooldown(true);
      setCooldownTimer(5);
  };

  const generateFromPreset = useCallback(async (presetId: string) => {
    if (!originalImageFile) {
      setError('Please upload an image to use a Quick Hit.');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      setError('Please sign in to generate images.');
      return;
    }
    
    // Check credits before generating
    const success = await deductCredits(user.id, 1);
    if (!success) {
      setError('Not enough credits. Please buy more credits to continue.');
      await refreshCredits();
      return;
    }
    await refreshCredits();
    
    setShowQuickHitsPicker(false);
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);
    setRefinementSuggestions([]);

    const preset = QUICK_HITS.find(p => p.id === presetId);
    if (!preset) {
        setError(`Preset with id ${presetId} not found.`);
        setIsLoading(false);
        return;
    }
    
    applyPresetOptions(presetId);

    try {
        let finalImagePrompt: string;

        if (preset.manualEraText) {
            finalImagePrompt = preset.manualEraText;
        } else {
            const opts = quickHitToOpts(presetId);
            const metaPrompt = buildCreativeMetaPrompt(opts);
            finalImagePrompt = await generateDetailedPromptFromTextModel(metaPrompt);
        }

        const { base64Data, mimeType } = await fileToBase64(originalImageFile);
        const { base64: generatedImageBase64, mimeType: outMime } = await editImageWithGemini(base64Data, mimeType, finalImagePrompt);
        
        setEditedImageUrl(`data:${outMime};base64,${generatedImageBase64}`);
        setLastUsedPrompt(finalImagePrompt);
        const suggestions = await getRefinementSuggestions(finalImagePrompt);
        setRefinementSuggestions(suggestions);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes("429")) {
        setError("API Rate Limit Exceeded or Billing Issue. The API has a limit of requests per minute. Please wait a moment. If this persists, check your Google Cloud billing details.");
      } else {
        console.error(e);
        setError('Failed to generate image. Please check the console for details.');
      }
    } finally {
        setIsLoading(false);
        triggerCooldown();
    }
  }, [originalImageFile, user]);

  const handleSubmit = useCallback(async () => {
    // Check if user is logged in
    if (!user) {
      setError('Please sign in to generate images.');
      return;
    }
    
    // Check credits before generating
    const success = await deductCredits(user.id, 1);
    if (!success) {
      setError('Not enough credits. Please buy more credits to continue.');
      await refreshCredits();
      return;
    }
    await refreshCredits();
    
    if (!originalImageFile) {
      setError('Please upload an image.');
      return;
    }
    
    if (creationMode === 'manual' && manualEraText.trim().length === 0) {
        setError('Please describe your vision in the manual era text field.');
        return;
    }
    
    // Sanitize user inputs before building prompt
    const sanitizedManualEraText = manualEraText ? sanitizeManualEraText(manualEraText) : '';
    const sanitizedAdditionalDetails = additionalDetails ? sanitizeAdditionalDetails(additionalDetails) : '';
    
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);
    setRefinementSuggestions([]);

    const promptOptions = {
      moodId,
      vitalityLevelId,
      archetypeId,
      eraId,
      settingId,
      manualEraText: sanitizedManualEraText,
      styleId,
      additionalDetails: sanitizedAdditionalDetails,
      mode: transformationMode,
      professionalPresetId,
    };

    try {
      const finalImagePrompt = await buildFinalPrompt(promptOptions);
      const { base64Data, mimeType } = await fileToBase64(originalImageFile);
      const { base64: generatedImageBase64, mimeType: outMime } = await editImageWithGemini(base64Data, mimeType, finalImagePrompt);
        
      setEditedImageUrl(`data:${outMime};base64,${generatedImageBase64}`);
      setLastUsedPrompt(finalImagePrompt);
      const suggestions = await getRefinementSuggestions(finalImagePrompt);
      setRefinementSuggestions(suggestions);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes("429")) {
        setError("API Rate Limit Exceeded or Billing Issue. The API has a limit of requests per minute. Please wait a moment. If this persists, check your Google Cloud billing details.");
      } else {
        console.error(e);
        setError('Failed to generate image. Please check the console for details.');
      }
    } finally {
        setIsLoading(false);
        triggerCooldown();
    }
  }, [
    originalImageFile, creationMode, manualEraText, moodId, vitalityLevelId, 
    archetypeId, eraId, settingId, styleId, additionalDetails, transformationMode, professionalPresetId, user
  ]);

  const handleRefine = useCallback(async () => {
    if (!originalImageFile || !lastUsedPrompt || !refinementPrompt) {
      setError('Cannot refine without a previous generation and a refinement instruction.');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      setError('Please sign in to refine images.');
      return;
    }
    
    // Check credits before refining
    const success = await deductCredits(user.id, 1);
    if (!success) {
      setError('Not enough credits. Please buy more credits to continue.');
      await refreshCredits();
      return;
    }
    await refreshCredits();
    
    setIsLoading(true);
    setError(null);
    
    // Sanitize user input to prevent prompt injection
    const sanitizedRefinement = sanitizeRefinementPrompt(refinementPrompt);
    const refinementMetaPrompt = `Refine the previous image based on this instruction: '${sanitizedRefinement}'. The original prompt that created the image was: "${lastUsedPrompt}"`;

    try {
        const finalRefinementPrompt = await generateDetailedPromptFromTextModel(refinementMetaPrompt);
        const { base64Data, mimeType } = await fileToBase64(originalImageFile);
        const { base64: generatedImageBase64, mimeType: outMime } = await editImageWithGemini(base64Data, mimeType, finalRefinementPrompt);

        setEditedImageUrl(`data:${outMime};base64,${generatedImageBase64}`);
        setLastUsedPrompt(finalRefinementPrompt);
        const suggestions = await getRefinementSuggestions(finalRefinementPrompt);
        setRefinementSuggestions(suggestions);
        setRefinementPrompt('');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes("429")) {
        setError("API Rate Limit Exceeded or Billing Issue. The API has a limit of requests per minute. Please wait a moment. If this persists, check your Google Cloud billing details.");
      } else {
        console.error(e);
        setError('Failed to refine image. Please check the console for details.');
      }
    } finally {
        setIsLoading(false);
        triggerCooldown();
    }
  }, [originalImageFile, lastUsedPrompt, refinementPrompt, user]);

  const handleGenerateVariation = useCallback(async () => {
    if (!originalImageFile || !lastUsedPrompt) {
      setError('Cannot generate a variation without a previous generation.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
        const { base64Data, mimeType } = await fileToBase64(originalImageFile);
        const { base64: generatedImageBase64, mimeType: outMime } = await editImageWithGemini(base64Data, mimeType, lastUsedPrompt);

        setEditedImageUrl(`data:${outMime};base64,${generatedImageBase64}`);
        const suggestions = await getRefinementSuggestions(lastUsedPrompt);
        setRefinementSuggestions(suggestions);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes("429")) {
        setError("API Rate Limit Exceeded or Billing Issue. The API has a limit of requests per minute. Please wait a moment. If this persists, check your Google Cloud billing details.");
      } else {
        console.error(e);
        setError('Failed to generate variation. Please check the console for details.');
      }
    } finally {
        setIsLoading(false);
        triggerCooldown();
    }
  }, [originalImageFile, lastUsedPrompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header 
        onReset={handleReset} 
        showReset={!!originalImageUrl}
        credits={credits}
        onCreditsUpdate={refreshCredits}
        user={user}
        onAuthChange={handleAuthChange}
      />

      {/* Welcome Banner for New Users */}
      {showWelcomeBanner && user && (
        <WelcomeBanner 
          credits={credits} 
          onDismiss={() => setShowWelcomeBanner(false)}
        />
      )}

      <main className="container mx-auto p-6 md:p-12">
        {!originalImageUrl ? (
          <LandingPage 
            onImageUpload={handleImageUpload} 
            onPresetExampleSelect={(presetId) => {
              setPendingPresetId(presetId);
            }}
            user={user}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col gap-8">
              <ImageUploader
                onImageUpload={handleImageUpload}
                imageUrl={originalImageUrl}
                transformationMode={transformationMode}
              />
              
              {showQuickHitsPicker ? (
                 <QuickHitsPicker onPresetSelect={generateFromPreset} onBack={() => setShowQuickHitsPicker(false)} />
              ) : creationMode === 'choice' ? (
                <CreativeHub onModeSelect={handleModeSelect} />
              ) : creationMode === 'adventure-choice' ? (
                 <div className="w-full flex flex-col gap-6 text-center">
                    <h2 className="text-3xl font-semibold text-white mb-2">What kind of image?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setAdventurePath('creative');
                                onEraChange('vogue_photoshoot');
                                setCreationMode('build');
                            }}
                            className="p-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl hover:opacity-95 transition"
                        >
                            <span className="text-4xl mb-2 block">🎨</span>
                            <h3 className="text-xl font-bold text-white mb-2">Creative Journey</h3>
                            <p className="text-sm text-purple-100">Eras, styles, and storytelling</p>
                        </button>
                        
                        <button
                            onClick={() => {
                                setAdventurePath('professional');
                                setCreationMode('build');
                            }}
                            className="p-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl hover:opacity-95 transition"
                        >
                            <span className="text-4xl mb-2 block">💼</span>
                            <h3 className="text-xl font-bold text-white mb-2">Professional Headshot</h3>
                            <p className="text-sm text-blue-100">LinkedIn-ready portraits</p>
                        </button>
                    </div>
                 </div>
              ) : (
                <>
                  {(creationMode === 'build' || creationMode === 'manual') && (
                     <div className="flex justify-between items-center -mb-2">
                        <button onClick={handleBackToChoice} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <h2 className="text-2xl font-bold">{adventurePath === 'professional' ? 'Professional Builder' : 'Adventure Builder'}</h2>
                        <div className="w-16"></div>
                      </div>
                  )}

                  <PromptBuilder
                    moodId={moodId} setMoodId={setMoodId}
                    vitalityLevelId={vitalityLevelId} setVitalityLevelId={setVitalityLevelId}
                    archetypeId={archetypeId} setArchetypeId={setArchetypeId}
                    eraId={eraId} onEraChange={onEraChange}
                    settingId={settingId} setSettingId={setSettingId}
                    manualEraText={manualEraText} setManualEraText={setManualEraText}
                    styleId={styleId} setStyleId={setStyleId}
                    additionalDetails={additionalDetails} setAdditionalDetails={setAdditionalDetails}
                    transformationMode={transformationMode} setTransformationMode={setTransformationMode}
                    disabled={isLoading}
                    creationMode={creationMode}
                    onPresetSelect={generateFromPreset}
                    onBackToChoice={handleBackToChoice}
                    adventurePath={adventurePath}
                    professionalPresetId={professionalPresetId}
                  />

                  {/* FIX: The conditional rendering logic for the Generate button caused a TypeScript error
                      because `creationMode` is already type-narrowed to 'build' or 'manual' in this block.
                      The comparisons against 'choice' and 'adventure-choice' were redundant and have been removed. */}
                  {adventurePath !== 'professional' && (
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || onCooldown}
                        className="w-full px-8 py-5 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                    >
                        {isLoading ? <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Generate'}
                        {onCooldown && !isLoading && `(${cooldownTimer}s)`}
                    </button>
                  )}
                </>
              )}
              {error && <p className="text-red-400 text-center p-4 bg-red-900/50 rounded-lg">{error}</p>}
            </div>

            <div className="flex flex-col gap-8">
               <ResultDisplay
                editedImageUrl={editedImageUrl}
                isLoading={isLoading}
                refinementPrompt={refinementPrompt}
                setRefinementPrompt={setRefinementPrompt}
                onRefine={handleRefine}
                onGenerateVariation={handleGenerateVariation}
                refinementSuggestions={refinementSuggestions}
                transformationMode={transformationMode}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
