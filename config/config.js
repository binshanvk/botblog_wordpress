// AutoBlog Creator Configuration
// Copy this file to config.local.js and add your API keys

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
    
    // WordPress Settings
    WORDPRESS: {
        // Default settings for WordPress integration
        DEFAULT_STATUS: 'publish',
        DEFAULT_FORMAT: 'standard',
        API_VERSION: 'v2'
    },
    
    // Content Generation Settings
    CONTENT: {
        // Default word count ranges
        WORD_COUNTS: [300, 500, 800, 1000],
        
        // Writing tones available
        TONES: ['professional', 'casual', 'friendly', 'informative'],
        
        // Default temperature for AI generation
        DEFAULT_TEMPERATURE: 0.7,
        
        // Maximum tokens for AI generation
        MAX_TOKENS: 1000
    },
    
    // UI Settings
    UI: {
        // Auto-save form data
        AUTO_SAVE: true,
        
        // Show helpful tips
        SHOW_TIPS: true,
        
        // Animation duration
        ANIMATION_DURATION: 300,
        
        // Message display duration (ms)
        MESSAGE_DURATION: 5000
    },
    
    // Error Handling
    ERROR_HANDLING: {
        // Retry attempts for API calls
        MAX_RETRIES: 3,
        
        // Timeout for API calls (ms)
        TIMEOUT: 10000,
        
        // Show detailed error messages
        SHOW_DETAILED_ERRORS: false
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

// Instructions for users:
/*
To use this configuration:

1. Copy this file to config.local.js
2. Replace the placeholder values with your actual API keys
3. The application will automatically use your local configuration

Free API Keys You Can Get:

1. Hugging Face (AI Content):
   - Go to https://huggingface.co/settings/tokens
   - Create a free account
   - Generate a new token
   - Replace 'hf_xxx' with your token

2. Unsplash (Images):
   - Go to https://unsplash.com/developers
   - Create a free account
   - Create a new application
   - Copy your Access Key
   - Replace 'YOUR_UNSPLASH_ACCESS_KEY' with your key

3. Pixabay (Images):
   - Go to https://pixabay.com/api/docs/
   - Create a free account
   - Get your API key
   - Replace 'YOUR_PIXABAY_API_KEY' with your key

Note: The application works without these API keys using fallback methods,
but having them will provide better content and images.
*/ 