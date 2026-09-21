const {chromium}=require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async()=>{
 require('dotenv').config({quiet:true});const {fetchInstagramReels}=await import('../server/services/instagram.js');const reels=await fetchInstagramReels();
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();
 page.on('console',m=>{if(m.text().startsWith('MEDIA TRACE'))console.log(m.text());});
 await page.addInitScript(()=>{
  const pause=HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.pause=function(){if(this.closest('.video-modal'))console.log('MEDIA TRACE pause '+new Error().stack);return pause.call(this);};
  for(const name of ['play','playing','pause','ended','seeking','seeked'])document.addEventListener(name,e=>{if(e.target.closest?.('.video-modal'))console.log('MEDIA TRACE '+name+' '+JSON.stringify({time:e.target.currentTime,duration:e.target.duration}));},true);
 });
 await page.route('**/api/instagram/reels',r=>r.fulfill({json:reels}));
 await page.goto('http://127.0.0.1:5173/Potencializa/',{waitUntil:'domcontentloaded'});
 for(const reel of reels.filter(r=>r.media_url)){
  const card=page.locator(`[data-reel-id="${reel.id}"]`);await card.waitFor();await card.evaluate(c=>{const t=c.parentElement,b=c.getBoundingClientRect();t.scrollTo({left:t.scrollLeft+b.left+b.width/2-t.getBoundingClientRect().left-t.clientWidth/2,behavior:'instant'});});
  await card.locator('.reels-carousel-hit').click();await page.waitForFunction(id=>{const v=document.querySelector(`[data-reel-id="${id}"] video`);return v.currentTime>.3&&!v.paused;},reel.id,{timeout:60000});
  await card.locator('.reels-carousel-expand').click();await page.locator('.video-modal').waitFor();
  await page.waitForFunction(()=>{const v=document.querySelector('.video-modal video');return v.readyState>=2&&!v.paused;},null,{timeout:60000}).catch(()=>{});
  console.log(reel.id,await page.locator('.video-modal video').evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,ready:v.readyState,network:v.networkState,error:v.error?.message})),await page.locator('.video-modal').innerText());
  await page.locator('.video-modal button').click();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
