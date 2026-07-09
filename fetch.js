const Parser = require('rss-parser');
const fs = require('fs');

// We configure the parser to look for hidden media tags
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['content:encoded', 'contentEncoded']
        ]
    }
});

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
    let allNews = [];

    for (const feed of feeds) {
        try {
            const parsedFeed = await parser.parseURL(feed.url);
            
            const items = parsedFeed.items.map(item => {
                let imageUrl = null;

                // Hunt 1: Check standard enclosure
                if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                } 
                // Hunt 2: Check media:content
                else if (item.mediaContent && item.mediaContent['$'] && item.mediaContent['$'].url) {
                    imageUrl = item.mediaContent['$'].url;
                }
                // Hunt 3: Dig into the article text with Regex to find an embedded image
                else if (item.content || item.contentEncoded) {
                    const htmlContent = item.content || item.contentEncoded;
                    const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                return {
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate || item.isoDate,
                    category: feed.id,
                    color: feed.color,
                    bg: feed.bg,
                    icon: feed.icon,
                    image: imageUrl // Attach the image we found!
                };
            });
            
            allNews = allNews.concat(items);
        } catch (error) {
            console.error(`Error fetching ${feed.id}:`, error.message);
        }
    }

    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const output = {
        news: allNews,
        updatedAt: new Date().toISOString()
    };

    fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
}

fetchAllNews();
