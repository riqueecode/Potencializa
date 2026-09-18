const { chromium } = require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'chrome', headless:true});
 const page = await browser.newPage();
 await page.route('**/poster-extraction', route => route.fulfill({contentType:'text/html',body:'<html></html>'}));
 await page.goto('http://127.0.0.1:5173/poster-extraction');
 const files = ['portfolio-2.mp4', 'portfolio-3.mp4', 'VÃ­deo 2.mp4'];
 fs.mkdirSync('src/assets/VideoPortfolios/posters', {recursive:true});
 for (const [i,file] of files.entries()) {
  const result = await page.evaluate(async (file) => {
   const video = document.createElement('video');
   video.src = '/Potencializa/src/assets/VideoPortfolios/' + encodeURIComponent(file);
   video.preload = 'auto';
   await new Promise((resolve,reject) => { video.onloadedmetadata=resolve; video.onerror=()=>reject(new Error('Cannot decode '+file)); });
   video.currentTime = Math.min(1,video.duration/2);
   await new Promise((resolve,reject) => {video.onseeked=resolve; video.onerror=()=>reject(new Error(JSON.stringify({code:video.error?.code,message:video.error?.message,src:video.src}))); });
   const canvas=document.createElement('canvas');
   canvas.width=Math.min(720,video.videoWidth); canvas.height=Math.round(canvas.width*video.videoHeight/video.videoWidth);
   canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
   return {data:canvas.toDataURL('image/jpeg',.85).split(',')[1],width:canvas.width,height:canvas.height};
  },file);
  const name=['portfolio-2','portfolio-3','portfolio-8'][i]+'.jpg';
  fs.writeFileSync('src/assets/VideoPortfolios/posters/'+name,Buffer.from(result.data,'base64'));
  console.log(file,name,result.width,result.height);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});


