const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/Potencializa/', { waitUntil: 'networkidle', timeout: 120000 });

  const firstCard = page.locator('.reels-carousel-card').first();
  const firstId = await firstCard.getAttribute('data-reel-id');
  const counts = {
    cards: await page.locator('.reels-carousel-card').count(),
    arrows: await page.locator('.reels-carousel-arrow').count(),
    videos: await page.locator('.reels-carousel-card video').count(),
    staticFallbacks: await page.locator('.reels-carousel-hit--static').count(),
    instagramLinksInFirst: await page.locator('[data-reel-id="' + firstId + '"] a[href*="instagram.com"]').count(),
    thumbImagesInFirst: await page.locator('[data-reel-id="' + firstId + '"] img').count(),
  };

  const clickCheck = await firstCard.evaluate((el) => {
    const before = window.location.href;
    const target = el.querySelector('.reels-carousel-hit');
    if (!target) return { before, after: window.location.href, redirected: false, reason: 'no-hit' };
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
    return { before, after: window.location.href, redirected: window.location.href !== before, reason: 'clicked' };
  });

  console.log(JSON.stringify({ firstId, counts, clickCheck }, null, 2));
  await browser.close();
})();
