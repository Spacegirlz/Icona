// src/prompts.ts
import { generateDetailedPromptFromTextModel } from "./services/geminiService";

export type TransformationMode = 'portrait' | 'immersive';

// ICONA types
export interface StyleConfig {
  id: string;
  label: string;
  type: "photo" | "illustration";
  positive: string;
  negative: string;
}

export interface EraSettingConfig {
  id:string;
  label: string;
  context: string;
}

export interface EraConfig {
  id: string;
  label: string;
  isThematic: boolean;
  context: string;
  settings: EraSettingConfig[];
}

export interface MoodConfig {
  id: string;
  label: string;
  context: string;
}

export interface VitalityLevel {
  id: string;
  label: string;
  context: string;
}

export interface ArchetypeConfig {
  id: string;
  label: string;
  context: string;
}

export type QuickHit = {
  id: string;
  label: string;
  category: 'creative' | 'professional';
  emoji?: string;
  description?: string;
  moodId: string;
  vitalityLevelId: string;
  archetypeId: string;
  eraId: string;
  settingId?: string;
  manualEraText: string;
  styleId: string;
  additionalDetails: string;
  transformationMode: 'portrait' | 'immersive';
};


// ====================== MOODS (ICONA v1.0) ======================
export const MOODS: MoodConfig[] = [
  {
    id: "soft_laugh",
    label: "Soft Laugh",
    context: "subtle mid-laugh micro-expression, relaxed cheeks, eyes slightly crinkled, shoulders loose, candid timing"
  },
  {
    id: "side_eye",
    label: "Side‑eye",
    context: "a candid micro-expression, eyes caught in motion glancing sideways with a knowing smirk"
  },
  {
    id: "half_smile",
    label: "Half‑smile",
    context: "a quiet confidence with a gentle half-smile"
  },
  {
    id: "bashful",
    label: "Bashful",
    context: "a shy, bashful warmth in their gaze"
  },
  {
    id: "calm_power",
    label: "Calm Power",
    context: "steady posture, shoulders open, composed mouth, eyes direct and relaxed, grounded stillness"
  },
  {
    id: "distant_gaze",
    label: "Distant Gaze",
    context: "eyes focused off-camera, contemplative, gentle squint, wind or movement in hair allowed"
  },
  {
    id: "caught_mid_blink",
    label: "Caught Mid‑Blink",
    context: "a candid moment, caught mid-blink with natural imperfection"
  }
];

// ====================== VITALITY MAKEOVER (ICONA v1.0) ======================
export const VITALITY_MAKEOVER_LEVELS: VitalityLevel[] = [
  {
    id: "vitality_0_off",
    label: "Off",
    context: "natural presentation; no makeover refinements."
  },
  {
    id: "vitality_1_polish",
    label: "The Glow Up",
    context: "The Glow Up: well-rested appearance via lighting (soft under-eye fill, gentle cheekbone highlight); upright posture cue; subtle jawline clarity through lighting angle only—never alter bone structure or body proportions; even skin tone via color grading; no body morphing, no weight change, no face reshaping; flattering but realistic light."
  },
  {
    id: "vitality_2_tone",
    label: "Fit & Toned",
    context: "Fit & Toned: balanced silhouette with proportional refinement, faint athletic definition at arms and jaw, waist emphasis through posture and garment drape, lengthening vertical lines; identity preserved; no drastic size change."
  },
  {
    id: "vitality_3_director",
    label: "Celebrity Makeover",
    context: "Celebrity Makeover: celebrity photo-director illusion set: three-quarter angle, weight on back leg, shoulders open, chin forward-down; 85–105mm lens feel; subtractive side fill for edge slimming; soft rim light for separation; darker flanks and subtle vignette; structured tailoring effect in wardrobe; maintain natural proportions; no shrink-wrap look."
  }
];

// ====================== ARCHETYPES (NEW!) ======================
export const ARCHETYPES: ArchetypeConfig[] = [
    {
      id: "default",
      label: "Default (As You Are)",
      context: "They are presented at their natural age.",
    },
    {
      id: "younger",
      label: "Subtly Younger",
      context: "They appear as a subtly younger version of themselves.",
    },
    {
      id: "older",
      label: "Subtly Older",
      context: "They appear as a subtly older, more distinguished version of themselves.",
    },
];

const NEW_ERAS: EraConfig[] = [
  {
    id: "new_hollywood",
    label: "New Hollywood (Current Day)",
    isThematic: false,
    context: "Contemporary red carpet glamour, modern haute couture, and high-fashion editorial energy, like the modern Oscars or Met Gala.",
    settings: [
      { 
        id: "red_carpet_arrival", 
        label: "Red Carpet Arrival", 
        context: "Posing on the red carpet against a chaotic backdrop of blinding paparazzi flashbulbs and press microphones. Wearing a modern designer gown or tuxedo." 
      },
      { 
        id: "vanity_fair_afterparty", 
        label: "Vanity Fair Afterparty", 
        context: "A candid moment inside an exclusive afterparty. Moody, intimate lighting with bokeh from jewelry and champagne glasses." 
      },
      { 
        id: "hotel_suite_prep", 
        label: "Getting Ready (Hotel Suite)", 
        context: "A behind-the-scenes moment in a luxury hotel suite before the event, in the final stages of getting ready with stylists." 
      }
    ]
  },
  {
    id: "vogue_photoshoot",
    label: "Vogue Photoshoot (High Couture)",
    isThematic: false,
    context: "high-fashion editorial portrait, architectural posing, couture garment drama, magazine-cover presence",
    settings: [
      { 
        id: "studio_minimalism", 
        label: "Studio Minimalism", 
        context: "minimalist studio with seamless infinity backdrop, single key light, and dramatic shadow play" 
      },
      { 
        id: "rooftop_golden", 
        label: "Rooftop Golden Hour", 
        context: "urban rooftop at golden hour with a defocused skyline and sun rimlight gilding the subject's profile" 
      },
      { 
        id: "editorial_backstage", 
        label: "Editorial Backstage", 
        context: "an unguarded moment at a backstage makeup station, surrounded by the tools of the trade, catching a reflection in the mirror" 
      },
      {
        id: "atelier_fitting",
        label: "Atelier Fitting Room",
        context: "a couture atelier fitting room with muslin draping, tailor's chalk marks, and the subject checking their silhouette in a three-way mirror"
      }
    ]
  },
  {
    id: "speakeasy_1920s",
    label: "1920's Speakeasy (Jazz Age)",
    isThematic: true,
    context: "1920s New York City prohibition-era nightclub, Art Deco geometry, cigarette smoke diffusion, jazz-age rebellion energy.",
    settings: [
      { 
        id: "velvet_booth", 
        label: "Velvet Booth", 
        context: "a burgundy velvet banquette with a brass table lamp, mid-conversation in an intimate setting" 
      },
      { 
        id: "dance_floor", 
        label: "Dance Floor", 
        context: "parquet dance floor reflecting chandeliers, mid-Charleston step with fabric in motion" 
      },
      { 
        id: "alley_exit", 
        label: "Alley Exit (Midnight)", 
        context: "a brick alley behind the venue with a single tungsten bulb, adjusting a cloche hat after leaving" 
      },
      {
        id: "speakeasy_bar",
        label: "Speakeasy Bar",
        context: "leaning on a mahogany bar, backlit by amber bottles, engaged in a story"
      }
    ]
  },
  {
    id: "planet_2077",
    label: "Futuristic Planet 2077",
    isThematic: false,
    context: "off-world colony aesthetic, biodome architecture, advanced textiles, frontier pioneer energy",
    settings: [
      { 
        id: "neon_district", 
        label: "Neon District", 
        context: "navigating a crowded market with holographic signage in an alien script and vapor rising from food vendors" 
      },
      { 
        id: "station_lounge", 
        label: "Space Station Lounge", 
        context: "reclining in a lounge with a floor-to-ceiling viewport showing the planet below, with hair floating slightly in reduced gravity" 
      },
      { 
        id: "crater_observatory", 
        label: "Crater Observatory", 
        context: "inside a glass dome observatory showing two moons, wearing thermal clothing and holding a warm mug" 
      },
      {
        id: "hydroponic_garden",
        label: "Hydroponic Garden",
        context: "checking plants in a hydroponic garden with vertical towers and purple grow lights"
      }
    ]
  },
  {
    id: "rockstar_1980s",
    label: "1980's Rockstar (MTV Era)",
    isThematic: true,
    context: "1980s arena rock peak era, hairspray rebellion, leather and denim authenticity, sweat and stage lights.",
    settings: [
      { 
        id: "stage_spotlight", 
        label: "Stage Spotlight", 
        context: "caught in a white spotlight beam on stage, mid-performance crouch with microphone, with Marshall amps stacked behind" 
      },
      { 
        id: "tour_bus_bunk", 
        label: "Tour Bus Interior", 
        context: "a candid moment in a narrow tour bus bunk, tuning a guitar with highway lights streaking past the window" 
      },
      { 
        id: "backstage_mirror", 
        label: "Backstage Mirror", 
        context: "leaning close to a makeup mirror with bare bulbs, applying stage makeup with intense concentration" 
      },
      {
        id: "record_store_signing",
        label: "Record Store Signing",
        context: "mid-signature on a vinyl album at a record store signing event, with mall fluorescent lighting and camera flashes"
      }
    ]
  }
];

export const ERAS: EraConfig[] = [
  ...NEW_ERAS,
  {
    id: "old_hollywood",
    label: "Old Hollywood (1930s–50s)",
    isThematic: true,
    context: "golden-age studio portrait mood, classic 1930s-1950s wardrobe, timeless glamour.",
    settings: [
      { id: "soundstage", label: "Soundstage", context: "posing on a grand Hollywood soundstage with vintage film equipment and powerful studio lights." },
      { id: "premiere", label: "Premiere Night", context: "arriving at a glamorous movie premiere, with bright, chaotic flashbulbs of paparazzi cameras." }
    ]
  },
  {
    id: "studio_54",
    label: "Studio 54 (late 70s)",
    isThematic: true,
    context: "1970s NYC nightclub, in-club candid, disco ball caustics, metallic fabrics, liberated energy, caught mid-dance.",
    settings: [
      { id: "dancefloor", label: "Dancefloor", context: "lost in rhythm on a crowded dancefloor, light catching sweat and glitter." },
      { id: "vip", label: "VIP Booth", context: "in a velvet VIP booth, leaning in for a whispered conversation." }
    ]
  },
  {
    id: "indie_sleaze",
    label: "Indie Sleaze (2010 Tumblr)",
    isThematic: false,
    context: "messy candid, thrift styling, cigarette break alley aesthetic.",
    settings: [
      { id: "rooftop", label: "Rooftop", context: "on a rooftop with city lights bokeh and wind in their hair." },
      { id: "bathroom", label: "Bathroom Mirror", context: "a messy, overexposed mirror selfie in a grungy bathroom with a hard, direct flash." }
    ]
  },
  {
    id: "y2k_pop_star",
    label: "Y2K Pop Star",
    isThematic: true,
    context: "early-2000s pop editorial, shimmering wardrobe, frosted accents.",
    settings: [
      { id: "music_video", label: "Music Video", context: "on the set of a glossy, futuristic Y2K music video with vibrant colored gel lighting." },
      { id: "press_shoot", label: "Press Shoot", context: "at a press shoot with high-key lighting and a bold pose against a seamless, brightly colored backdrop." }
    ]
  },
  {
    id: "rnb_90s_cover",
    label: "90s R&B Cover",
    isThematic: true,
    context: "studio portrait with soft glam, warm skin tones, satin wardrobe, minimal set design.",
    settings: [
      { id: "album_cover", label: "Album Cover", context: "for an album cover with a vignette fade and whispered intimacy." },
      { id: "backstage", label: "Backstage", context: "in a dimly lit backstage dressing room, sharing a private joke." }
    ]
  },
  {
    id: "euro_techno_1998",
    label: "Euro Techno 1998",
    isThematic: false,
    context: "warehouse rave, sodium vapor palette, sweat + strobe realism, utilitarian styling.",
    settings: [
      { id: "strobe_pit", label: "Strobe Pit", context: "in a strobe pit with motion trails and laser haze." },
      { id: "smoke_break", label: "Smoke Break", context: "on a smoke break in a corridor with neon lighting." }
    ]
  },
  {
    id: "mythic_greece",
    label: "Mythic Greece",
    isThematic: false,
    context: "sun-bleached marble, draped fabrics, laurel texture, dawn light, heroic composure.",
    settings: [
      { id: "temple_steps", label: "Temple Steps", context: "on temple steps framed by pillars with warm sunrise rim light." },
      { id: "olive_grove", label: "Olive Grove", context: "in an olive grove with dappled light and a gentle breeze." }
    ]
  },
  {
    id: "neo_samurai",
    label: "Neo‑Samurai (alt future)",
    isThematic: false,
    context: "futurist kimono tech-weave, chrome accents, atmospheric lighting.",
    settings: [
      { id: "alley_rain", label: "Alley Rain", context: "in a rain-slicked alleyway with neon calligraphy signage." },
      { id: "rooftop_dawn", label: "Rooftop Dawn", context: "on a rooftop at dawn, overlooking a city shrouded in fog." }
    ]
  },
  {
    id: "regency_ball",
    label: "Regency Ball",
    isThematic: true,
    context: "Regency era (early 1800s) period costume portrait, candlelit ballroom, silk and lace.",
    settings: [
      { id: "grand_stair", label: "Grand Stair", context: "making a grand entrance on a grand staircase with candelabra glow." },
      { id: "garden_walk", label: "Garden Walk", context: "on a garden walk under moonlight." }
    ]
  },
  {
    id: "desi_royal_court",
    label: "Desi Royal Court",
    isThematic: true,
    context: "regal textiles, intricate jewelry, courtyard arches, warm gold light, dignified posture.",
    settings: [
      { id: "durbar_hall", label: "Durbar Hall", context: "in a durbar hall with carved wood and patterned carpets." },
      { id: "courtyard", label: "Courtyard", context: "in a courtyard with jaali lattice shadows and floral garlands." }
    ]
  },
  {
    id: "afrofuturism",
    label: "Afrofuturism",
    isThematic: false,
    context: "African aesthetics + advanced tech motifs, bold geometry, saturated jewel tones, cultural pride.",
    settings: [
      { id: "cosmic_metropolis", label: "Cosmic Metropolis", context: "in a cosmic metropolis with bioluminescent signage." },
      { id: "desert_runway", label: "Desert Runway", context: "on a desert runway with red earth and reflective alloys." }
    ]
  },
  {
    id: "roma_eterna",
    label: "Roma Eterna",
    isThematic: false,
    context: "imperial Rome timelessness, stone textures, bronze accents, commanding stance.",
    settings: [
      { id: "forum", label: "Forum", context: "in the Roman forum with arches and midday sun." },
      { id: "camp", label: "Campaign Camp", context: "in a campaign camp with canvas tents and torchlight." }
    ]
  },
  {
    id: "cyber_heist_2042",
    label: "Cyber Heist 2042",
    isThematic: false,
    context: "near-future covert ops, matte black techwear, low-key neon, tactical calm.",
    settings: [
      { id: "server_room", label: "Server Room", context: "in a server room with cool cyan strip lighting." },
      { id: "metro_escape", label: "Metro Escape", context: "escaping on a metro train with motion blur." }
    ]
  },
  {
    id: "coastal_grandma",
    label: "Coastal Grandma",
    isThematic: false,
    context: "sunlit seaside cottage colorway, linen textures, soft breeze, relaxed warmth.",
    settings: [
      { id: "porch", label: "Porch", context: "on a porch with dappled foliage and an unforced smile." },
      { id: "beach_walk", label: "Beach Walk", context: "on a beach walk with sea grass and an overcast softbox sky." }
    ]
  },
  {
    id: "dark_academia",
    label: "Dark Academia",
    isThematic: true,
    context: "scholarly mood, oaken shelves, tweed and wool, chiaroscuro with window light, bookish gravity.",
    settings: [
      { id: "library_nook", label: "Library Nook", context: "in a library nook, caught turning a page in a heavy, leather-bound book." },
      { id: "courtyard_arcade", label: "Courtyard Arcade", context: "in a courtyard arcade with stone colonnades and drizzle." }
    ]
  },
  {
    id: 'manual',
    label: 'Manual (Custom)',
    isThematic: false,
    context: '',
    settings: []
  },
  {
    id: 'surprise_me',
    label: 'Surprise Me! (AI Choice)',
    isThematic: false,
    context: 'A surprising and creative scene, chosen by the AI.',
    settings: []
  }
];

export const STYLES: StyleConfig[] = [
  {
    id: "photo-real-iphone",
    label: "Photo Real: Candid iPhone",
    type: "photo",
    positive: "high-fidelity photograph, candid moment, ambient natural light, contemporary phone camera look.",
    negative: "no heavy retouch, no beauty filter, no AI gloss"
  },
  {
    id: "photo-real-candid-selfie",
    label: "Photo Real: Candid Selfie",
    type: "photo",
    positive: "candid front-facing camera aesthetic, intimate close-up, shallow depth of field, direct eye contact with the lens, natural ambient light.",
    negative: "no visible phone, no distorted arm, no selfie stick, not a mirror selfie."
  },
  {
    id: "cinema-action-cam-pov",
    label: "Cinema: Action Cam POV",
    type: "photo",
    positive: "cinematic first-person point-of-view, ultra-wide lens feel with subtle edge distortion, sense of dynamic motion, high-energy, immersive.",
    negative: "no visible camera, no selfie stick, static, posed, telephoto."
  },
  {
    id: "editorial-vogue",
    label: "Editorial Vogue",
    type: "photo",
    positive: "editorial fashion photograph, controlled studio key light, soft fill, refined color grading, elevated styling.",
    negative: "no cheap glamour, no Instagram filter"
  },
  {
    id: "cinema-70mm",
    label: "Cinema Still 70mm",
    type: "photo",
    positive: "cinematic film still, 70mm vibe, rich dynamic range, filmic grain, soft halation, production design in frame.",
    negative: "no TV soap look"
  },
  {
    id: "film-35mm-grain",
    label: "Film 35mm Grain",
    type: "photo",
    positive: "35mm film photograph, organic grain, gentle contrast curve, authentic light leaks permitted.",
    negative: "no harsh digital sharpening"
  },
  {
    id: "polaroid",
    label: "Polaroid Instant",
    type: "photo",
    positive: "Instant film look, slight color shift, on-camera flash allowed.",
    negative: "no printed frame graphics"
  },
  {
    id: "ghibli",
    label: "Ghibli",
    type: "illustration",
    positive: "Ghibli art style. Hand-painted feel, soft palettes, naturalistic shading, tender atmosphere.",
    negative: "no heavy outlines, no Western comic inking"
  },
  {
    id: "anime",
    label: "Anime",
    type: "illustration",
    positive: "Anime illustration. Clean line art, cel-shading, expressive eyes.",
    negative: "no text bubbles"
  },
  {
    id: "pixar",
    label: "Pixar‑esque",
    type: "illustration",
    positive: "Pixar-esque CGI animation still. Cinematic lighting, subsurface scattering on skin.",
    negative: "no glossy plastic toy look"
  },
  {
    id: "comic-noir",
    label: "Comic Noir",
    type: "illustration",
    positive: "Comic noir art style. High-contrast inking, chiaroscuro, moody frame.",
    negative: "no speech balloons"
  },
  {
    id: "watercolor",
    label: "Watercolor Ink",
    type: "illustration",
    positive: "Watercolor and ink line art. Fluid pigment pools, organic edges.",
    negative: "no over-rendered detail"
  },
  {
    id: "oil-painting",
    label: "Oil Painting",
    type: "illustration",
    positive: "Museum-grade oil painting. Controlled brushwork, layered glazing.",
    negative: "no cartoon exaggeration"
  },
  {
    id: "lofi-doodle",
    label: "Lo‑fi Notebook Doodle",
    type: "illustration",
    positive: "Sketchbook drawing. Graphite and pen, casual doodle vibe.",
    negative: "no text notes, no ruled lines"
  }
];

export interface BuildPromptOpts {
  moodId?: string;
  vitalityLevelId?: string;
  archetypeId?: string;
  eraId?: string;
  settingId?: string;
  manualEraText?: string;
  styleId?: string;
  additionalDetails?: string;
  mode: TransformationMode;
  professionalPresetId?: string | null;
}

const universalNegativePrompt = "dark background, shadowy lighting, moody atmosphere, high contrast shadows, gray walls, beige backdrop, dim lighting, underexposed, black clothing only, side profile, looking away from camera, no smile, stern cold expression, blurry, low quality, over-retouched plastic skin, mannequin-like, lifeless eyes, frozen expression, stock photo aesthetic, corporate gray dystopia, 1990s dated headshot, cheap photo studio, harsh overhead lighting, flat lighting, washed out colors";


// ====================== QUICK HITS (NEW!) ======================
export const QUICK_HITS: QuickHit[] = [
  // ========== Creative Quick Hits ==========
  {
    id: 'classic_glam',
    label: 'Classic Glam',
    category: 'creative',
    emoji: '🎬',
    description: 'Old Hollywood red carpet elegance',
    moodId: 'calm_power',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'old_hollywood',
    settingId: 'premiere',
    manualEraText: `Generate a new photograph of the person in the provided image, styled for an Old Hollywood (1940s) movie premiere. Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a vertical 4:5 portrait.

A professional styling team has prepared them. Hair is styled in a period-authentic way that complements their features (e.g., Victory rolls, elegant updos, or sculpted waves), showing realistic hold and texture after an hour under the lights. Makeup (if culturally appropriate for their style) enhances their features with a 1940s aesthetic—defined brows, matte skin, a classic lip color suited to their skin tone. Wardrobe is a period-appropriate garment (e.g., a satin gown, tailored tuxedo) in a rich fabric that drapes naturally on their body, showing subtle creases from movement.

The scene is a movie premiere at night. They are caught in a dynamic, mid-motion moment—turning towards a camera, with the chaotic, bright flashbulbs of paparazzi creating a high-contrast, glamorous backdrop with lens flare. The lighting is dramatic and cinematic, with a strong key light sculpting their face. The mood is calm power; they are poised and confident amidst the chaos.

This is not a costume; it's an authentic moment. Their expression is a subtle, confident half-smile. The final image should have the feel of a classic 70mm film still: rich tones, subtle film grain, and masterful, timeless quality.`,
    styleId: 'cinema-70mm',
    additionalDetails: '',
    transformationMode: 'portrait'
  },
  {
    id: 'disco_flash',
    label: 'Studio 54 Flash',
    category: 'creative',
    emoji: '🪩',
    description: 'High-energy 70s disco glam.',
    moodId: 'soft_laugh',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'studio_54',
    settingId: 'dancefloor',
    manualEraText: `Generate a new photograph of the person in the provided image, captured in a candid moment on the dancefloor of Studio 54 in the late 1970s. Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a 1:1 square aspect ratio.

A professional styling team has adapted their look. Hair is styled with 70s volume and movement (e.g., feathered layers, natural afro, voluminous curls), now showing the effects of two hours of dancing—a slight sheen of sweat at the hairline, natural motion blur. Makeup (if culturally appropriate) is glamorous with glitter, shimmer, and gloss, catching the light. Wardrobe is authentic to the era and suits their body—sequins, metallic fabric, or a silk halter top that shows fluid movement.

The scene is a crowded, energetic dancefloor. A hard, on-camera flash freezes them mid-laugh, creating a high-contrast, saturated look. Fragments of light from a disco ball speckle the scene, and there's a hazy, smoky atmosphere. They are not posing but are genuinely lost in the music, exuding joyful, liberated energy.

This is a lived-in moment. The final image should feel like an authentic, high-energy candid shot from a 35mm point-and-shoot camera, complete with film grain and vibrant, slightly shifted colors.`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'immersive'
  },
  {
    id: 'y2k_diva',
    label: 'Y2K Diva',
    category: 'creative',
    emoji: '✨',
    description: 'Pop princess studio glam',
    moodId: 'side_eye',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'y2k_pop_star',
    settingId: 'music_video',
    manualEraText: `Generate a new photograph of the person in the provided image, styled as a Y2K pop star during a music video shoot (circa 2001). Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a vertical 4:5 portrait.

A professional styling team has created their look. Hair is styled with period-authentic trends (e.g., chunky highlights, spiky pieces, sleek straightening) adapted to their hair type. Makeup (if appropriate) is glossy and futuristic, with frosted eyeshadow, shimmering lip gloss, and flawless skin. Wardrobe is iconic Y2K fashion—low-rise pants, a metallic crop top, or shimmering fabrics, all tailored to their body.

The setting is a minimalist, futuristic music video set with clean lines and vibrant, colored gel lighting (e.g., cool blues and hot pinks). They are caught in a confident, playful pose, giving a knowing side-eye to the camera. The lighting is crisp and editorial.

The final image should have the polished, high-gloss feel of an editorial fashion photograph from a magazine of that era.`,
    styleId: 'editorial-vogue',
    additionalDetails: '',
    transformationMode: 'portrait'
  },
   {
    id: 'y2k_heartthrob',
    label: 'Y2K Heartthrob',
    category: 'creative',
    emoji: '✨',
    description: 'Boy band icon energy',
    moodId: 'half_smile',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'y2k_pop_star',
    settingId: 'press_shoot',
    manualEraText: `Generate a new photograph of the person in the provided image, styled as a Y2K-era heartthrob (circa 1999) during a press photoshoot. Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a vertical 4:5 portrait.

A professional styling team has crafted their look. Hair is styled in an iconic look of the time (e.g., frosted tips, a center part, or a textured cut) adapted to their features. Their look is fresh and clean. Wardrobe is smart-casual Y2K—a crisp shirt, a stylish jacket, or a fine-gauge knit, perfectly fitted.

The setting is a professional photo studio against a seamless, brightly colored backdrop. The lighting is high-contrast and dramatic, creating a classic boy band album cover feel. They are looking directly at the camera with a confident, smoldering half-smile. The pose is relaxed but intentional.

The final image should have the sharp, polished quality of a high-end editorial portrait from that time, ready for a magazine cover.`,
    styleId: 'editorial-vogue',
    additionalDetails: '',
    transformationMode: 'portrait'
  },
  {
    id: 'idol_stage',
    label: 'Kpop Makeover Editorial',
    category: 'creative',
    emoji: '🎤',
    description: 'K-Pop editorial perfection',
    moodId: 'calm_power',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a new photograph of the person in the provided image, reimagined as a K-Pop idol in a high-fashion editorial shoot. Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a vertical 4:5 portrait, resembling a 'photocard'.

A professional styling team has perfected their look. Hair is impeccably styled with a modern, editorial edge—perhaps a bold color or a sharp cut, with flawless texture and shine. Makeup is clean and perfect, emphasizing luminous "glass skin" and defining their features in a way that is both powerful and beautiful. Wardrobe is avant-garde and meticulously styled, fitting them perfectly.

The setting is a minimalist set with clean architectural lines and soft, diffused pastel lighting. The mood is one of calm power and confidence. They are looking directly into the lens with a captivating gaze.

The final image must be of the highest editorial quality, with perfect lighting, sharp focus, and a refined color grade, suitable for the cover of a fashion magazine.`,
    styleId: 'editorial-vogue',
    additionalDetails: '',
    transformationMode: 'portrait'
  },
  {
    id: 'dreamhouse_muse',
    label: 'Dreamhouse Muse',
    category: 'creative',
    emoji: '💖',
    description: 'High-fashion Barbiecore glam.',
    moodId: 'soft_laugh',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a new photograph of the person in the provided image, embodying a high-fashion, gender-inclusive 'Barbiecore' aesthetic. Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a vertical 4:5 portrait.

The scene is a hyper-stylized Dreamhouse interior with glossy pink surfaces, luxurious textures, and clean, high-key studio lighting. A professional styling team has curated their look. Hair and makeup are polished and glamorous. Their wardrobe is high-fashion, celebrating a vibrant pink-centric world with a confident and fun energy. The vibe is less about being a doll, and more about being a high-fashion muse inspired by the aesthetic.

They are caught in a moment of soft laughter, with relaxed shoulders and a genuine expression of joy. The final image should be a high-fidelity, candid-style photograph with a glossy but natural skin finish.`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'portrait'
  },
  {
    id: 'ghibli_meadow',
    label: 'Ghibli Meadow',
    category: 'creative',
    emoji: '🌿',
    description: 'Hand-painted whimsical escape',
    moodId: 'distant_gaze',
    vitalityLevelId: 'vitality_0_off',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a new illustration of the person in the provided image, rendered in the iconic Ghibli art style. Preserve their recognizable likeness and key facial features, translated into the soft, hand-painted aesthetic. The final composition MUST be a 1:1 square aspect ratio.

The scene is a lush Ghibli-style meadow. Tall, soft grasses sway in a gentle breeze under a beautiful watercolor sky, with soft, dappled sunlight filtering through. The character is looking off into the distance with a contemplative, serene gaze.

The final image must capture the tender, whimsical atmosphere of a Ghibli film. The style should be painterly, with soft color palettes, naturalistic shading, and clean edges, avoiding heavy outlines or Western comic book styles.`,
    styleId: 'ghibli',
    additionalDetails: '',
    transformationMode: 'immersive'
  },
  {
    id: 'library_light',
    label: 'Library Light',
    category: 'creative',
    emoji: '📚',
    description: 'Dark academia contemplation',
    moodId: 'half_smile',
    vitalityLevelId: 'vitality_0_off',
    archetypeId: 'default',
    eraId: 'dark_academia',
    settingId: 'library_nook',
    manualEraText: `Generate a new photograph of the person in the provided image, embodying the 'Dark Academia' aesthetic. Preserve their exact facial bone structure and unique identity markers. The final composition MUST be a vertical 4:5 portrait.

The scene is a cozy, dimly lit library nook, surrounded by old, leather-bound books. A single source of warm light, perhaps from a desk lamp, creates a dramatic chiaroscuro effect, illuminating them while casting deep shadows in the background. A professional styling team has dressed them in scholarly attire, like tweed or a wool sweater, that fits them perfectly.

They are captured in a quiet moment of contemplation, holding a heavy book, with a composed, knowing half-smile. The atmosphere is studious, intimate, and timeless. The final image should have the rich, cinematic quality of a 70mm film still, with deep tones and a subtle film grain.`,
    styleId: 'cinema-70mm',
    additionalDetails: '',
    transformationMode: 'portrait'
  },
  // ========== LinkedIn Professional Presets ==========
  {
    id: 'linkedin_executive',
    label: 'Executive Presence',
    category: 'professional',
    emoji: '🎯',
    description: 'Authoritative confidence for C-suite and senior leaders',
    moodId: 'calm_power',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a NEW professional LinkedIn headshot photograph of the person in the provided image. The final composition must be a standard 4:5 vertical headshot portrait.

SUBJECT:
Preserve facial bone structure, unique identity markers, and recognizable likeness. The emotional core: calm, confident authority—a subtle closed-lip smile or slight knowing smirk, direct steady gaze, shoulders open and relaxed. They exude executive presence: poised, strategic, trustworthy.

PROFESSIONAL STYLING TEAM:
Hair is impeccably groomed—freshly cut with executive polish and natural shine. For women: sophisticated makeup with defined brows, subtle contour, healthy glow, sophisticated nude or berry lip. For men: clean-shaven or precisely groomed facial hair. WARDROBE: Rich jewel tones (sapphire blue, deep burgundy, emerald) or warm executive neutrals (camel, warm charcoal, cognac brown). Structured blazer or tailored shirt in premium fabric—perfect fit, pressed, professional. NO gray, beige, or stark black.

LIGHTING MANDATE:
High-key three-point lighting setup. Key light: large octagonal softbox positioned at 45° creating even, luminous f/2.8-f/4 exposure across the face. Fill light at 50% key intensity eliminating ALL shadow darkness and creating bright, open look. Subtle hairlight providing gentle separation. COLOR TEMPERATURE: 5200K-5600K (neutral-warm professional). EXPOSURE: Slightly overexposed (+0.3 stops) for luminous, healthy skin. Background MUST be as bright and evenly lit as subject—absolutely no dark shadowy areas.

SCENE & COMPOSITION:
Portrait headshot: 85mm lens equivalent, eye level or slightly above, f/2.8-f/4 depth creating gentle background blur. Subject centered or on power rule-of-thirds. Background: soft gradient in warm sophisticated tones (warm gray-blue, soft taupe, champagne) or subtly blurred modern office with bright windows—always luminous, never dark. The overall aesthetic is polished, confident, and premium without being cold or unapproachable.

EXPRESSION & POSE:
Direct eye contact with camera—steady, confident, engaging. Closed-lip smile or subtle executive smirk. Body at slight three-quarter angle, shoulders back and open, head turned to face camera directly. Posture communicates calm power.

CRITICAL PROHIBITIONS:
No dark/shadowy backgrounds. No moody dramatic lighting. No high-contrast side shadows. No gray or beige clothing or walls. No side profiles or looking away. No black suits unless paired with vibrant shirt/blouse. No flat sterile lighting. No over-retouched plastic skin or frozen expression. No corporate gray aesthetic.

QUALITY STANDARDS:
Professional headshot quality equivalent to $500+ photographer session. 85mm portrait lens, f/2.8-f/4. Sharp focus on eyes. Natural skin texture with editorial retouching. Professional color grading with warm bias. Captures authority and approachability simultaneously.

${universalNegativePrompt}`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'portrait',
  },
  {
    id: 'linkedin_creative',
    label: 'Creative Confidence',
    category: 'professional',
    emoji: '🎨',
    description: 'Authentic personality for designers and marketers',
    moodId: 'half_smile',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a NEW professional LinkedIn headshot photograph of the person in the provided image. The final composition must be a standard 4:5 vertical headshot portrait.

SUBJECT:
Preserve facial bone structure, unique identity markers, and recognizable likeness. The emotional core: genuine warmth, creative energy—a real toothy smile with natural eye crinkle, relaxed shoulders, authentic presence. They exude creative confidence: approachable, innovative, human.

PROFESSIONAL STYLING TEAM:
Hair styled with intentional personality—natural movement, healthy shine, modern cut that shows individuality (not corporate uniform). For women: fresh, modern makeup—defined brows, healthy flush, maybe a bold lip (berry, coral) or natural nude. For men: well-groomed with personality (trimmed beard, styled hair). WARDROBE: Unexpected creative colors—burnt orange, deep teal, mustard yellow, sage green, terracotta, dusty rose. Quality casual-professional: blazer over interesting shirt, structured knit, denim jacket over button-down. Perfect fit, intentional style. NO gray, beige, black, or boring corporate.

LIGHTING MANDATE:
Bright, natural-feel lighting setup. Large soft key light (window or diffused strobe) at 30-45° creating warm, open illumination. Gentle fill keeping shadows soft and friendly—no darkness anywhere. COLOR TEMPERATURE: 5400K-5800K (bright daylight warmth). EXPOSURE: Bright and optimistic—overexpose slightly (+0.5 stops) for that sun-kissed glow. Background evenly lit and colorful—never dark or shadowy.

SCENE & COMPOSITION:
Environmental portrait: 50mm lens equivalent feel, eye level, f/2.8-f/4 for soft background blur revealing context. Setting: bright modern workspace, colorful wall, outdoor natural light, or creative studio with personality. Background includes hints of creative environment (books, plants, interesting architecture) but subject remains clear focal point. Overall aesthetic is vibrant, modern, approachable.

EXPRESSION & POSE:
Full genuine toothy smile—natural, warm, inviting. Direct eye contact with friendly energy. Body at relaxed angle, one shoulder slightly forward, head turned to camera. Posture is open and approachable—no stiff formality. Maybe one hand naturally touching collar or adjusting glasses—signs of life and authenticity.

CRITICAL PROHIBITIONS:
No dark/shadowy backgrounds. No moody dramatic lighting. No gray/beige anywhere. No stiff corporate posing. No side profiles or looking away. No boring "business professional" monotony. No over-retouched plastic skin. No lifeless expressions. No stark black clothing. Creative does NOT mean unprofessional—this is still polished and intentional.

QUALITY STANDARDS:
Professional headshot quality with creative edge. 50mm lens, f/2.8-f/4. Sharp focus on eyes. Natural skin texture with light editorial retouching. Vibrant color grading emphasizing warmth and personality.

${universalNegativePrompt}`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'portrait',
  },
  {
    id: 'linkedin_tech',
    label: 'Future Forward',
    category: 'professional',
    emoji: '💡',
    description: 'Approachable expertise for tech innovators',
    moodId: 'half_smile',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a NEW professional LinkedIn headshot photograph of the person in the provided image. The final composition must be a standard 4:5 vertical headshot portrait.

SUBJECT:
Preserve facial bone structure, unique identity markers, and recognizable likeness. The emotional core: intelligent warmth—friendly toothy smile, direct engaged gaze, slight forward lean suggesting energy and focus. They exude approachable expertise: smart, innovative, human-centered.

PROFESSIONAL STYLING TEAM:
Hair is modern and fresh—clean lines, natural texture, contemporary styling that says "current" not "dated." For women: fresh, minimal makeup—groomed brows, healthy natural skin, maybe a subtle lip. For men: clean or intentionally styled facial hair. WARDROBE: Modern tech aesthetic—crisp white Oxford, chambray button-down, electric blue sweater, quality charcoal henley, or blazer over tech-casual. Colors: bright clean (white, crisp blue, charcoal with pops of color). Perfect modern fit—not stuffy, not sloppy. NO beige, NO dated styles, NO heavy suits.

LIGHTING MANDATE:
Clean, bright, contemporary lighting. Large soft key creating even f/2.8 illumination across face—think Silicon Valley founder shoot. Subtle fill eliminating shadows while maintaining dimension. COLOR TEMPERATURE: 5600K-6000K (cool-neutral modern). EXPOSURE: Bright and clean (+0.3 stops over) for that optimistic startup energy. Background bright and modern—clean white, soft blue-gray gradient, or naturally lit contemporary space.

SCENE & COMPOSITION:
Modern portrait: 85mm lens, eye level, f/2.8-f/4 depth. Clean contemporary aesthetic—either seamless modern backdrop (white, soft tech-blue, warm light gray) or naturally lit outdoor/modern office with subtle blur. Environment feels current, optimistic, forward-thinking. Composition is clean and uncluttered.

EXPRESSION & POSE:
Genuine friendly smile showing teeth—approachable but intelligent. Direct eye contact with engaged, forward-thinking energy. Body at slight angle, shoulders open, maybe one shoulder slightly forward suggesting momentum. Head directly facing camera.

CRITICAL PROHIBITIONS:
No dark/moody backgrounds. No dramatic lighting. No gray/beige corporate dullness. No stiff formal posing. No looking away from camera. No dated hairstyles or clothing. No heavy business suits. No over-processed skin. This is modern professional, not 1990s corporate headshot.

QUALITY STANDARDS:
Contemporary professional quality—think $400-600 Silicon Valley photographer. 85mm lens, f/2.8-f/4. Tack-sharp eyes. Natural skin texture with subtle retouching. Clean, modern color grading.

${universalNegativePrompt}`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'portrait',
  },
  {
    id: 'linkedin_sales',
    label: 'Trusted Partner',
    category: 'professional',
    emoji: '🤝',
    description: 'Maximum warmth for relationship-builders',
    moodId: 'soft_laugh',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a NEW professional LinkedIn headshot photograph of the person in the provided image. The final composition must be a standard 4:5 vertical headshot portrait.

SUBJECT:
Preserve facial bone structure, unique identity markers, and recognizable likeness. The emotional core: maximum approachability—big genuine toothy smile, warm crinkled eyes, open relaxed posture. They exude trustworthy warmth: likeable, reliable, service-oriented, the person clients WANT to work with.

PROFESSIONAL STYLING TEAM:
Hair is polished and approachable—clean, styled, healthy shine, nothing too edgy or corporate-stiff. For women: warm makeup palette—defined brows, healthy glow, warm peachy-pink blush, friendly lip color (coral, rose, warm nude). For men: clean-shaven or neatly groomed, fresh haircut. WARDROBE: Approachable warm colors—soft blue, coral, lavender, warm gray, cream, peach, sky blue. Quality professional pieces: blazer, button-down, knit, or blouse in colors that make people feel comfortable. Perfect fit, friendly vibe. NO dark intimidating colors, NO gray/beige.

LIGHTING MANDATE:
Maximum warmth and openness. Large soft key light (beauty dish or large octabox) creating bright, even, flattering f/2.8 illumination. Strong fill light ensuring NO shadows—this person has nothing to hide. COLOR TEMPERATURE: 5400K-5800K (warm daylight). EXPOSURE: Bright and inviting (+0.5 stops over) for that sun-soaked approachability. Background MUST be bright, warm, and welcoming—never dark or shadowy. Think "walking into a sunny room."

SCENE & COMPOSITION:
Warm portrait: 85mm lens, eye level, f/2.8-f/4 creating soft flattering background. Setting: bright warm backdrop (cream, soft blue, warm light gray, peachy) or naturally lit space with windows suggesting openness and transparency. Environment feels inviting, trustworthy, like a welcoming office or bright airy space.

EXPRESSION & POSE:
MAXIMUM smile—full toothy grin, natural eye crinkle, genuine warmth radiating. Direct eye contact with welcoming energy. Body at slight angle, shoulders relaxed and open, perhaps slight lean-in suggesting engagement. Head facing camera directly.

CRITICAL PROHIBITIONS:
No dark/shadowy backgrounds. No dramatic moody lighting. No gray/beige dullness. No intimidating power poses. No closed-mouth smiles (this role needs MAXIMUM warmth). No side profiles or looking away. No dark serious clothing. No over-retouched perfection. Authentic warmth beats artificial polish.

QUALITY STANDARDS:
Professional headshot quality optimized for likeability and trust. 85mm portrait lens, f/2.8-f/4. Sharp eyes. Natural skin texture with flattering retouching. Warm color grading—golden hour feel even if shot indoors.

${universalNegativePrompt}`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'portrait',
  },
  {
    id: 'linkedin_advisor',
    label: 'Seasoned Expert',
    category: 'professional',
    emoji: '📊',
    description: 'Thoughtful wisdom for strategic advisors',
    moodId: 'calm_power',
    vitalityLevelId: 'vitality_1_polish',
    archetypeId: 'default',
    eraId: 'manual',
    manualEraText: `Generate a NEW professional LinkedIn headshot photograph of the person in the provided image. The final composition must be a standard 4:5 vertical headshot portrait.

SUBJECT:
Preserve facial bone structure, unique identity markers, and recognizable likeness. The emotional core: thoughtful confidence—slight knowing smile or serious intelligent expression, direct steady gaze, composed posture. They exude seasoned expertise: wise, reliable, strategic thinking, depth of experience.

PROFESSIONAL STYLING TEAM:
Hair is refined and polished—immaculate grooming, sophisticated style, professional shine. For women: refined makeup—perfectly groomed brows, sophisticated neutral palette, subtle contour, classic lip (nude, berry, or rose). For men: distinguished grooming, clean or silver-enhanced beard if worn. WARDROBE: Professional depth colors—burgundy, deep plum, forest green, navy, camel, warm charcoal, cognac brown. Quality investment pieces: tailored blazer, fine-gauge knit, classic button-down in rich fabrics. Impeccable fit suggesting attention to detail. NO cheap fabrics, NO gray/beige, NO trendy fast fashion.

LIGHTING MANDATE:
Refined professional lighting. Controlled three-point setup: key light (large softbox) at 45° creating f/2.8-f/4 even exposure with subtle modeling. Fill at 40% maintaining slight dimension while keeping overall brightness. Hairlight for polish. COLOR TEMPERATURE: 5200K-5400K (neutral-warm professional). EXPOSURE: Properly exposed (+0.2 stops) for healthy glow without being overly bright. Background well-lit in sophisticated tones—never dark or murky.

SCENE & COMPOSITION:
Classic portrait: 85-105mm lens equivalent, eye level, f/2.8-f/4 creating refined background separation. Setting: sophisticated backdrop in rich muted tones (deep navy-gray, warm taupe, soft olive, champagne) or subtly blurred professional environment (office with books, elegant architecture). Aesthetic is timeless, refined, substantial—not trendy, not dated.

EXPRESSION & POSE:
Thoughtful half-smile or serious intelligent expression with slight warmth in eyes—not cold, not over-friendly, perfectly balanced. Direct eye contact suggesting depth and consideration. Body at three-quarter angle, excellent posture, shoulders back, head turned to camera. Pose communicates "I've seen this before, and I know how to solve it."

CRITICAL PROHIBITIONS:
No dark/shadowy backgrounds. No overly dramatic lighting. No gray/beige mediocrity. No overly casual "buddy" energy (wrong for this role). No trendy styling that will date the photo. No stiff corporate coldness. No looking away from camera. Find the balance: approachable expertise.

QUALITY STANDARDS:
Premium professional headshot quality—$600+ photographer level. 85-105mm lens, f/2.8-f/4. Crystal-sharp eyes. Refined skin retouching maintaining texture. Sophisticated color grading with slight warmth.

${universalNegativePrompt}`,
    styleId: 'photo-real-iphone',
    additionalDetails: '',
    transformationMode: 'portrait',
  }
];

export function quickHitToOpts(qhId: string) {
  const qh = QUICK_HITS.find(q => q.id === qhId);
  if (!qh) {
    console.error(`Unknown Quick Hit: ${qhId}. Defaulting.`);
    return quickHitToOpts('linkedin_tech');
  }
  return {
    moodId: qh.moodId,
    vitalityLevelId: qh.vitalityLevelId,
    archetypeId: qh.archetypeId,
    eraId: qh.eraId,
    settingId: qh.settingId,
    manualEraText: qh.manualEraText || '',
    styleId: qh.styleId,
    additionalDetails: qh.additionalDetails,
    mode: qh.transformationMode,
  };
}

function getTimeElapsed(eraId?: string): string {
  const timings: { [key: string]: string } = {
    'speakeasy_1920s': '3 hours 20 minutes into the evening',
    'rockstar_1980s': '90 minutes into performance, 5 minute break',
    'vogue_photoshoot': '2 hours 15 minutes into a high-fashion shoot',
    'studio_54': '4 hours into dancing, 2am energy',
    'old_hollywood': '45 minutes into a glamorous premiere event',
    'regency_ball': '2 hours into a grand ball, between dances',
  };
  return eraId ? (timings[eraId] || '2 hours into the experience') : 'a significant amount of time';
}

export const buildCreativeMetaPrompt = (opts: BuildPromptOpts): string => {
  const era = ERAS.find(e => e.id === opts.eraId);
  const setting = era?.settings?.find(s => s.id === opts.settingId);
  const mood = MOODS.find(m => m.id === opts.moodId);
  const vitalityLevel = VITALITY_MAKEOVER_LEVELS.find(v => v.id === opts.vitalityLevelId);
  const styleObj = STYLES.find(s => s.id === opts.styleId);
  const styleType = styleObj?.type ?? 'photo';
  const archetype = ARCHETYPES.find(a => a.id === opts.archetypeId);

  const isThematic = (era && era.isThematic) || (opts.eraId === 'manual' && opts.manualEraText);
  let styleLabel = styleObj?.label || 'Default Photo';

  if (isThematic) {
      const quickHit = QUICK_HITS.find(qh => qh.manualEraText === opts.manualEraText && qh.eraId === 'manual');
      const themeName = quickHit?.label || era?.label;
      if (themeName) {
         styleLabel = `${themeName} Style (${styleObj?.label.split(':')[0]})`;
      }
  }

  const selectionParts = [
    `- Mood: ${mood?.label || 'Default'}`,
    `- Vitality Level: ${vitalityLevel?.label || 'Off'}`,
    `- Style: ${styleLabel}`,
  ];
  
  if (opts.manualEraText) {
      selectionParts.push(`- Manual Vision: ${opts.manualEraText}`);
  } else if (era) {
      selectionParts.push(`- Era: ${era.label}`);
      if (era.context) {
          selectionParts.push(`  - Core Concept: ${era.context}`);
      }
      if (setting) {
          selectionParts.push(`- Setting: ${setting.label}`);
          if (setting.context) {
              selectionParts.push(`  - Details: ${setting.context}`);
          }
      }
  }

  if (opts.additionalDetails) {
      selectionParts.push(`- Additional Details: ${opts.additionalDetails}`);
  }

  const userSelection = selectionParts.join('\n');
  
  const aspectRatioMandate = opts.mode === 'portrait' 
    ? "The final image composition MUST have a vertical 4:5 portrait aspect ratio."
    : "The final image composition MUST have a 1:1 square aspect ratio.";


  return `PHOTOGRAPHIC TRANSFORMATION TASK: Generate a new photograph of this person with precise identity preservation and creative scene reconstruction.

You are an expert prompt engineer for AI image generation, specializing in creating authentic, lived-in portraits where people genuinely belong in their era and setting. Your task is to generate a comprehensive image generation prompt based on a user's selection.

USER SELECTION:
${userSelection}

YOUR TASK:
Generate a complete and detailed image generation prompt following this EXACT structure and tone. Be descriptive, sensory, and cinematic.

1.  **SUBJECT & IDENTITY PRESERVATION:**
    Start with: "Generate a new ${styleType} of the person in the provided image. Preserve their exact facial bone structure, unique identity markers, and recognizable likeness. ${archetype?.context || ''}" Then, describe the subject's emotional core and physical state based on the user's selected Mood and Vitality. Ensure the description feels natural and alive, not posed. Mention specific micro-expressions from the mood context: "${mood?.context || ''}".

2.  **PROFESSIONAL STYLING (Hair, Makeup, Wardrobe):**
    Describe the work of a professional styling team.
    - **Hair:** Detail an era-appropriate hairstyle that is adapted to the subject's natural hair texture and face shape. It must show signs of wear appropriate for the scene's duration (e.g., flyaways, loosening).
    - **Makeup:** Using gender-adaptive language, describe era-appropriate cosmetics that enhance their features, not mask them. Detail realistic wear, like slight fading or creasing.
    - **Wardrobe:** Describe the era-appropriate garments, specifying fabric type, fit, and how it drapes on the body. It must show realistic fabric physics (wrinkles, folds from movement).

3.  **SCENE & PHYSICAL EMBODIMENT:**
    Describe the scene based on the chosen Era and Setting, or the user's manual text. The scene must feel lived-in.
    - **Time Elapsed:** State the time elapsed, for example: "${getTimeElapsed(opts.eraId)}."
    - **Cause & Effect:** Detail how the subject physically interacts with the environment. Mention furniture compression if they're sitting, residue on their hands if they're touching something, how the temperature affects their skin, etc. This proves they exist *within* the scene.

4.  **DYNAMIC MOMENT & COMPOSITION:**
    Describe the exact moment being captured. It must be a candid, in-between moment, not a static pose. For example: "The camera catches them mid-gesture, three seconds into a laugh..." Describe the composition based on the user's choice ('portrait' or 'immersive'), mentioning lens feel (e.g., 85mm for portrait, 35mm for immersive) and lighting motivation. ${aspectRatioMandate} Optimize for iOS display: sRGB color space, avoid extreme highlights that clip on mobile screens, ensure legibility at thumbnail size.

5.  **STYLE & EXECUTION:**
    Specify the execution based on the user's chosen Style. Include details on lighting, color grading, film grain (if applicable), and overall quality. Reiterate that the final output must be hyperrealistic and masterful.
    
CRITICAL IDENTITY & GENDER PRESERVATION MANDATES:
- CRITICAL PROHIBITION: Do NOT alter the subject's perceived gender, ethnicity, or core facial structure. The goal is to see THIS person in a new style, not to turn them into a different person.
- The styling (hair, makeup, wardrobe) must be adapted to the subject's existing features in a gender-inclusive way. For example, for a "Barbiecore" look, a man should look like a high-fashion Ken, not be turned into Barbie. A woman should look like a high-fashion Barbie. The aesthetic must be applied to the person, not the other way around.
- Preserve all unique and defining characteristics of the person in the photo.

CRITICAL REQUIREMENTS:
- Use gender-adaptive language only (their/they).
- Every detail must have a cause, explaining *why* it looks that way.
- Focus on what the person is experiencing, not just what the viewer sees.
- The person must LIVE in the scene, not just be placed in it.

Generate the complete, detailed, multi-paragraph prompt for the image generation model now.
`;
};

export async function buildFinalPrompt(opts: BuildPromptOpts): Promise<string> {
    if (opts.professionalPresetId) {
        const preset = QUICK_HITS.find(p => p.id === opts.professionalPresetId);
        if (preset && preset.manualEraText) {
            return preset.manualEraText;
        }
    }
    
    // For creative prompts, build the meta prompt and call the text model
    const metaPrompt = buildCreativeMetaPrompt(opts);
    const finalImagePrompt = await generateDetailedPromptFromTextModel(metaPrompt);
    return finalImagePrompt;
}