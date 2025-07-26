const BACKEND_URL = 'http://localhost:3001'; // Change if backend is hosted elsewhere

class AutoBlogCreator {
    constructor() {
        this.form = document.getElementById('blogForm');
        this.loading = document.getElementById('loading');
        this.previewSection = document.getElementById('previewSection');
        this.previewContent = document.getElementById('previewContent');
        this.steps = {
            step1: document.getElementById('step1'),
            step2: document.getElementById('step2'),
            step3: document.getElementById('step3'),
            step4: document.getElementById('step4')
        };
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('editBtn').addEventListener('click', () => this.editContent());
        document.getElementById('postBtn').addEventListener('click', () => this.postToWordPress());
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        let data = {
            subject: formData.get('subject'),
            tone: formData.get('tone'),
            wordCount: formData.get('wordCount'),
            category: formData.get('category'),
            wpUrl: formData.get('wpUrl'),
            wpUsername: formData.get('wpUsername'),
            wpPassword: formData.get('wpPassword')
        };

        // Use saved credentials from config if form fields are empty
        if (!data.wpUrl && window.CONFIG && window.CONFIG.WORDPRESS && window.CONFIG.WORDPRESS.SITE_URL) {
            data.wpUrl = window.CONFIG.WORDPRESS.SITE_URL;
        }
        if (!data.wpUsername && window.CONFIG && window.CONFIG.WORDPRESS && window.CONFIG.WORDPRESS.USERNAME) {
            data.wpUsername = window.CONFIG.WORDPRESS.USERNAME;
        }
        if (!data.wpPassword && window.CONFIG && window.CONFIG.WORDPRESS && window.CONFIG.WORDPRESS.PASSWORD) {
            data.wpPassword = window.CONFIG.WORDPRESS.PASSWORD;
        }

        this.showLoading();
        this.updateStep(1, 'active');

        try {
            // Step 1: Generate content
            const content = await this.generateContent(data.subject, data.tone, data.wordCount);
            this.updateStep(1, 'completed');
            this.updateStep(2, 'active');

            // Step 2: Find one image
            const image = await this.findImages(data.subject);
            this.updateStep(2, 'completed');
            this.updateStep(3, 'active');

            // Step 3: Format content
            const formattedContent = this.formatContent(content, image);
            this.updateStep(3, 'completed');

            // Store data for WordPress posting
            this.blogData = {
                ...data,
                content: formattedContent,
                image: image // Only one image
            };

            this.hideLoading();
            this.showPreview(formattedContent);

        } catch (error) {
            this.hideLoading();
            this.showError('Error generating blog: ' + error.message);
        }
    }

    async generateContent(subject, tone, wordCount) {
        const prompt = `Write a ${tone} blog post about "${subject}" with approximately ${wordCount} words. \nInclude an engaging introduction, main points with examples, and a conclusion. \nMake it informative and well-structured.`;
        try {
            const response = await fetch(`${BACKEND_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            if (response.ok) {
                const data = await response.json();
                return data.text;
            }
        } catch (error) {
            console.log('Backend content generation failed', error);
        }
        return this.generateFallbackContent(subject, tone, wordCount);
    }

    async findImages(subject) {
        try {
            const response = await fetch(`${BACKEND_URL}/images?q=${encodeURIComponent(subject)}`);
            if (response.ok) {
                const data = await response.json();
                // Only use the first image
                return data.images && data.images.length > 0 ? data.images[0] : null;
            }
        } catch (error) {
            console.log('Backend image search failed', error);
        }
        // fallback
        return { url: `https://picsum.photos/800/400?random=1&subject=${encodeURIComponent(subject)}`, alt: subject, credit: 'Placeholder' };
    }

    formatContent(content, image) {
        let html = content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/gm, '<p>$1</p>');
        html = html.replace(/<p><\/p>/g, '');
        if (image) {
            html = html.replace('</p>', `</p><div class="blog-image"><img src="${image.url}" alt="${image.alt}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"><p class="image-credit" style="font-size: 12px; color: #666; text-align: center; margin-top: 5px;">Photo by ${image.credit}</p></div>`);
        }
        return html;
    }

    showPreview(content) {
        this.previewContent.innerHTML = content;
        this.previewSection.style.display = 'block';
        this.previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    editContent() {
        this.previewContent.contentEditable = true;
        this.previewContent.focus();
        this.previewContent.style.border = '2px solid #667eea';
        this.previewContent.style.padding = '20px';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.onclick = () => this.saveContent();
        this.previewContent.appendChild(saveBtn);
    }

    saveContent() {
        this.previewContent.contentEditable = false;
        this.previewContent.style.border = '';
        this.previewContent.style.padding = '';
        const saveBtn = this.previewContent.querySelector('button');
        if (saveBtn) saveBtn.remove();
        this.blogData.content = this.previewContent.innerHTML;
        this.showMessage('Content saved successfully!', 'success');
    }

    async postToWordPress() {
        this.updateStep(4, 'active');
        try {
            const response = await fetch(`${BACKEND_URL}/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wpUrl: this.blogData.wpUrl,
                    wpUsername: this.blogData.wpUsername,
                    wpPassword: this.blogData.wpPassword,
                    title: this.blogData.subject,
                    content: this.blogData.content,
                    image: this.blogData.image,
                    category: this.blogData.category // Send category to backend
                })
            });
            if (response.ok) {
                const data = await response.json();
                this.updateStep(4, 'completed');
                this.showMessage(`Blog post published successfully! View it at: ${data.link}`, 'success');
                this.form.reset();
                localStorage.removeItem('blogFormData');
            } else {
                const err = await response.json();
                throw new Error(err.error || 'Failed to post');
            }
        } catch (error) {
            this.showMessage('Error posting to WordPress: ' + error.message, 'error');
        }
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.previewSection.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    updateStep(stepNumber, status) {
        const step = this.steps[`step${stepNumber}`];
        if (step) {
            step.className = `step ${status}`;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        this.previewSection.insertBefore(messageDiv, this.previewSection.firstChild);
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AutoBlogCreator();
    
    // Pre-fill WordPress URL from config if available
    if (window.CONFIG && window.CONFIG.WORDPRESS && window.CONFIG.WORDPRESS.SITE_URL) {
        const wpUrlField = document.getElementById('wpUrl');
        if (wpUrlField) {
            wpUrlField.value = window.CONFIG.WORDPRESS.SITE_URL;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('blogForm');
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            localStorage.setItem('blogFormData', JSON.stringify(data));
        });
    });
    const savedData = localStorage.getItem('blogFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = data[key];
        });
    }
    const subjectInput = document.getElementById('subject');
    const wordCountDisplay = document.createElement('div');
    wordCountDisplay.className = 'word-count';
    wordCountDisplay.style.cssText = 'font-size: 12px; color: #666; margin-top: 5px;';
    subjectInput.parentNode.appendChild(wordCountDisplay);
    subjectInput.addEventListener('input', () => {
        const words = subjectInput.value.trim().split(/\s+/).filter(word => word.length > 0);
        wordCountDisplay.textContent = `${words.length} words`;
    });
    const charCountDisplay = document.createElement('div');
    charCountDisplay.className = 'char-count';
    charCountDisplay.style.cssText = 'font-size: 12px; color: #666; margin-top: 2px;';
    subjectInput.parentNode.appendChild(charCountDisplay);
    subjectInput.addEventListener('input', () => {
        const chars = subjectInput.value.length;
        charCountDisplay.textContent = `${chars} characters`;
    });
    const tips = [
        'Try being specific with your topic for better content generation',
        'Use application passwords for better WordPress security',
        'Preview your content before posting to WordPress',
        'The app works offline for content generation'
    ];
    const tipElement = document.createElement('div');
    tipElement.className = 'tip';
    tipElement.style.cssText = 'background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 15px; margin: 20px 0; color: #0066cc; font-size: 14px;';
    tipElement.innerHTML = `<strong>💡 Tip:</strong> ${tips[Math.floor(Math.random() * tips.length)]}`;
    form.parentNode.insertBefore(tipElement, form);
}); 