const Parser = require('rss-parser');
const fs = require('fs');

// Your custom category list
const feeds = [
    { id: 'Bangladesh', url: 'https://www.tbsnews.net/bangladesh/rss.xml', color: '#0288d1', bg: '#e1f5fe', icon: '🇧🇩' },
    { id: 'Economy', url: 'https://www.tbsnews.net/economy/rss.xml', color: '#2e7d32', bg: '#e8f5e9', icon: '📈' },
    { id: 'Health', url: 'https://www.tbsnews.net/bangladesh/health/rss.xml', color: '#c2185b', bg: '#fce4ec', icon: '🏥' },
    { id: 'Market', url: 'https://www.tbsnews.net/markets/rss.xml', color: '#7b1fa2', bg: '#f3e5f5', icon: '📊' },
    { id: 'Education', url: 'https://www.tbsnews.net/bangladesh/education/rss.xml', color: '#e65100', bg: '#fff3e0', icon: '🎓' },
    { id: 'Banking', url: 'https://www.tbsnews.net/economy/banking/rss.xml', color: '#00796b', bg: '#e0f2f1', icon: '🏦' },
    { id: 'Tech', url: 'https://www.tbsnews.net/tech/rss.xml', color: '#1976d2', bg: '#e3f2fd', icon: '💻' },
    { id: 'Thoughts', url: 'https://www.tbsnews.net/thoughts/rss.xml', color: '#455a64', bg: '#eceff1', icon: '💭' },
    { id: 'Industry', url: 'https://www.tbsnews.net/economy/industry/rss.xml', color: '#f57c00', bg: '#fff3e0', icon: '🏭' },
    { id: 'Analysis', url: 'https://www.tbsnews.net/analysis/rss.xml', color: '#5d4037', bg: '#efebe9', icon: '🔍' }
];

async function fetchAllNews() {
    const parser = new Parser();
    let allNews = [];

    // Loop through every feed in your list
    for (const feed of feeds) {
        try {
            const parsedFeed = await parser.parseURL(feed.url);
            
            // Format the items and attach your custom colors/icons to each article
            const items = parsedFeed.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate || item.isoDate,
                category: feed.id,
                color: feed.color,
                bg: feed.bg,
                icon: feed.icon
            }));
            
            // Add these items to our master list
            allNews = allNews.concat(items);
        } catch (error) {
            console.error(`Error fetching ${feed.id}:`, error.message);
        }
    }

    // Sort the master list by date (newest first)
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const output = {
        news: allNews,
        updatedAt: new Date().toISOString()
    };

    fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
}

fetchAllNews();
