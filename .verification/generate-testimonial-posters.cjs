const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');

const baseDir = 'C:/Users/conta/Desktop/Potencializa/Potencializa/src/assets/Depoimentos';
const outDir = path.join(baseDir, 'posters');
fs.mkdirSync(outDir, { recursive: true });

const normalizeKey = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\.[^.]+$/, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const files = fs
    .readdirSync(baseDir)
    .filter((file) => /\.(mp4|mov)$/i.test(file));

  for (const file of files) {
    const source = path.join(baseDir, file);
    const url = pathToFileURL(source).href;

    const dataUrl = await page.evaluate(async (videoUrl) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.preload = 'auto';
      video.muted = true;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error(`metadata fail: ${videoUrl}`));
      });

      video.currentTime = Math.min(1, Math.max(0.1, video.duration / 2));

      await new Promise((resolve, reject) => {
        video.onseeked = () => resolve();
        video.onerror = () => reject(new Error(`seek fail: ${videoUrl}`));
      });

      const canvas = document.createElement('canvas');
      const width = Math.min(720, video.videoWidth || 720);
      const height = Math.round((width / (video.videoWidth || width)) * (video.videoHeight || width));

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#17131d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL('image/jpeg', 0.82);
    }, url);

    const key = normalizeKey(file);
    const outputPath = path.join(outDir, `${key}.jpg`);
    const base64 = dataUrl.split(',')[1];
    fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));
    console.log(`${file} -> ${path.basename(outputPath)}`);
  }

  await browser.close();
})();
