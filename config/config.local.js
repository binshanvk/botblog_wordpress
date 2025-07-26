// AutoBlog Creator - YOUR LOCAL CONFIGURATION
// Edit this file with your actual API keys

(function() {
    const CONFIG = {
        // Free AI Content Generation APIs
        AI_APIS: {
            // Hugging Face Inference API (free tier)
            // Get your free token at: https://huggingface.co/settings/tokens
            HUGGING_FACE_TOKEN: '', // Add your token here

            // OpenAI-compatible free API
            FREE_GPT_URL: '', // Add your API URL here

            // Alternative free text generation
            FREE_TEXT_API: '' // Add your API URL here
        },

        // Free Image APIs
        IMAGE_APIS: {
            // Unsplash API (free tier)
            // Get your free API key at: https://unsplash.com/developers
            UNSPLASH_ACCESS_KEY: '', // Add your key here

            // Pixabay API (free tier)
            // Get your free API key at: https://pixabay.com/api/docs/
            PIXABAY_API_KEY: '', // Add your key here

            // Picsum Photos (no API key needed)
            PICSUM_URL: 'https://picsum.photos'
        },
        WORDPRESS: {
            // Default settings for WordPress integration
            DEFAULT_STATUS: 'publish',
            DEFAULT_FORMAT: 'standard',
            API_VERSION: 'v2',
            // PASSWORD: '' // Optionally add your WordPress application password here (not recommended). Never commit real passwords to public repositories.
        },
        CONTENT: {
            WORD_COUNTS: [300, 500, 800, 1000],
            TONES: ['professional', 'casual', 'friendly', 'informative'],
            DEFAULT_TEMPERATURE: 0.7,
            MAX_TOKENS: 1000
        },
        UI: {
            AUTO_SAVE: true,
            SHOW_TIPS: true,
            ANIMATION_DURATION: 300,
            MESSAGE_DURATION: 5000
        },
        ERROR_HANDLING: {
            MAX_RETRIES: 3,
            TIMEOUT: 10000,
            SHOW_DETAILED_ERRORS: false
        }
    };
    if (typeof window !== 'undefined' && window.CONFIG) {
        Object.assign(window.CONFIG, CONFIG);
    } else if (typeof window !== 'undefined') {
        window.CONFIG = CONFIG;
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = CONFIG;
    }
})();

/*
🎯 STEP-BY-STEP EDITING GUIDE:

1. HUGGING FACE TOKEN (for better AI content):
   - Go to: https://huggingface.co/settings/tokens
   - Sign up for free account
   - Click "New token"
   - Give it a name like "AutoBlog Creator"
   - Copy the token (starts with "hf_")
   - Replace 'hf_YOUR_ACTUAL_TOKEN_HERE' with your token

2. UNSPLASH API KEY (for better images):
   - Go to: https://unsplash.com/developers
   - Sign up for free account
   - Click "New Application"
   - Fill in the form (any name/description)
   - Copy your "Access Key"
   - Replace 'YOUR_ACTUAL_UNSPLASH_KEY_HERE' with your key

3. PIXABAY API KEY (alternative images):
   - Go to: https://pixabay.com/api/docs/
   - Sign up for free account
   - Get your API key
   - Replace 'YOUR_ACTUAL_PIXABAY_KEY_HERE' with your key

⚠️ IMPORTANT NOTES:
- The system works WITHOUT these keys using fallback methods
- These keys are FREE and give you better content/images
- Never share your API keys publicly
- Keep this file secure (don't upload to public repositories)

✅ AFTER EDITING:
- Save this file as 'config.local.js' in the same folder as index.html
- The system will automatically use your keys
- You're ready to start creating automated blog posts!
*/ 