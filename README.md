# AutoBlog Creator - Free WordPress Automation Tool

A completely free web application that automatically generates blog posts with relevant images and posts them directly to your WordPress site. No costs involved - uses only free APIs and services.

## ✨ Features

- **Free Content Generation**: Uses free AI APIs to generate blog content
- **Automatic Image Search**: Finds relevant images using free image APIs
- **Beautiful Formatting**: Professional HTML formatting with responsive design
- **WordPress Integration**: Direct posting to your WordPress site via REST API
- **Multiple Writing Tones**: Professional, casual, friendly, and informative styles
- **Customizable Word Count**: 300, 500, 800, or 1000 words
- **Live Preview**: See your generated content before posting
- **Edit Mode**: Make changes to generated content before publishing
- **Auto-save**: Form data is automatically saved in your browser

## 🚀 Quick Start

1. **Download the files** to your computer
2. **Open `public/index.html`** in your web browser
3. **Fill in the form** with your blog topic and WordPress details
4. **Click "Generate & Post Blog"** and watch the magic happen!

## 📋 Requirements

- A WordPress website with REST API enabled
- WordPress username and password
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🦙 Ollama Installation (for AI Content Generation)

If you want to use local AI models for content generation, you can install [Ollama](https://ollama.com/):

### Windows
1. Download the Windows installer from [Ollama Downloads](https://ollama.com/download).
2. Run the installer and follow the prompts.
3. After installation, open a new terminal and run:
   ```
   ollama run llama2
   ```
   (Replace `llama2` with your preferred model if needed.)

### macOS
1. Open Terminal and run:
   ```
   brew install ollama
   ollama run llama2
   ```

### Linux
1. Follow the instructions on the [Ollama Linux page](https://ollama.com/download) for your distribution.
2. After installation, run:
   ```
   ollama run llama2
   ```

For more details and advanced usage, see the [Ollama documentation](https://ollama.com/docs).

## 🖥️ Running the Backend

To use this application, you must also run the backend server on your computer:

1. Open a terminal in the project folder.
2. Install dependencies (if you haven't already):
   ```
   npm install
   ```
3. Start the backend server:
   ```
   node server.js
   ```

The backend is required for content generation and WordPress integration.

## 🦙 Ollama: Recommended for Best Results

While the app can use free online models, we **highly recommend** using Ollama if you have a good PC (modern CPU, 16GB+ RAM recommended). Ollama is truly free, runs locally, is more reliable, and offers better performance and privacy compared to online models.

- **Why use Ollama?**
  - No API limits or hidden costs
  - Works offline, no internet required for generation
  - Faster and more reliable if your hardware supports it
  - Keeps your data private on your machine

See the [Ollama Installation](#-ollama-installation-for-ai-content-generation) section above for setup instructions.

## 🔧 Setup Instructions

### 1. WordPress Setup

1. **Enable REST API** (usually enabled by default in WordPress 4.7+)
2. **Create an Application Password** (recommended for security):
   - Go to WordPress Admin → Users → Profile
   - Scroll down to "Application Passwords"
   - Create a new application password
   - Use this password instead of your main password

### 2. Using the Application

1. **Open `index.html`** in your web browser
2. **Enter your blog topic** (e.g., "Best Coffee Shops in New York")
3. **Choose your writing tone**:
   - Professional: Formal, business-like
   - Casual: Relaxed, conversational
   - Friendly: Warm, approachable
   - Informative: Educational, detailed
4. **Select word count** (300-1000 words)
5. **Enter WordPress details**:
   - Site URL: `https://yourblog.com`
   - Username: Your WordPress username
   - Password: Your WordPress password or application password
6. **Click "Generate & Post Blog"**

## 🆓 Free APIs Used

This application uses only free APIs and services:

### Content Generation
- **Fallback Templates**: Built-in professional templates for reliable content generation
- **Free Text Generation**: Attempts to use free AI services when available

### Image Search
- **Unsplash API**: Free stock photos (requires API key for production)
- **Picsum Photos**: Free placeholder images (used as fallback)

### WordPress Integration
- **WordPress REST API**: Built into WordPress, completely free

## 🔒 Security Notes

- **Application Passwords**: Use WordPress application passwords instead of your main password
- **HTTPS**: Always use HTTPS for your WordPress site
- **Local Storage**: Form data is saved locally in your browser only
- **No Server**: This runs entirely in your browser - no data sent to external servers

## 🎨 Customization

### Adding Your Own Templates

Edit the `generateFallbackContent` function in `public/script.js` to add custom content templates:

```javascript
const templates = {
    yourCustomTone: `# ${subject}
    
## Your Custom Template
Your custom content here...
`
};
```

### Styling Changes

Modify `public/styles.css` to change colors, fonts, and layout:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ffd700;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **WordPress Connection Failed**
   - Check your WordPress URL (include `https://`)
   - Verify username and password
   - Ensure REST API is enabled
   - Try using an application password

2. **Images Not Loading**
   - The app uses placeholder images by default
   - For Unsplash images, you need an API key

3. **Content Generation Issues**
   - The app uses fallback templates for reliability
   - All content is generated locally

### Getting Help

- Check that all files are in the same folder
- Ensure your browser supports modern JavaScript
- Try refreshing the page if issues occur

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🆕 Future Enhancements

- More content templates
- Additional image sources
- SEO optimization features
- Social media integration
- Content scheduling

## 📄 License

This project is completely free to use and modify. No licensing fees or restrictions.

## 🤝 Contributing

Feel free to improve this tool by:
- Adding new content templates
- Improving the UI/UX
- Adding new features
- Fixing bugs

## 💡 Tips for Best Results

1. **Be Specific**: Use detailed topics for better content generation
2. **Choose Appropriate Tone**: Match your blog's style and audience
3. **Review Content**: Always preview and edit before posting
4. **Use Application Passwords**: More secure than your main password
5. **Regular Backups**: Keep backups of your WordPress site

## 🎯 Example Use Cases

- **Business Blogs**: Professional tone, industry topics
- **Personal Blogs**: Casual/friendly tone, lifestyle topics
- **Educational Content**: Informative tone, how-to guides
- **News Updates**: Professional tone, current events

## 🚀 Local Development & Running

### 1. Backend Setup

1. Create a `.env` file in the project root with your API keys (see example below):
   ```env
   HUGGING_FACE_TOKEN=your_huggingface_token
   UNSPLASH_ACCESS_KEY=your_unsplash_key
   PIXABAY_API_KEY=your_pixabay_key
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```
   The backend will run on http://localhost:3001

### 2. Frontend Usage

- Open `index.html` directly in your browser for local use.
- The frontend will connect to the backend at `http://localhost:3001` for content and images.

---

**Enjoy your free automated blogging experience! 🚀** 