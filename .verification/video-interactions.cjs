const {chromium,devices}=require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 for(const mobile of [false,true]){
  const context=await browser.newContext(mobile?{...devices['iPhone 13'],viewport:{width:320,height:640}}:{viewport:{width:1440,height:900}});
  const page=await context.newPage();page.setDefaultTimeout(30000);
  const root='http://127.0.0.1:4173';const base=root+'/Potencializa/';
  // Fixtures are confined to the test route, never added to the product catalog.
  await page.route('**/api/instagram/reels',r=>r.fulfill({json:[
   {id:'null-test',media_url:null,thumbnail_url:base+'assets/video-2.jpg',permalink:'https://www.instagram.com/'},
   {id:'horizontal-test',media_url:root+'/__horizontal.mp4',thumbnail_url:base+'assets/video-2.jpg'},
   {id:'error-test',media_url:root+'/__missing.mp4',thumbnail_url:base+'assets/video-2.jpg',permalink:'https://www.instagram.com/'}
  ]}));
  await page.route('**/__horizontal.mp4',r=>r.fulfill({contentType:'video/mp4',body:fs.readFileSync('.verification/horizontal-test.mp4')}));
  await page.route('**/__missing.mp4',r=>r.fulfill({status:404,body:''}));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const horizontal=page.locator('[data-reel-id="horizontal-test"]');const hit=horizontal.locator('.reels-carousel-hit');
  await horizontal.waitFor();await horizontal.locator('video').evaluate(v=>{v.dataset.plays='0';v.addEventListener('play',()=>v.dataset.plays=String(Number(v.dataset.plays)+1));});
  if(mobile)await hit.tap();else {await hit.focus();await page.keyboard.press('Enter');}
  await page.waitForFunction(()=>document.querySelector('[data-reel-id="horizontal-test"] video').currentTime>.1);
  assert.equal(await horizontal.locator('video').getAttribute('data-plays'),'1');
  await horizontal.locator('.reels-carousel-expand').click();const modal=page.locator('.video-modal');await modal.waitFor();
  await page.waitForFunction(()=>document.querySelector('.video-modal video').videoWidth===1280);
  assert.equal(await modal.locator('.video-modal__error').count(),0);
  assert.equal(await modal.locator('video').evaluate(v=>v.videoHeight),720);
  for(const size of (mobile?[{width:320,height:640},{width:844,height:390}]:[{width:1440,height:900}])){
   await page.setViewportSize(size);const b=await modal.locator('video').boundingBox();assert.ok(b.x>=0&&b.y>=0&&b.x+b.width<=size.width&&b.y+b.height<=size.height);
   assert.equal(await modal.locator('video').evaluate(v=>getComputedStyle(v).objectFit),'contain');
  }
  if(mobile)await modal.locator('button').tap();else await modal.locator('button').click();
  if(mobile)await page.setViewportSize({width:320,height:640});
  // Play a local card, then another section: only the newly selected video runs.
  const first=page.locator('[data-reel-id="portfolio-3"]');await first.locator('.reels-carousel-hit').click();
  await page.waitForFunction(()=>!document.querySelector('[data-reel-id="portfolio-3"] video').paused);
  const testimonial=page.locator('[data-reel-id="testimonial-2"]');await testimonial.locator('.reels-carousel-hit').click();
  await page.waitForFunction(()=>!document.querySelector('[data-reel-id="testimonial-2"] video').paused);
  assert.ok(await first.locator('video').evaluate(v=>v.paused));
  // Regress a delayed play event from the already-paused previous player.
  await first.locator('video').evaluate(v=>v.dispatchEvent(new Event('play')));
  assert.ok(await testimonial.locator('video').evaluate(v=>!v.paused));
  const track=testimonial.locator('..');await track.evaluate(t=>t.scrollTo({left:0,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('[data-reel-id="testimonial-2"] video').paused);
  const nullCard=page.locator('[data-reel-id="null-test"]');assert.equal(await nullCard.locator('video').count(),0);assert.equal(await nullCard.locator('a').count(),1);
  const broken=page.locator('[data-reel-id="error-test"]');await broken.evaluate(c=>{const t=c.parentElement,b=c.getBoundingClientRect();t.scrollTo({left:t.scrollLeft+b.left+b.width/2-t.getBoundingClientRect().left-t.clientWidth/2,behavior:'instant'});});await broken.locator('.reels-carousel-hit').click();
  await broken.locator('[role="status"]').waitFor();assert.equal(await broken.locator('[role="status"] a').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log(`${mobile?'MOBILE 320 / LANDSCAPE':'DESKTOP'} horizontal, keyboard/tap, single action, cross-section pause, slide pause, null and error fallback PASS`);
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
