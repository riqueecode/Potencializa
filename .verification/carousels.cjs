const { chromium, devices } = require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 for(const mobile of [false,true]){
  const context=await browser.newContext(mobile?devices['iPhone 13']:{viewport:{width:1440,height:1000}});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.route('**/api/instagram/reels',r=>r.fulfill({json:Array.from({length:5},(_,i)=>({id:String(i),caption:'Reel '+(i+1),media_url:i===0?null:'http://127.0.0.1:5173/Potencializa/src/assets/VideoPortfolios/portfolio-1.mp4',thumbnail_url:'http://127.0.0.1:5173/Potencializa/src/assets/VideoPortfolios/posters/portfolio-2.jpg',permalink:'https://www.instagram.com/reel/test-'+i+'/'}))}));
  await page.goto('http://127.0.0.1:5173/Potencializa/');
  const tracks=page.locator('.reels-carousel--interactive .reels-carousel-track');
  await tracks.nth(2).waitFor();
  assert.equal(await tracks.count(),3);
  const focus=async(t,i)=>{await page.waitForFunction(({n,i})=>{const t=document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[n];return [...t.children].findIndex(c=>c.classList.contains('is-focused'))===i},{n:t,i});};
  const move=async(n,i)=>{await tracks.nth(n).evaluate((t,i)=>{const c=t.children[i],b=c.getBoundingClientRect();t.scrollTo({left:t.scrollLeft+b.left+b.width/2-t.getBoundingClientRect().left-t.clientWidth/2,behavior:'instant'});},i);await focus(n,i);};
  for(let n=0;n<3;n++){
   await focus(n,1);
   const track=tracks.nth(n), count=await track.locator('article').count();
   assert.equal(count,[5,11,3][n]);
   const centerError=await track.evaluate(t=>{const b=t.children[1].getBoundingClientRect();return Math.abs(b.left+b.width/2-t.getBoundingClientRect().left-t.clientWidth/2)});
   assert.ok(centerError<2);
   await move(n,2);
   await track.locator('article').nth(2).locator('button').click();
   await page.waitForFunction(n=>!document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[n].children[2].querySelector('video').paused,n);
   await page.waitForFunction(n=>!document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[n].children[2].querySelector('button'),n);
   await move(n,0);
   assert.ok(await track.locator('video').evaluateAll(v=>v.every(x=>x.paused)));
   assert.equal(await track.locator('article').nth(2).locator('button').count(),1);
   for(let i=1;i<count;i++)await move(n,i);
   await move(n,2);
  }
  assert.ok(await page.locator('video').evaluateAll(v=>v.every(x=>!x.controls&&!x.autoplay&&x.playsInline)));
  const fallback=tracks.nth(0).locator('article').first();
  assert.equal(await fallback.locator('video').count(),0);assert.equal(await fallback.locator('img').count(),1);assert.ok(await fallback.locator('a').getAttribute('href'));
  for(const i of [1,2,7]){
   const poster=await tracks.nth(1).locator('article').nth(i).locator('video').getAttribute('poster');assert.ok(poster);
   assert.ok(await page.evaluate(src=>new Promise(r=>{const image=new Image();image.onload=()=>r(image.naturalWidth>0);image.onerror=()=>r(false);image.src=src}),poster));
  }
  for(let n=0;n<3;n++){
   await tracks.nth(n).locator('article').nth(2).locator('button').click();
   await page.waitForTimeout(250);
   assert.equal(await page.locator('video').evaluateAll(v=>v.filter(x=>!x.paused).length),1);
  }
  await move(1,1);
  await tracks.nth(1).scrollIntoViewIfNeeded();
  const bounds=await tracks.nth(1).boundingBox();
  if(mobile){
   const cdp=await context.newCDPSession(page);
   const x=bounds.x+bounds.width*.8,y=bounds.y+80;
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(let step=1;step<=8;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-step*30,y}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForFunction(()=>document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[1].children[1].getAttribute('aria-current')!=='true');
  }else{
   await page.mouse.move(bounds.x+bounds.width*.75,bounds.y+3);
   await page.mouse.down();await page.mouse.move(bounds.x+bounds.width*.25,bounds.y+3,{steps:12});await page.mouse.up();
   await page.waitForFunction(()=>document.querySelectorAll('.reels-carousel--interactive .reels-carousel-track')[1].children[1].getAttribute('aria-current')!=='true');
   await move(1,5);await page.setViewportSize({width:1100,height:900});await focus(1,5);
  }
  assert.deepEqual(errors,[]);
  console.log(mobile?'MOBILE PASS':'DESKTOP PASS');
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
