require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Dynamic import for node-fetch v3 compatibility
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// --- AI Content Generation ---
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  // 1. Try local Ollama API
  try {
    const ollamaPrompt = `Write a highly engaging, up-to-date, and unique blog post about the following topic. Use the latest information, include interesting facts, real-world examples, and a special twist or insight. Avoid generic or repetitive content. Make it creative, informative, and valuable for readers.\n\nTopic: ${prompt}`;
    const ollamaRes = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          { role: 'system', content: 'You are a professional blog writer who always uses the latest information and writes in a unique, engaging style.' },
          { role: 'user', content: ollamaPrompt }
        ],
        max_tokens: 1024,
        temperature: 0.9
      })
    });
    if (ollamaRes.ok) {
      const ollamaData = await ollamaRes.json();
      if (ollamaData.choices && ollamaData.choices[0] && ollamaData.choices[0].message && ollamaData.choices[0].message.content) {
        return res.json({ text: ollamaData.choices[0].message.content });
      }
    } else {
      console.log('Ollama API error:', ollamaRes.status, await ollamaRes.text());
    }
  } catch (e) {
    console.log('Ollama API failed:', e.message);
  }

  // 2. Try Together AI Llama 3.3 70B if key is set
  if (process.env.TOGETHER_API_KEY) {
    try {
      const togetherPrompt = `Write a highly engaging, up-to-date, and unique blog post about the following topic. Use the latest information, include interesting facts, real-world examples, and a special twist or insight. Avoid generic or repetitive content. Make it creative, informative, and valuable for readers.\n\nTopic: ${prompt}`;
      const togetherRes = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
          messages: [
            { role: 'system', content: 'You are a professional blog writer who always uses the latest information and writes in a unique, engaging style.' },
            { role: 'user', content: togetherPrompt }
          ],
          max_tokens: 1024,
          temperature: 0.9
        })
      });
      if (togetherRes.ok) {
        const togetherData = await togetherRes.json();
        if (togetherData.choices && togetherData.choices[0] && togetherData.choices[0].message && togetherData.choices[0].message.content) {
          return res.json({ text: togetherData.choices[0].message.content });
        }
      } else {
        console.log('Together AI API error:', togetherRes.status, await togetherRes.text());
      }
    } catch (e) {
      console.log('Together AI API failed:', e.message);
    }
  }

  // 3. Try FreeGPT API
  try {
    const freeGptPrompt = `Write a highly engaging, up-to-date, and unique blog post about the following topic. Use the latest information, include interesting facts, real-world examples, and a special twist or insight. Avoid generic or repetitive content. Make it creative, informative, and valuable for readers.\n\nTopic: ${prompt}`;
    const gptRes = await fetch('https://api.freegpt.one/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional blog writer who always uses the latest information and writes in a unique, engaging style.' },
          { role: 'user', content: freeGptPrompt }
        ],
        max_tokens: 1024,
        temperature: 0.9
      })
    });
    if (gptRes.ok) {
      const gptData = await gptRes.json();
      if (gptData.choices && gptData.choices[0] && gptData.choices[0].message && gptData.choices[0].message.content) {
        return res.json({ text: gptData.choices[0].message.content });
      }
    } else {
      console.log('FreeGPT API error:', gptRes.status, await gptRes.text());
    }
  } catch (e) {
    console.log('FreeGPT API failed:', e.message);
  }

  // 4. Try Hugging Face as fallback
  try {
    const hf = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_length: 500, temperature: 0.7, do_sample: true }
      })
    });
    if (hf.ok) {
      const data = await hf.json();
      if (data && data[0] && data[0].generated_text) {
        return res.json({ text: data[0].generated_text });
      }
    } else {
      console.log('Hugging Face API error:', hf.status, 'Falling back to local generation');
    }
  } catch (e) {
    console.log('Hugging Face API failed, using fallback:', e.message);
  }

  // 5. Fallback: Generate content locally
  const fallbackContent = generateFallbackContent(prompt);
  res.json({ text: fallbackContent });
});

// Fallback content generation function
function generateFallbackContent(prompt) {
  const subject = prompt.toLowerCase();
  const wordCount = prompt.match(/(\d+)\s*words?/i)?.[1] || 500;
  
  // Simple template-based content generation
  const templates = {
    professional: `# ${prompt.split('"')[1] || 'Professional Blog Post'}

## Introduction
This comprehensive guide explores the key aspects of ${prompt.split('"')[1] || 'this important topic'}. Understanding this subject is crucial for professionals and enthusiasts alike.

## Key Points
1. **Understanding the Basics**: The foundation of ${prompt.split('"')[1] || 'this topic'} lies in its fundamental principles.
2. **Practical Applications**: Real-world applications demonstrate the value and importance of this knowledge.
3. **Best Practices**: Following established guidelines ensures optimal results and outcomes.

## Detailed Analysis
The subject matter encompasses various dimensions that require careful consideration. From theoretical frameworks to practical implementations, each aspect contributes to a comprehensive understanding.

## Conclusion
In conclusion, ${prompt.split('"')[1] || 'this topic'} represents a significant area of study that offers valuable insights and practical benefits. Continued exploration and application of these concepts will lead to improved outcomes and enhanced understanding.`,

    casual: `# ${prompt.split('"')[1] || 'Casual Blog Post'}

Hey there! Let's talk about ${prompt.split('"')[1] || 'something really cool'}. I've been thinking about this a lot lately, and I wanted to share my thoughts with you.

## What's This All About?
So, ${prompt.split('"')[1] || 'this thing'} is pretty interesting, right? It's one of those topics that seems simple at first, but the more you dig into it, the more fascinating it becomes.

## My Take on It
Here's what I think makes ${prompt.split('"')[1] || 'this'} so special:
- It's accessible to everyone
- There's always something new to learn
- It connects to so many other interesting topics

## Wrapping Up
Anyway, that's my two cents on ${prompt.split('"')[1] || 'this topic'}. What do you think? I'd love to hear your thoughts in the comments below!`,

    friendly: `# ${prompt.split('"')[1] || 'Friendly Blog Post'}

Welcome, friends! Today we're going to explore ${prompt.split('"')[1] || 'this wonderful topic'} together. I'm excited to share this journey with you!

## Let's Get Started
${prompt.split('"')[1] || 'This topic'} is something that brings people together and creates meaningful connections. Whether you're new to this or have been exploring it for years, there's always something valuable to discover.

## What Makes This Special
The beauty of ${prompt.split('"')[1] || 'this subject'} lies in its ability to:
- Inspire creativity and innovation
- Build community and understanding
- Provide practical value in everyday life

## Final Thoughts
I hope this exploration of ${prompt.split('"')[1] || 'this topic'} has been helpful and inspiring. Remember, the best learning happens when we share and grow together!`,

    informative: `# ${prompt.split('"')[1] || 'Informative Blog Post'}

## Understanding ${prompt.split('"')[1] || 'This Important Topic'}

This comprehensive guide provides detailed information about ${prompt.split('"')[1] || 'this subject'}, including its history, current applications, and future implications.

## Historical Context
The development of ${prompt.split('"')[1] || 'this field'} has evolved significantly over time, shaped by technological advances and changing societal needs.

## Current State
Today, ${prompt.split('"')[1] || 'this topic'} encompasses various aspects:
- Technical specifications and requirements
- Industry standards and best practices
- Emerging trends and innovations

## Practical Applications
Understanding ${prompt.split('"')[1] || 'this subject'} enables individuals and organizations to:
- Make informed decisions
- Implement effective solutions
- Achieve desired outcomes

## Future Outlook
The future of ${prompt.split('"')[1] || 'this field'} looks promising, with continued innovation and development expected in the coming years.`
  };

  // Determine tone from prompt
  let tone = 'informative';
  if (subject.includes('professional') || subject.includes('business')) tone = 'professional';
  if (subject.includes('casual') || subject.includes('relaxed')) tone = 'casual';
  if (subject.includes('friendly') || subject.includes('warm')) tone = 'friendly';

  return templates[tone] || templates.informative;
}

// --- Image Search ---
app.get('/images', async (req, res) => {
  const { q } = req.query;
  // Try Unsplash
  try {
    const unsplash = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=3&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    if (unsplash.ok) {
      const data = await unsplash.json();
      return res.json({
        images: data.results.map(photo => ({
          url: photo.urls.regular,
          alt: photo.alt_description || q,
          credit: photo.user.name
        }))
      });
    }
  } catch (e) {}
  // Fallback: placeholder
  res.json({
    images: [
      { url: `https://picsum.photos/800/400?random=1&subject=${encodeURIComponent(q)}`, alt: q, credit: 'Placeholder' },
      { url: `https://picsum.photos/800/400?random=2&subject=${encodeURIComponent(q)}`, alt: q, credit: 'Placeholder' }
    ]
  });
});

// --- WordPress Posting ---
app.post('/post', async (req, res) => {
  const { wpUrl, wpUsername, wpPassword, title, content, image, category } = req.body;
  
  console.log('WordPress posting attempt:', {
    wpUrl,
    wpUsername: wpUsername ? '***provided***' : 'missing',
    wpPassword: wpPassword ? '***provided***' : 'missing',
    title: title ? '***provided***' : 'missing',
    contentLength: content ? content.length : 0,
    imageUrl: image && image.url ? image.url : 'none'
  });
  
  try {
    // Only handle self-hosted WordPress for featured image and categories
    const isWordPressCom = wpUrl.includes('wordpress.com');
    let featuredMediaId = null;
    let categoryId = null;
    if (!isWordPressCom && category) {
      // 1. Check if category exists
      const catListResp = await fetch(`${wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/categories?search=${encodeURIComponent(category)}`, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')
        }
      });
      if (catListResp.ok) {
        const catList = await catListResp.json();
        const found = catList.find(cat => cat.name.toLowerCase() === category.toLowerCase());
        if (found) {
          categoryId = found.id;
        }
      }
      // 2. If not found, create it
      if (!categoryId) {
        const catCreateResp = await fetch(`${wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')
          },
          body: JSON.stringify({ name: category })
        });
        if (catCreateResp.ok) {
          const cat = await catCreateResp.json();
          categoryId = cat.id;
        } else {
          const catErr = await catCreateResp.text();
          console.error('Failed to create category:', catErr);
        }
      }
    }
    // Only handle self-hosted WordPress for featured image
    if (!isWordPressCom && image && image.url) {
      // Download the image
      const imgResp = await fetch(image.url);
      if (!imgResp.ok) throw new Error('Failed to download image');
      const imgBuffer = await imgResp.arrayBuffer();
      // Always use jpg for Unsplash and similar sources
      const imgExt = 'jpg';
      const imgMime = 'image/jpeg';
      // Upload to WordPress media
      const mediaResp = await fetch(`${wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Content-Disposition': `attachment; filename="featured.${imgExt}"`,
          'Content-Type': imgMime,
          'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')
        },
        body: Buffer.from(imgBuffer)
      });
      if (mediaResp.ok) {
        const media = await mediaResp.json();
        featuredMediaId = media.id;
        console.log('Uploaded featured image, media ID:', featuredMediaId);
      } else {
        const errText = await mediaResp.text();
        console.error('Failed to upload featured image:', errText);
      }
    }
    // Now create the post
    if (isWordPressCom) {
      console.log('Detected WordPress.com site - using WordPress.com API');
      
      // For WordPress.com, we need to use the WordPress.com REST API
      const wpComApiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${wpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/posts/new`;
      
      console.log('Attempting to post to WordPress.com API:', wpComApiUrl);
      
      // Try OAuth2 token first
      let response = await fetch(wpComApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${wpPassword}` // WordPress.com uses Bearer token
        },
        body: JSON.stringify({
          title,
          content,
          status: 'publish'
        })
      });
      
      console.log('WordPress.com API response status:', response.status);
      
      if (response.ok) {
        const post = await response.json();
        console.log('WordPress.com post successful:', post.URL);
        return res.json({ link: post.URL });
      } else {
        const errorText = await response.text();
        console.error('WordPress.com OAuth2 failed:', response.status, errorText);
        
        // Try alternative method - using username/password in body
        console.log('Trying alternative WordPress.com authentication...');
        
        response = await fetch(wpComApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            content,
            status: 'publish',
            username: wpUsername,
            password: wpPassword
          })
        });
        
        console.log('Alternative WordPress.com API response status:', response.status);
        
        if (response.ok) {
          const post = await response.json();
          console.log('WordPress.com post successful (alternative method):', post.URL);
          return res.json({ link: post.URL });
        } else {
          const errorText2 = await response.text();
          console.error('WordPress.com alternative method failed:', response.status, errorText2);
          return res.status(400).json({ 
            error: `WordPress.com authentication failed. Please check your username and Application Password. Error: ${errorText2}` 
          });
        }
      }
    } else {
      // Self-hosted WordPress site
      const wpApiUrl = `${wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts`;
      console.log('Attempting to post to self-hosted WordPress:', wpApiUrl);
      const postBody = {
        title,
        content,
        status: 'publish',
        format: 'standard'
      };
      if (featuredMediaId) postBody.featured_media = featuredMediaId;
      if (categoryId) postBody.categories = [categoryId];
      let response = await fetch(wpApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')
        },
        body: JSON.stringify(postBody)
      });
      console.log('Self-hosted WordPress API response status:', response.status);
      if (response.ok) {
        let post = await response.json();
        // If the featured image is not set, update the post
        if (featuredMediaId && post.featured_media !== featuredMediaId) {
          const patchUrl = `${wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts/${post.id}`;
          const patchBody = { featured_media: featuredMediaId };
          const patchResp = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')
            },
            body: JSON.stringify(patchBody)
          });
          if (patchResp.ok) {
            post = await patchResp.json();
            console.log('Patched post to set featured image:', post.link);
          } else {
            const patchErr = await patchResp.text();
            console.error('Failed to patch post with featured image:', patchErr);
          }
        }
        console.log('Self-hosted WordPress post successful:', post.link);
        return res.json({ link: post.link });
      } else {
        const errorText = await response.text();
        console.error('Self-hosted WordPress API error:', response.status, errorText);
        return res.status(400).json({ 
          error: `WordPress API error: ${response.status} - ${errorText}` 
        });
      }
    }
  } catch (e) {
    console.error('WordPress posting failed:', e.message);
    res.status(500).json({ 
      error: `WordPress post failed: ${e.message}` 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)); 