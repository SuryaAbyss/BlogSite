const API_KEY = '60d5df70a6d768be30695e939e2c581b';
const CATEGORY = 'general';
const ENDPOINT = `https://gnews.io/api/v4/top-headlines?category=${CATEGORY}&lang=en&country=us&max=10&apikey=${API_KEY}`;

const newsList = document.getElementById('news-list');

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

async function fetchNews() {
    try {
        const res = await fetch(ENDPOINT);
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

document.addEventListener('DOMContentLoaded', async () => {
    showLoader();
    try {
        const articles = await fetchNews();
        showNews(articles);
    } catch (err) {
        showError('Could not load news. Please try again later.');
    }
}); 