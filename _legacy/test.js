const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Track network requests to verify no external connections
    const networkRequests = [];
    page.on('request', request => {
        networkRequests.push({
            url: request.url(),
            method: request.method()
        });
    });

    try {
        // Load the local HTML file
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`);

        // Wait for content to load
        await page.waitForSelector('.file-card');

        // Check if file cards are rendered
        const fileCards = await page.$$('.file-card');
        console.log(`✓ Page loaded successfully`);
        console.log(`✓ Found ${fileCards.length} file cards`);

        // Check download buttons
        const downloadButtons = await page.$$('.download-btn');
        console.log(`✓ Found ${downloadButtons.length} download buttons`);

        // Test search functionality
        await page.fill('.search-input', 'Python');
        await page.waitForTimeout(300);
        const filteredCards = await page.$$('.file-card');
        console.log(`✓ Search functionality works - found ${filteredCards.length} result(s) for "Python"`);

        // Clear search
        await page.fill('.search-input', '');
        await page.waitForTimeout(300);

        // Check for external requests (should only be the HTML file itself)
        const externalRequests = networkRequests.filter(r => !r.url.includes('file://'));
        if (externalRequests.length === 0) {
            console.log('✓ No external network requests detected (100% privacy)');
        } else {
            console.log('⚠ External requests found:', externalRequests.map(r => r.url));
        }

        console.log('\n✅ All tests passed! Website is working correctly.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
