

import React, { useState, useCallback, useEffect } from 'react';
import { generateCaptionForImage } from '../services/geminiService';

interface ActionButtonsProps {
  imageUrl: string;
}

const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.453.649a1 1 0 01.554 1.705l-3.223 3.14.76 4.436a1 1 0 01-1.45 1.054L12 15.587l-3.99 2.1a1 1 0 01-1.45-1.054l.76-4.436-3.223-3.14a1 1 0 01.554-1.705l4.453-.649L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;


export const ActionButtons: React.FC<ActionButtonsProps> = ({ imageUrl }) => {
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [onCooldown, setOnCooldown] = useState(false);
  
  const isShareApiAvailable = typeof navigator.share === 'function';

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `time-travel-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!isShareApiAvailable) return;
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `time-travel-${Date.now()}.png`, { type: blob.type });

        await navigator.share({
            title: 'My Time-Travel Photo',
            text: caption || 'Check out this photo I made in the Time-Travel Photo Booth!',
            files: [file],
        });
    } catch (err) {
        console.error('Sharing failed:', err);
        // We don't show an error to the user because they might have just cancelled the share dialog
    }
  };
  
  const triggerCooldown = () => {
    setOnCooldown(true);
    setTimeout(() => setOnCooldown(false), 5000);
  };
  
  const handleGenerateCaption = async () => {
    setIsCaptionLoading(true);
    setError('');
    setCaption('');

    try {
        const [mimeType, base64Data] = imageUrl.split(';base64,');
        if (!base64Data) {
            throw new Error("Invalid image URL format");
        }
        const cleanMimeType = mimeType.replace('data:', '');
        const generatedCaption = await generateCaptionForImage(base64Data, cleanMimeType);
        setCaption(generatedCaption);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (errorMessage.includes("429")) {
            setError("API Rate Limit Exceeded or Billing Issue. The API has a limit of requests per minute. Please wait a moment. If this persists, check your Google Cloud billing details.");
        } else {
            setError('The AI writer is stumped. Please try again.');
            console.error(e);
        }
    } finally {
        setIsCaptionLoading(false);
        triggerCooldown();
    }
  }
  
  const handleCopy = () => {
      navigator.clipboard.writeText(caption).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <div className="w-full flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={handleSave} className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                <SaveIcon />
                Save Image
            </button>
            <button onClick={handleGenerateCaption} disabled={isCaptionLoading || onCooldown} className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-purple-700 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors duration-300">
                {isCaptionLoading ? <svg className="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon />}
                {isCaptionLoading ? 'Conjuring...' : onCooldown ? 'On Cooldown' : 'Magic Caption ✨'}
            </button>
            <button onClick={handleShare} disabled={!isShareApiAvailable} className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300">
                <ShareIcon />
                Share
            </button>
        </div>
        {error && <p className="text-red-400 text-center text-base">{error}</p>}
        {caption && (
            <div className="relative p-4 bg-gray-900/70 border border-gray-700 rounded-lg">
                <p className="text-gray-300 text-base pr-12">{caption}</p>
                <button onClick={handleCopy} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors">
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        )}
    </div>
  );
};