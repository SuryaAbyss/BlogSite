const API_KEY = '60d5df70a6d768be30695e939e2c581b';
let currentCategory = 'general';
const newsList = document.getElementById('news-list');

function getEndpoint(category) {
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
    const interactiveElements = document.querySelectorAll('.category-btn, .news-card, .social-link, .news-title');
    
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
    const buttons = document.querySelectorAll('.category-btn, .social-link');
    
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
    }
}

async function loadCategoryNews(category) {
    currentCategory = category;
    updateActiveButton(category);
    
    // Add loading animation
    showLoader();
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
        const articles = await fetchNews(category);
        showNews(articles);
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
    initCustomCursor();
    initGlitchEffect();
    addRippleEffect();
    addSmoothScroll();
    addHoverEffects();
    addKeyboardNavigation();
    addImageLoadingEffects();
}

// Event listeners for category buttons
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize advanced features
    initAdvancedFeatures();
    
    // Add click event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            loadCategoryNews(category);
        });
    });
    
    // Load initial news
    showLoader();
    try {
        const articles = await fetchNews();
        showNews(articles);
    } catch (err) {
        showError('Could not load news. Please try again later.');
    }
}); 
