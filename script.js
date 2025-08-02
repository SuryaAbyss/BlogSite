const API_KEY = '60d5df70a6d768be30695e939e2c581b';
let currentCategory = 'general';
const newsList = document.getElementById('news-list');

function getEndpoint(category) {
    return `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${API_KEY}`;
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
    articles.forEach(article => {
        newsList.appendChild(createNewsCard(article));
    });
}

function updateActiveButton(selectedCategory) {
    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const activeBtn = document.querySelector(`[data-category="${selectedCategory}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

async function loadCategoryNews(category) {
    currentCategory = category;
    updateActiveButton(category);
    showLoader();
    
    try {
        const articles = await fetchNews(category);
        showNews(articles);
    } catch (err) {
        showError('Could not load news. Please try again later.');
    }
}

// Event listeners for category buttons
document.addEventListener('DOMContentLoaded', async () => {
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
