const API_KEY = '60d5df70a6d768be30695e939e2c581b';
let currentCategory = 'general';
const newsList = document.getElementById('news-list');

// URL Routing System
const ROUTES = {
    '/': 'general',
    '/general': 'general',
    '/tech': 'technology',
    '/technology': 'technology',
    '/business': 'business',
    '/entertainment': 'entertainment',
    '/sports': 'sports',
    '/science': 'science',
    '/ai': 'ai',
    '/ai-ml': 'ai',
    '/artificial-intelligence': 'ai',
    '/machine-learning': 'ai'
};

// Initialize URL routing
function initURLRouting() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        const path = window.location.pathname;
        const category = ROUTES[path] || 'general';
        loadCategoryNews(category, false); // false = don't update URL
    });
    
    // Handle initial page load
    const path = window.location.pathname;
    const category = ROUTES[path] || 'general';
    currentCategory = category;
    
    // Update active button based on URL
    updateActiveButton(category);
    
    // Load news for the category from URL
    loadCategoryNews(category, false);
}

// Update URL without triggering navigation
function updateURL(category) {
    const path = Object.keys(ROUTES).find(key => ROUTES[key] === category) || '/';
    const url = window.location.origin + path;
    
    // Update URL without reloading the page
    window.history.pushState({ category }, '', url);
    
    // Update page title
    const categoryNames = {
        'general': 'General News',
        'technology': 'Technology News',
        'business': 'Business News',
        'entertainment': 'Entertainment News',
        'sports': 'Sports News',
        'science': 'Science News',
        'ai': 'AI & Machine Learning News'
    };
    
    document.title = `${categoryNames[category]} - Surya's News Blog`;
}

// Initialize EmailJS (you'll need to replace these with your actual EmailJS credentials)
function initEmailJS() {
    // Replace these with your actual EmailJS credentials
    // Get these from: https://www.emailjs.com/
    emailjs.init("6WnyQx490uiet6W_4"); // Your EmailJS User ID
    
    console.log('📧 EmailJS initialized with User ID: 6WnyQx490uiet6W_4');
    console.log('🔧 Service ID: service_d77q2g8');
    console.log('📝 Welcome Template ID: template_yeq6rnh');
    console.log('📝 Newsletter Template ID: template_byuctf4');
    
    // Test EmailJS connection
    testEmailJSConnection();
}

// Test EmailJS connection
async function testEmailJSConnection() {
    try {
        console.log('🧪 Testing EmailJS connection...');
        // This will help verify if EmailJS is properly configured
        const testParams = {
            to_email: 'test@example.com',
            to_name: 'Test User',
            from_name: "Surya's News Blog",
            message: 'Test message',
            subject: 'Test Email'
        };
        
        // Note: This won't actually send an email, just test the connection
        console.log('✅ EmailJS connection test completed');
    } catch (error) {
        console.error('❌ EmailJS connection test failed:', error);
    }
}

// Test welcome email function (you can call this from browser console)
async function testWelcomeEmail(testEmail = 'your-test-email@example.com') {
    try {
        console.log('🧪 Testing welcome email to:', testEmail);
        const result = await sendWelcomeEmail(testEmail);
        if (result) {
            console.log('✅ Welcome email test successful!');
            alert('✅ Welcome email test successful! Check your inbox.');
        } else {
            console.log('❌ Welcome email test failed!');
            alert('❌ Welcome email test failed! Check console for details.');
        }
    } catch (error) {
        console.error('❌ Welcome email test error:', error);
        alert('❌ Welcome email test error! Check console for details.');
    }
}

// Function to view all subscribers and their preferences
function viewSubscribers() {
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    console.log('📧 All Subscribers:', subscribers);
    
    if (subscribers.length === 0) {
        alert('No subscribers found.');
        return;
    }
    
    const subscriberList = subscribers.map(sub => 
        `${sub.email} (${sub.frequency}) - ${new Date(sub.subscribedAt).toLocaleDateString()}`
    ).join('\n');
    
    alert(`📧 Subscribers (${subscribers.length}):\n\n${subscriberList}`);
}

// Function to clear all subscribers (for testing)
function clearSubscribers() {
    if (confirm('Are you sure you want to clear all subscribers? This cannot be undone.')) {
        localStorage.removeItem('newsletter_subscribers');
        alert('✅ All subscribers cleared!');
        console.log('🗑️ All subscribers cleared');
    }
}

function getEndpoint(category) {
    // For AI category, we'll use a custom search query since GNews doesn't have a specific AI category
    if (category === 'ai') {
        return `https://gnews.io/api/v4/search?q=artificial intelligence OR machine learning OR AI OR deep learning&lang=en&country=us&max=10&apikey=${API_KEY}`;
    }
    return `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${API_KEY}`;
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor position immediately
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateCursor() {
        // Smooth cursor follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor effects on hover
    const interactiveElements = document.querySelectorAll('.category-btn, .news-card, .social-link, .news-title, .subscribe-btn, #emailInput, .admin-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Glitch Effect
function initGlitchEffect() {
    const glitchText = document.querySelector('.glitch-text');
    if (!glitchText) return;
    
    glitchText.setAttribute('data-text', glitchText.textContent);
    
    // Random glitch intervals
    setInterval(() => {
        glitchText.style.animation = 'none';
        setTimeout(() => {
            glitchText.style.animation = 'glitch 0.3s ease-in-out';
        }, 10);
    }, 3000);
}

// Ripple Effect for Buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.category-btn, .social-link, .subscribe-btn, .admin-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple CSS dynamically
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Send Welcome Email using EmailJS
async function sendWelcomeEmail(email) {
    try {
        console.log('🔄 Attempting to send welcome email to:', email);
        
        // EmailJS template uses {{email}} parameter (not to_email)
        const templateParams = {
            email: email,  // This matches your template's {{email}} field
            to_name: email.split('@')[0], // Use email prefix as name
            from_name: "Surya's News Blog",
            message: "Welcome to our newsletter! You'll now receive the latest news updates directly in your inbox.",
            subject: "Welcome to Surya's News Blog Newsletter!"
        };

        console.log('📧 EmailJS Template Parameters:', templateParams);

        // Send welcome email
        const result = await emailjs.send(
            'service_d77q2g8', // Your EmailJS Service ID
            'template_yeq6rnh', // Welcome email template ID
            templateParams
        );

        console.log('✅ Welcome email sent successfully to:', email);
        console.log('📨 EmailJS Response:', result);
        return true;
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            status: error.status,
            text: error.text
        });
        
        // Additional debugging for EmailJS errors
        if (error.status === 422) {
            console.error('🚨 422 Error - This usually means:');
            console.error('   1. Template "To" field is not configured with {{to_email}}');
            console.error('   2. Template parameter name mismatch');
            console.error('   3. Template is not properly saved');
            console.error('   Please check your EmailJS template configuration!');
        }
        
        return false;
    }
}

// Test function to try different parameter names
async function testEmailJSParameters(testEmail = 'studysurya583@gmail.com') {
    console.log('🧪 Testing different EmailJS parameter names...');
    
    const parameterSets = [
        { name: 'to_email', params: { to_email: testEmail, to_name: testEmail.split('@')[0], from_name: "Surya's News Blog", message: "Test message", subject: "Test Subject" } },
        { name: 'email', params: { email: testEmail, to_name: testEmail.split('@')[0], from_name: "Surya's News Blog", message: "Test message", subject: "Test Subject" } },
        { name: 'recipient_email', params: { recipient_email: testEmail, to_name: testEmail.split('@')[0], from_name: "Surya's News Blog", message: "Test message", subject: "Test Subject" } },
        { name: 'user_email', params: { user_email: testEmail, to_name: testEmail.split('@')[0], from_name: "Surya's News Blog", message: "Test message", subject: "Test Subject" } }
    ];
    
    for (const paramSet of parameterSets) {
        try {
            console.log(`\n🔄 Testing parameter name: ${paramSet.name}`);
            console.log('📧 Parameters:', paramSet.params);
            
            const result = await emailjs.send(
                'service_d77q2g8',
                'template_yeq6rnh',
                paramSet.params
            );
            
            console.log(`✅ SUCCESS with parameter: ${paramSet.name}`);
            console.log('📨 Response:', result);
            return paramSet.name; // Return the working parameter name
            
        } catch (error) {
            console.log(`❌ FAILED with parameter: ${paramSet.name}`);
            console.log('Error:', error.text || error.message);
        }
    }
    
    console.log('\n❌ All parameter names failed. Please check your EmailJS template configuration.');
    return null;
}

// Quick test function you can run in browser console
function quickTest() {
    console.log('🚀 Quick EmailJS Test');
    console.log('Run this in your browser console: testEmailJSParameters()');
    console.log('This will test different parameter names to find the correct one.');
}

// Send Newsletter to All Subscribers
async function sendNewsletterToSubscribers(newsletterContent) {
    try {
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        
        if (subscribers.length === 0) {
            console.log('No subscribers to send newsletter to');
            return;
        }

        console.log(`Sending newsletter to ${subscribers.length} subscribers...`);

        for (const subscriber of subscribers) {
            try {
                const templateParams = {
                    email: subscriber.email,  // Changed to match template's {{email}} field
                    to_name: subscriber.email.split('@')[0],
                    from_name: "Surya's News Blog",
                    subject: "Latest News from Surya's Blog",
                    newsletter_content: newsletterContent,
                    unsubscribe_link: `mailto:your-email@domain.com?subject=Unsubscribe&body=Please unsubscribe me from the newsletter.`
                };

                await emailjs.send(
                    'service_d77q2g8', // Your EmailJS Service ID
                    'template_byuctf4', // Daily newsletter template ID
                    templateParams
                );

                console.log(`Newsletter sent to: ${subscriber.email} (${subscriber.frequency})`);
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
            }
        }

        console.log('Newsletter sending completed!');
    } catch (error) {
        console.error('Newsletter sending failed:', error);
    }
}

// Subscription Form Handling
function initSubscriptionForm() {
    const form = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.getElementById('formMessage');
    const subscribeBtn = document.querySelector('.subscribe-btn');
    
    if (!form || !emailInput || !formMessage) return;
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show message function
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            showMessage('Please enter your email address', 'error');
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        // Show loading state
        const originalText = subscribeBtn.querySelector('.btn-text').textContent;
        const originalIcon = subscribeBtn.querySelector('.btn-icon').textContent;
        
        subscribeBtn.querySelector('.btn-text').textContent = 'Subscribing...';
        subscribeBtn.querySelector('.btn-icon').textContent = '⏳';
        subscribeBtn.disabled = true;
        
        try {
            // Get selected frequency
            const selectedFrequency = document.querySelector('input[name="frequency"]:checked').value;
            
            // Store email and frequency in localStorage
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            
            // Check if email already exists
            const existingSubscriber = subscribers.find(sub => sub.email === email);
            if (existingSubscriber) {
                showMessage('You are already subscribed!', 'error');
                return;
            }
            
            // Add new subscriber with frequency preference
            subscribers.push({
                email: email,
                frequency: selectedFrequency,
                subscribedAt: new Date().toISOString()
            });
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            
            // Send welcome email
            const emailSent = await sendWelcomeEmail(email);
            
            if (emailSent) {
                showMessage('🎉 Successfully subscribed! Welcome email sent to your inbox.', 'success');
            } else {
                showMessage('✅ Subscribed! Welcome email will be sent shortly.', 'success');
            }
            
            emailInput.value = '';
            
            // Log subscription
            console.log('New subscriber:', email);
            console.log('Frequency preference:', selectedFrequency);
            console.log('Total subscribers:', subscribers.length);
            
        } catch (error) {
            showMessage('❌ Something went wrong. Please try again.', 'error');
            console.error('Subscription error:', error);
        } finally {
            // Reset button state
            subscribeBtn.querySelector('.btn-text').textContent = originalText;
            subscribeBtn.querySelector('.btn-icon').textContent = originalIcon;
            subscribeBtn.disabled = false;
        }
    });
    
    // Real-time validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email && !isValidEmail(email)) {
            this.style.borderColor = '#f87171';
        } else {
            this.style.borderColor = '';
        }
        
        // Clear message when user starts typing
        if (formMessage.textContent) {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }
    });
    
    // Focus effects
    emailInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    emailInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

// Function to manually send newsletter (you can call this from console or add a button)
function sendNewsletter() {
    const newsletterContent = `
        <h2>Latest News from Surya's Blog</h2>
        <p>Here are the latest headlines from our blog:</p>
        <ul>
            <li>Breaking news and updates</li>
            <li>Technology trends</li>
            <li>Business insights</li>
            <li>Entertainment highlights</li>
        </ul>
        <p>Stay tuned for more updates!</p>
    `;
    
    sendNewsletterToSubscribers(newsletterContent);
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';

    if (article.image) {
        const img = document.createElement('img');
        img.src = article.image;
        img.alt = article.title;
        img.className = 'news-image';
        card.appendChild(img);
    }

    const content = document.createElement('div');
    content.className = 'news-content';

    const title = document.createElement('a');
    title.href = article.url;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    title.className = 'news-title';
    title.textContent = article.title;
    content.appendChild(title);

    if (article.description) {
        const desc = document.createElement('div');
        desc.className = 'news-desc';
        desc.textContent = article.description;
        content.appendChild(desc);
    }

    const meta = document.createElement('div');
    meta.className = 'news-meta';
    meta.textContent = `Source: ${article.source.name || article.source.title || 'Unknown'} | ${new Date(article.publishedAt).toLocaleString()}`;
    content.appendChild(meta);

    card.appendChild(content);
    return card;
}

async function fetchNews(category = currentCategory) {
    try {
        const endpoint = getEndpoint(category);
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        if (!data.articles) throw new Error('API error');
        return data.articles;
    } catch (err) {
        throw err;
    }
}

function showLoader() {
    newsList.innerHTML = '<div class="loader">Loading news...</div>';
}

function showError(message) {
    newsList.innerHTML = `<div class="loader" style="color:#e57373;">${message}</div>`;
}

function showNews(articles) {
    if (!articles.length) {
        newsList.innerHTML = '<div class="loader">No news found.</div>';
        return;
    }
    newsList.innerHTML = '';
    
    // Add staggered animation to cards
    articles.forEach((article, index) => {
        const card = createNewsCard(article);
        card.style.animationDelay = `${index * 0.1}s`;
        newsList.appendChild(card);
        
        // Trigger animation after a small delay
        setTimeout(() => {
            card.classList.add('animate');
        }, 100);
    });
    
    // Add scroll animations after cards are loaded
    setTimeout(() => {
        initScrollAnimations();
    }, 500);
}

function updateActiveButton(selectedCategory) {
    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button with animation
    const activeBtn = document.querySelector(`[data-category="${selectedCategory}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        // Add a subtle bounce effect
        activeBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            activeBtn.style.transform = '';
        }, 200);
        
        // Add URL indicator
        showURLIndicator(selectedCategory);
        
        // Add AI section class for special styling
        const mainElement = document.querySelector('main');
        if (selectedCategory === 'ai') {
            mainElement.classList.add('ai-section');
        } else {
            mainElement.classList.remove('ai-section');
        }
    }
}

// Show URL change indicator
function showURLIndicator(category) {
    const categoryNames = {
        'general': 'General News',
        'technology': 'Technology News',
        'business': 'Business News',
        'entertainment': 'Entertainment News',
        'sports': 'Sports News',
        'science': 'Science News',
        'ai': 'AI & Machine Learning News'
    };
    
    // Create or update URL indicator
    let indicator = document.getElementById('url-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'url-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = `📍 ${categoryNames[category]}`;
    indicator.classList.add('show');
    
    // Hide indicator after 3 seconds
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 3000);
}

async function loadCategoryNews(category, updateURL = true) {
    currentCategory = category;
    updateActiveButton(category);
    
    // Add loading animation
    showLoader();
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
        const articles = await fetchNews(category);
        showNews(articles);
        if (updateURL) {
            updateURL(category);
        }
    } catch (err) {
        showError('Could not load news. Please try again later.');
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all news cards
    document.querySelectorAll('.news-card').forEach(card => {
        observer.observe(card);
    });
}

// Add smooth scroll behavior for category buttons
function addSmoothScroll() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Smooth scroll to news section
            const newsSection = document.querySelector('main');
            newsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Add hover effects for better interactivity
function addHoverEffects() {
    // Add ripple effect to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', x + 'px');
            this.style.setProperty('--y', y + 'px');
        });
    });
}

// Add keyboard navigation
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const activeBtn = document.querySelector('.category-btn.active');
        const buttons = Array.from(document.querySelectorAll('.category-btn'));
        const currentIndex = buttons.indexOf(activeBtn);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            buttons[currentIndex - 1].click();
        } else if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
            buttons[currentIndex + 1].click();
        }
    });
}

// Add loading animation for images
function addImageLoadingEffects() {
    document.addEventListener('DOMContentLoaded', () => {
        const images = document.querySelectorAll('.news-image');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
            
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
    });
}

// Initialize all advanced features
function initAdvancedFeatures() {
    initEmailJS(); // Initialize EmailJS
    initCustomCursor();
    initGlitchEffect();
    addRippleEffect();
    initSubscriptionForm();
    addSmoothScroll();
    addHoverEffects();
    addKeyboardNavigation();
    addImageLoadingEffects();
    initAdminButton(); // Initialize admin newsletter button
    initAutomaticNewsletters(); // Initialize automatic newsletter scheduling
    initURLRouting(); // Initialize URL routing
}

// Initialize Admin Newsletter Button
function initAdminButton() {
    const adminBtn = document.getElementById('sendNewsletterBtn');
    if (!adminBtn) return;
    
    adminBtn.addEventListener('click', async function() {
        const originalText = this.textContent;
        this.textContent = '📧 Sending Newsletter...';
        this.disabled = true;
        
        try {
            await sendNewsletter();
            alert('✅ Newsletter sent successfully to all subscribers!');
        } catch (error) {
            alert('❌ Failed to send newsletter. Check console for details.');
            console.error('Newsletter sending error:', error);
        } finally {
            this.textContent = originalText;
            this.disabled = false;
        }
    });
    
    // Initialize admin controls for automatic newsletters
    initAdminControls();
}

// Initialize Admin Controls for Automatic Newsletters
function initAdminControls() {
    // Enable Daily Newsletters
    const enableDailyBtn = document.getElementById('enableDailyBtn');
    if (enableDailyBtn) {
        enableDailyBtn.addEventListener('click', () => {
            enableAutomaticNewsletters('daily');
            alert('✅ Daily automatic newsletters enabled!');
        });
    }
    
    // Enable Weekly Newsletters
    const enableWeeklyBtn = document.getElementById('enableWeeklyBtn');
    if (enableWeeklyBtn) {
        enableWeeklyBtn.addEventListener('click', () => {
            enableAutomaticNewsletters('weekly');
            alert('✅ Weekly automatic newsletters enabled!');
        });
    }
    
    // Enable Monthly Newsletters
    const enableMonthlyBtn = document.getElementById('enableMonthlyBtn');
    if (enableMonthlyBtn) {
        enableMonthlyBtn.addEventListener('click', () => {
            enableAutomaticNewsletters('monthly');
            alert('✅ Monthly automatic newsletters enabled!');
        });
    }
    
    // Disable Automatic Newsletters
    const disableAutoBtn = document.getElementById('disableAutoBtn');
    if (disableAutoBtn) {
        disableAutoBtn.addEventListener('click', () => {
            disableAutomaticNewsletters();
            alert('❌ Automatic newsletters disabled!');
        });
    }
    
    // Check Newsletter Settings
    const checkSettingsBtn = document.getElementById('checkSettingsBtn');
    if (checkSettingsBtn) {
        checkSettingsBtn.addEventListener('click', () => {
            const settings = getNewsletterSettings();
            const lastSent = settings.lastSent ? new Date(settings.lastSent).toLocaleString() : 'Never';
            
            const frequencyText = Object.entries(settings.frequencyStats)
                .map(([freq, count]) => `${freq}: ${count}`)
                .join(', ');
            
            alert(`📊 Newsletter Settings:
            
✅ Enabled: ${settings.enabled ? 'Yes' : 'No'}
📅 Interval: ${settings.interval}
📧 Total Subscribers: ${settings.totalSubscribers}
📅 Frequency Preferences: ${frequencyText || 'None'}
📅 Last Sent: ${lastSent}`);
        });
    }
}

// Automatic Newsletter Scheduling
function initAutomaticNewsletters() {
    // Check if automatic newsletters are enabled
    const autoNewsletterEnabled = localStorage.getItem('auto_newsletter_enabled') === 'true';
    const autoNewsletterInterval = localStorage.getItem('auto_newsletter_interval') || 'weekly'; // daily, weekly, monthly
    
    if (!autoNewsletterEnabled) return;
    
    // Get last newsletter sent date
    const lastNewsletterDate = localStorage.getItem('last_newsletter_date');
    const now = new Date();
    
    // Check if it's time to send newsletter
    if (shouldSendNewsletter(lastNewsletterDate, autoNewsletterInterval, now)) {
        console.log('🕐 Time to send automatic newsletter!');
        sendAutomaticNewsletter();
    }
    
    // Set up daily check for newsletter sending
    setInterval(() => {
        const currentTime = new Date();
        if (shouldSendNewsletter(lastNewsletterDate, autoNewsletterInterval, currentTime)) {
            console.log('🕐 Time to send automatic newsletter!');
            sendAutomaticNewsletter();
        }
    }, 24 * 60 * 60 * 1000); // Check every 24 hours
}

// Check if newsletter should be sent based on interval
function shouldSendNewsletter(lastDate, interval, currentDate) {
    if (!lastDate) return true; // First time sending
    
    const last = new Date(lastDate);
    const diffInHours = (currentDate - last) / (1000 * 60 * 60);
    
    switch (interval) {
        case 'daily':
            return diffInHours >= 24;
        case 'weekly':
            return diffInHours >= 168; // 7 days
        case 'monthly':
            return diffInHours >= 720; // 30 days
        default:
            return false;
    }
}

// Send automatic newsletter with latest news
async function sendAutomaticNewsletter() {
    try {
        // Fetch latest news for the newsletter
        const latestNews = await fetchLatestNewsForNewsletter();
        
        const newsletterContent = `
            <h2>📰 Latest News from Surya's Blog</h2>
            <p>Here are the latest headlines from our blog:</p>
            ${latestNews}
            <p>Stay tuned for more updates!</p>
        `;
        
        await sendNewsletterToSubscribers(newsletterContent);
        
        // Update last newsletter date
        localStorage.setItem('last_newsletter_date', new Date().toISOString());
        
        console.log('✅ Automatic newsletter sent successfully!');
    } catch (error) {
        console.error('❌ Failed to send automatic newsletter:', error);
    }
}

// Fetch latest news for newsletter content
async function fetchLatestNewsForNewsletter() {
    try {
        const articles = await fetchNews('general');
        const topArticles = articles.slice(0, 5); // Get top 5 articles
        
        let newsHTML = '<ul>';
        topArticles.forEach(article => {
            newsHTML += `
                <li>
                    <strong>${article.title}</strong><br>
                    <small>${article.description ? article.description.substring(0, 100) + '...' : 'No description available'}</small>
                </li>
            `;
        });
        newsHTML += '</ul>';
        
        return newsHTML;
    } catch (error) {
        console.error('Failed to fetch news for newsletter:', error);
        return '<p>Latest news updates from our blog</p>';
    }
}

// Admin functions to control automatic newsletters
function enableAutomaticNewsletters(interval = 'weekly') {
    localStorage.setItem('auto_newsletter_enabled', 'true');
    localStorage.setItem('auto_newsletter_interval', interval);
    console.log(`✅ Automatic newsletters enabled (${interval})`);
    
    // Start the automatic system
    initAutomaticNewsletters();
}

function disableAutomaticNewsletters() {
    localStorage.setItem('auto_newsletter_enabled', 'false');
    console.log('❌ Automatic newsletters disabled');
}

function getNewsletterSettings() {
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    const frequencyStats = subscribers.reduce((stats, sub) => {
        stats[sub.frequency] = (stats[sub.frequency] || 0) + 1;
        return stats;
    }, {});
    
    return {
        enabled: localStorage.getItem('auto_newsletter_enabled') === 'true',
        interval: localStorage.getItem('auto_newsletter_interval') || 'weekly',
        lastSent: localStorage.getItem('last_newsletter_date'),
        totalSubscribers: subscribers.length,
        frequencyStats: frequencyStats
    };
}

// Event listeners for category buttons
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize advanced features
    initAdvancedFeatures();
    
    // Add click event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            loadCategoryNews(category, true); // true = update URL
        });
    });
    
    // URL routing will handle initial news loading
    // No need to load news here as initURLRouting() will do it
}); 
