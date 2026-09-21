const { chromium, devices } = require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base=process.env.VIDEO_TEST_URL || 'http://127.0.0.1:4173/Potencializa/';
const evidence=[];
(async()=>{
 require('dotenv').config({quiet:true});
 const {fetchInstagramReels}=await import('../server/services/instagram.js');
 const realReels=await fetchInstagramReels();
 evidence.push({realAPI:{count:realReels.length,playable:realReels.filter(x=>x.media_url).length,nullMedia:realReels.filter(x=>!x.media_url).length}});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 for(const mobile of (process.env.VIDEO_TEST_MOBILE==='1'?[true]:[false,true])){
  const context=await browser.newContext(mobile?devices['iPhone 13']:{viewport:{width:1440,height:1000}});
  const page=await context.newPage();page.setDefaultTimeout(45000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Real API data, fetched above. No tokens or signed media URLs are persisted.
  if(process.env.VIDEO_REAL_HTTP!=='1')await page.route('**/api/instagram/reels',route=>route.fulfill({json:realReels}));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const tracks=page.locator('.reels-carousel--interactive .reels-carousel-track');
  await tracks.nth(2).waitFor();
  assert.equal(await tracks.count(),3);
  const move=async(n,id)=>{
   const card=tracks.nth(n).locator(`[data-reel-id="${id}"]`);
   await card.evaluate(c=>{const t=c.parentElement,b=c.getBoundingClientRect();t.scrollTo({left:t.scrollLeft+b.left+b.width/2-t.getBoundingClientRect().left-t.clientWidth/2,behavior:'instant'});});
   await page.waitForFunction(({n,id})=>document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[n]?.querySelector(`[data-reel-id="${id}"]`)?.getAttribute('aria-current')==='true',{n,id});
   return card;
  };
  const activeCount=()=>page.locator('video').evaluateAll(v=>v.filter(x=>!x.paused).length);
  for(let n=0;n<3;n++){
   assert.equal(await tracks.nth(n).locator('article').count(),[realReels.length,13,3][n]);
   assert.equal(await tracks.nth(n).locator('article').nth(1).getAttribute('aria-current'),'true');
  }
  assert.equal(await tracks.nth(1).locator('[data-reel-id="portfolio-2"]').count(),0);
  assert.ok((await tracks.nth(2).locator('video source').first().getAttribute('src')).includes('depoimento-edilaine'));
  assert.ok(await page.locator('video').evaluateAll(v=>v.every(x=>x.paused&&!x.autoplay&&!x.controls&&x.playsInline)));
  const localIds=await tracks.nth(1).locator('article').evaluateAll(a=>a.map(x=>x.dataset.reelId));
  const cases=[...localIds.map(id=>[1,id]),...[0,1,2].map(i=>[2,`testimonial-${i+1}`]),...realReels.filter(x=>x.media_url).map(x=>[0,x.id])];
  for(const [n,id] of cases){
   console.log(`${mobile?'mobile':'desktop'} ${id}`);
   const card=await move(n,id);await card.scrollIntoViewIfNeeded();
   const video=card.locator('video');
   const poster=await video.getAttribute('poster');assert.ok(poster,`missing poster ${id}`);
   const posterOK=await page.evaluate(src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i.naturalWidth>0);i.onerror=()=>r(false);i.src=src}),poster);assert.ok(posterOK,id);
   await video.evaluate(v=>{v.dataset.events='';for(const e of ['play','playing','loadedmetadata','loadeddata','canplay'])v.addEventListener(e,()=>v.dataset.events+=e+',');});
   const hit=card.locator('.reels-carousel-hit');
   if(mobile)await hit.tap({position:{x:25,y:90}});else await hit.click({position:{x:25,y:90}});
   await page.waitForFunction(({n,id})=>{const v=document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[n].querySelector(`[data-reel-id="${id}"] video`);return v.currentTime>.15&&!v.paused&&v.readyState>=2;},{n,id}).catch(async e=>{console.log(await video.evaluate(v=>({paused:v.paused,time:v.currentTime,error:v.error?.message,ready:v.readyState,network:v.networkState,events:v.dataset.events})));throw e;});
   assert.equal(await activeCount(),1);
   const data=await video.evaluate(v=>{
    let visual=null;try{const c=document.createElement('canvas');c.width=32;c.height=32;const ctx=c.getContext('2d');ctx.drawImage(v,0,0,32,32);const p=ctx.getImageData(0,0,32,32).data;visual=[...p].filter((x,i)=>i%4!==3).some(x=>x>30);}catch{}
    return {time:v.currentTime,width:v.videoWidth,height:v.videoHeight,frames:v.getVideoPlaybackQuality().totalVideoFrames,audioBytes:v.webkitAudioDecodedByteCount,visual,events:v.dataset.events};
   });
   assert.ok(data.frames>0,id);if(n!==0)assert.equal(data.visual,true,id);
   evidence.push({mobile,id,...data});
   if(['portfolio-3','portfolio-11','testimonial-1',realReels.find(x=>x.media_url)?.id].includes(id)){
    const scroll=await page.evaluate(()=>window.scrollY);
    const opener=card.locator('.reels-carousel-expand');if(mobile)await opener.tap();else await opener.click();
    const modal=page.locator('.video-modal');await modal.waitFor();
    assert.ok(await video.evaluate(v=>v.paused));
    await page.waitForFunction(()=>{const v=document.querySelector('.video-modal video');return v&&!v.paused&&v.currentTime>.15;}).catch(async e=>{console.log(await modal.locator('video').evaluate(v=>({paused:v.paused,time:v.currentTime,error:v.error?.message,ready:v.readyState,network:v.networkState})));console.log(await modal.innerText());throw e;});
    assert.equal(await activeCount(),1);
    assert.ok(await modal.evaluate(d=>d.parentElement===document.body&&d.matches(':modal')&&getComputedStyle(d).position==='fixed'));
    const bounds=await modal.boundingBox();const view=page.viewportSize();assert.ok(Math.abs(bounds.width-view.width)<2&&Math.abs(bounds.height-view.height)<2);
    const vb=await modal.locator('video').boundingBox();assert.ok(Math.abs(vb.x+vb.width/2-view.width/2)<2);assert.ok(Math.abs(vb.y+vb.height/2-view.height/2)<2);
    await page.mouse.move(5,5);await page.mouse.move(view.width-5,view.height-5);await page.mouse.wheel(0,600);
    assert.deepEqual(await modal.boundingBox(),bounds);
    assert.equal(await modal.locator('video').evaluate(v=>getComputedStyle(v).objectFit),'contain');
    await page.keyboard.press('Tab');assert.ok(await modal.evaluate(d=>d.contains(document.activeElement)));
    if(id==='portfolio-3')await page.screenshot({path:`.verification/video-modal-${mobile?'mobile':'desktop'}.png`});
    if(mobile)await modal.locator('button').tap();else await modal.locator('button').click();await modal.waitFor({state:'detached'});assert.equal(await activeCount(),0);
    assert.ok(Math.abs(await page.evaluate(()=>window.scrollY)-scroll)<3);
    assert.ok(await opener.evaluate(b=>b===document.activeElement));
    await opener.click();await modal.waitFor();assert.ok(await modal.locator('video').evaluate(v=>v.paused));
    await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});
    await opener.click();await modal.waitFor();await modal.click({position:{x:3,y:3}});await modal.waitFor({state:'detached'});
   }else await hit.click({position:{x:25,y:90}});
  }
  for(const reel of realReels.filter(x=>!x.media_url)){
   const card=await move(0,reel.id);assert.equal(await card.locator('video').count(),0);assert.equal(await card.locator('img').count(),1);assert.equal(await card.locator('a').getAttribute('href'),reel.permalink);
  }
  assert.equal(await page.locator('.reels-button').getAttribute('href'),'https://www.instagram.com/potencializa__/reels/');
  // Swipe / drag starts on the full-card play target, not in a gap.
  const card=await move(1,'portfolio-3');await card.scrollIntoViewIfNeeded();const b=await card.boundingBox();
  if(mobile){const cdp=await context.newCDPSession(page);const x=b.x+b.width*.85,y=b.y+100;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*24,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else{await page.mouse.move(b.x+b.width*.85,b.y+100);await page.mouse.down();await page.mouse.move(b.x-b.width*.4,b.y+100,{steps:12});await page.mouse.up();}
  await page.waitForFunction(()=>document.querySelector('[data-reel-id="portfolio-3"]').getAttribute('aria-current')!=='true');assert.equal(await activeCount(),0);
  for(const id of [localIds[0],localIds.at(-1)])await move(1,id);
  if(mobile){
   await page.setViewportSize({width:844,height:390});const c=await move(1,'portfolio-11');await c.locator('.reels-carousel-expand').click();const modal=page.locator('.video-modal');await modal.waitFor();const b=await modal.locator('video').boundingBox();assert.ok(b.x>=0&&b.y>=0&&b.x+b.width<=844&&b.y+b.height<=390);await modal.locator('button').click();
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  assert.deepEqual(errors,[]);console.log(mobile?'MOBILE PASS':'DESKTOP PASS');
  await context.close();
 }
 await browser.close();fs.writeFileSync('.verification/video-system-results.json',JSON.stringify(evidence,null,2));
})().catch(e=>{fs.writeFileSync('.verification/video-system-results.json',JSON.stringify(evidence,null,2));console.error(e);process.exit(1)});
