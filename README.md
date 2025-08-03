# Surya's News Blog

A modern, responsive news blog website with URL routing for different news categories.

## Features

- **URL Routing**: Each news category has its own URL
- **Responsive Design**: Works on all devices
- **Newsletter Subscription**: Email subscription with frequency preferences
- **Custom Cursor**: Interactive cursor effects
- **Smooth Animations**: Beautiful transitions and effects

## URL Structure

The website supports the following URLs for different news categories:

- **Home/General**: `/` or `/general`
- **Technology**: `/tech` or `/technology`
- **Business**: `/business`
- **Entertainment**: `/entertainment`
- **Sports**: `/sports`
- **Science**: `/science`
- **AI & Machine Learning**: `/ai`, `/ai-ml`, `/artificial-intelligence`, or `/machine-learning`

## How to Use

1. **Direct URL Access**: You can directly visit any category URL (e.g., `yoursite.com/tech`)
2. **Navigation**: Click on category buttons to navigate between sections
3. **Browser Navigation**: Use browser back/forward buttons to navigate
4. **Keyboard Navigation**: Use left/right arrow keys to switch categories

## Technical Details

### URL Routing System
- Uses HTML5 History API for clean URLs
- Server-side routing with `.htaccess` for Apache servers
- Client-side routing with JavaScript
- Automatic URL updates when switching categories
- Browser history support

### Features
- **Visual Feedback**: URL indicator shows current section
- **Page Titles**: Dynamic page titles for each category
- **SEO Friendly**: Each section has its own URL for better SEO
- **Bookmarkable**: Users can bookmark specific category pages

## Setup

1. Upload all files to your web server
2. Ensure `.htaccess` is enabled (Apache server)
3. The website will work immediately

## Browser Support

- Modern browsers with HTML5 History API support
- Fallback for older browsers (will still work, just without URL routing)

## API

The website uses the GNews API for fetching news articles. Make sure to:
- Replace the API key in `script.js` with your own
- Respect API rate limits

## Newsletter System

- EmailJS integration for automatic emails
- Multiple frequency options (daily, weekly, monthly)
- Admin controls for managing subscriptions
- Automatic newsletter scheduling

## Customization

You can easily customize:
- Colors and styling in `style.css`
- API endpoints in `script.js`
- Category names and routes
- Newsletter templates

## Support

For questions or issues, please check the code comments or contact the developer. 
