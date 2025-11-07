import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';

const HeroSection = ({ onCtaClick, user }: { onCtaClick: () => void; user?: any }) => (
  <div className="text-center max-w-5xl mx-auto pt-16 md:pt-24 pb-12">
    {/* Value prop badge */}
    {!user && (
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full">
        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-gray-300">
          Get <span className="text-purple-400 font-bold">1 free transformation</span> when you sign up
        </span>
      </div>
    )}
    
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-teal-400">
        Stop Using AI Filters.
      </span>
      <span className="block text-white mt-2">Start Creating Photographs.</span>
    </h1>
    
    <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
      ICONA rebuilds every photo from the pixel up. Not a filter. Not a style overlay. 
      <span className="text-purple-400 font-semibold"> A new photograph.</span>
    </p>
    
    <p className="mt-4 text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
      Transform yourself into any era, any aesthetic. Old Hollywood. Y2K Pop. Studio 54. 
      Professional headshots. Your face, reimagined with cinematic precision.
    </p>
    
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <button 
        onClick={onCtaClick} 
        className="group relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-200 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          {user ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Photo
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Started Free
            </>
          )}
        </span>
      </button>
      
      {!user && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>No credit card required</span>
        </div>
      )}
    </div>
    
    {/* Trust indicators */}
    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Instant results</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Secure & private</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>Studio-quality results</span>
      </div>
    </div>
  </div>
);

const HowItWorksSection = () => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="bg-gray-800/50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-2 text-white">1. Upload a Photo</h3>
        <p className="text-gray-400">A clear, well-lit shot of you. No filters. No edits. Just the raw material of your story.</p>
      </div>
      <div className="bg-gray-800/50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-2 text-white">2. Pick a Vibe or Era</h3>
        <p className="text-gray-400">Choose from our Adventure Builder — timeless aesthetics like Old Hollywood or K-Pop Gloss, or build your own look.</p>
      </div>
      <div className="bg-gray-800/50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-2 text-white">3. Watch the AI Work</h3>
        <p className="text-gray-400">Gemini 2.5 Flash reconstructs light, fabric, and expression into a true-to-life portrait from another world.</p>
      </div>
    </div>
    <p className="text-center mt-6 text-gray-500 italic">Real photography energy. No uncanny filters. No plastic glow.</p>
  </div>
);

const PresetShowcaseSection = ({ onPresetSelect }: { onPresetSelect: (presetId: string) => void }) => {
  const examples = [
    {
      id: 'linkedin_executive',
      title: 'Executive Presence',
      description: 'Authoritative confidence for LinkedIn.',
      imageUrl: 'https://images.pexels.com/photos/20343419/pexels-photo-20343419/free-photo-of-a-woman-in-a-black-blazer-and-white-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'disco_flash',
      title: 'Studio 54 Flash',
      description: 'High-energy 70s disco glam.',
      imageUrl: 'https://images.pexels.com/photos/1587038/pexels-photo-1587038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'classic_glam',
      title: 'Classic Glam',
      description: 'Timeless Old Hollywood elegance.',
      imageUrl: 'https://images.pexels.com/photos/3290068/pexels-photo-3290068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12 text-white">See the Magic: Try a Look</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examples.map(ex => (
                <div key={ex.id} className="bg-gray-800/50 rounded-xl overflow-hidden flex flex-col group">
                    <img src={ex.imageUrl} alt={ex.title} className="w-full h-80 object-cover" />
                    <div className="p-6 flex flex-col flex-grow">
                        <h4 className="text-2xl font-bold text-white">{ex.title}</h4>
                        <p className="text-gray-400 mt-1 flex-grow">{ex.description}</p>
                        <button 
                            onClick={() => onPresetSelect(ex.id)}
                            className="mt-6 w-full px-6 py-3 font-semibold text-lg text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-all transform group-hover:scale-105"
                        >
                            Try This Look
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

const AnatomyOfTransformationSection = () => (
    <div className="w-full max-w-5xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12 text-white">Anatomy of a Transformation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
                <h4 className="text-2xl font-semibold text-gray-400 mb-4">Before</h4>
                <img 
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Original portrait of a woman" 
                    className="rounded-xl shadow-lg w-full aspect-[4/5] object-cover"
                />
            </div>
            <div className="flex flex-col items-center">
                <h4 className="text-2xl font-semibold text-teal-300 mb-4">After: Classic Glam</h4>
                 <img 
                    src="https://images.pexels.com/photos/2896425/pexels-photo-2896425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Woman transformed into a classic Hollywood style portrait" 
                    className="rounded-xl shadow-2xl w-full aspect-[4/5] object-cover border-2 border-teal-400/50"
                />
            </div>
        </div>
        <p className="text-center text-lg text-gray-400 mt-8 max-w-3xl mx-auto">
            We don't just apply a filter. We rebuild the photo from scratch—reconstructing lighting, fabric, and atmosphere to place your true likeness into a new reality.
        </p>
    </div>
);


const ProfessionalSection = ({ onCtaClick }: { onCtaClick: () => void }) => (
  <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gray-800/50 p-8 md:p-12 rounded-2xl border border-gray-700">
    <div className="text-center md:text-left">
        <h3 className="text-4xl font-bold text-white">For Professionals.</h3>
        <p className="text-teal-300 font-semibold text-xl mt-1">Upgrade Your LinkedIn Headshot.</p>
        <p className="mt-4 text-lg text-gray-400">
            Your first impression, perfected. Generate polished, authentic, and high-impact headshots that communicate authority and approachability. Choose your archetype and let our AI styling team build you a portrait that wins opportunities.
        </p>
        <ul className="mt-4 space-y-2 text-left text-gray-300">
            <li className="flex items-center gap-3"><span className="text-teal-400 text-xl">🎯</span> Executive Presence</li>
            <li className="flex items-center gap-3"><span className="text-teal-400 text-xl">🎨</span> Creative Confidence</li>
            <li className="flex items-center gap-3"><span className="text-teal-400 text-xl">💡</span> Future Forward</li>
            <li className="flex items-center gap-3"><span className="text-teal-400 text-xl">🤝</span> Trusted Partner</li>
        </ul>
         <div className="mt-8">
            <button onClick={onCtaClick} className="px-8 py-4 font-bold text-xl text-white bg-teal-600 rounded-lg transition-transform transform hover:scale-105">
                Build My Headshot
            </button>
        </div>
    </div>
    <div>
        <img src="https://images.pexels.com/photos/20343419/pexels-photo-20343419/free-photo-of-a-woman-in-a-black-blazer-and-white-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="A professional woman in a blazer with a confident expression" className="rounded-lg shadow-2xl object-cover w-full h-full aspect-square" />
    </div>
  </div>
);


const ShowcaseSection = () => {
  const galleryItems = [
    { src: "https://images.pexels.com/photos/18580931/pexels-photo-18580931/free-photo-of-a-woman-in-a-white-dress-and-a-crown-of-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A woman transformed into a Roman empress", caption: "Roman Empire" },
    { src: "https://images.pexels.com/photos/7182570/pexels-photo-7182570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A man reimagined in a Ghibli-style animation", caption: "Ghibli Dreamscape" },
    { src: "https://images.pexels.com/photos/20343331/pexels-photo-20343331/free-photo-of-a-woman-with-blue-hair-and-cyberpunk-style.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A person with vibrant hair in a cyberpunk city", caption: "Cyber Heist 2042" },
    { src: "https://images.pexels.com/photos/8487121/pexels-photo-8487121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A woman dressed as an 80s rock star", caption: "Studio 54 After Dark" },
    { src: "https://images.pexels.com/photos/7620653/pexels-photo-7620653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A man dressed as a fantasy knight in armor", caption: "Fantasy Knight" },
    { src: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A person's photo transformed into a Pixar-style character", caption: "Pixar-esque" },
    { src: "https://images.pexels.com/photos/4946723/pexels-photo-4946723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A woman styled as a 1920s flapper", caption: "Old Hollywood Glamour" },
    { src: "https://images.pexels.com/photos/7339132/pexels-photo-7339132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A man dressed as a film noir detective", caption: "Noir Detective" },
    { src: "https://images.pexels.com/photos/7129606/pexels-photo-7129606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "A woman with makeup in the style of Egyptian royalty", caption: "Desi Royal Court" }
  ];
  return (
    <div className="w-full max-w-7xl mx-auto">
      <h3 className="text-4xl font-bold text-center mb-12 text-white">Real People. Unreal Timelines.</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryItems.map((item, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden group aspect-w-1 aspect-h-1">
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/60 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-lg font-bold">{item.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrustAndTechSection = () => (
  <div className="text-center w-full max-w-3xl mx-auto py-12">
    <h3 className="text-4xl font-bold text-white">Powered by Gemini AI. Styled by Culture.</h3>
    <p className="mt-4 text-lg text-gray-400">
      Every image you see is generated from scratch — rebuilt pixel by pixel from your likeness. ICONA doesn’t apply filters; it re-photographs you through another lens. We train on style data, not faces, so your identity stays 100% yours.
    </p>
    <div className="flex justify-center gap-6 mt-8 text-sm text-gray-300">
      <span className="bg-gray-800/70 px-4 py-2 rounded-full">🔒 Private Uploads</span>
      <span className="bg-gray-800/70 px-4 py-2 rounded-full">⚡ New Photograph, Not Edit</span>
      <span className="bg-gray-800/70 px-4 py-2 rounded-full">🎨 Ethical & Authentic</span>
    </div>
  </div>
);

const ValueSection = ({ onCtaClick }: { onCtaClick: () => void }) => (
  <div className="text-center w-full max-w-3xl mx-auto py-12">
    <h3 className="text-4xl font-bold text-white">Your First Era’s On Us.</h3>
    <p className="mt-4 text-lg text-gray-400">
      Upload one photo, get a free transformation. Then explore Premium Eras with high-fidelity rendering, illustration modes, and cinematic lighting packs.
    </p>
    <div className="mt-8">
       <button onClick={onCtaClick} className="px-8 py-4 font-bold text-xl text-white bg-teal-600 rounded-lg transition-transform transform hover:scale-105">
        🚀 Start Free →
      </button>
    </div>
  </div>
);

const FaqSection = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const faqs = [
        { q: "What kind of photos work best?", a: "Even lighting, clear face, no hands or filters." },
        { q: "Is it safe?", a: "Yes — photos are encrypted, processed once, and automatically deleted." },
        { q: "Why does it look so real?", a: "We rebuild everything — not just overlay filters. Light, fabric, and atmosphere are regenerated from the ground up." }
    ];
    return (
        <div className="w-full max-w-3xl mx-auto">
             <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg">
                        <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-6">
                            <span className="text-lg font-semibold text-white">{faq.q}</span>
                            <svg className={`w-6 h-6 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}>
                            <p className="p-6 pt-0 text-gray-400">{faq.a}</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

const FinalUploader = ({ onImageUpload }: { onImageUpload: (file: File) => void }) => {
    const uploaderRef = React.useRef<HTMLDivElement>(null);
    const handleCtaClick = () => {
        (uploaderRef.current?.querySelector('input[type="file"]') as HTMLInputElement)?.click();
    };

    return (
      <div ref={uploaderRef} onClick={handleCtaClick} className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center p-12 bg-gray-800/50 rounded-2xl cursor-pointer">
        <h2 className="text-4xl font-bold text-white">Your Face Is the Story.</h2>
        <p className="text-lg text-gray-400 my-4">Let’s Tell It Across Time.</p>
        <p className="mb-8 text-gray-400">Upload one photo. Step through eras. See yourself — every version of you.</p>
        <div className="w-full max-w-md">
            <ImageUploader onImageUpload={onImageUpload} imageUrl={null} transformationMode="portrait" />
        </div>
      </div>
    );
};

interface LandingPageProps {
  onImageUpload: (file: File) => void;
  onPresetExampleSelect: (presetId: string) => void;
  user?: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onImageUpload, onPresetExampleSelect, user }) => {
    const finalUploaderRef = React.useRef<HTMLDivElement>(null);

    const handleCtaClick = () => {
        finalUploaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShowcaseSelect = (presetId: string) => {
        onPresetExampleSelect(presetId);
        handleCtaClick();
    };

    return (
      <div className="flex flex-col items-center gap-16 md:gap-24">
        <HeroSection onCtaClick={handleCtaClick} user={user} />
        <HowItWorksSection />
        <PresetShowcaseSection onPresetSelect={handleShowcaseSelect} />
        <AnatomyOfTransformationSection />
        <ProfessionalSection onCtaClick={handleCtaClick} />
        <ShowcaseSection />
        <TrustAndTechSection />
        <ValueSection onCtaClick={handleCtaClick} />
        <FaqSection />
        <div ref={finalUploaderRef}>
            <FinalUploader onImageUpload={onImageUpload} />
        </div>
      </div>
    );
};
