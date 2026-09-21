const { chromium } = require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const page = await browser.newPage();
 await page.goto('http://127.0.0.1:5173/Potencializa/');
 const catalog = await page.evaluate(async()=> (await import('/Potencializa/src/data/media.js')).mediaCatalog);
 console.log(JSON.stringify(catalog.reels.items,null,2));
 const results=[];
 for(const item of catalog.reels.items){
  const result=await page.evaluate(async item=>{
   const v=document.createElement('video'); v.muted=true; v.src=item.video;document.body.append(v);
   const events=[];for(const e of ['loadedmetadata','loadeddata','canplay','play','playing','error'])v.addEventListener(e,()=>events.push(e));
   let failure;await Promise.race([v.play().catch(e=>failure=e.message),new Promise(r=>setTimeout(r,6000))]);
   await new Promise(r=>setTimeout(r,600));
   const out={src:item.video,poster:item.poster,events,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error?.message,failure};v.pause();v.remove();return out;
  },item); results.push(result);console.log(JSON.stringify(result));
 }
 fs.writeFileSync('.verification/video-baseline.json',JSON.stringify({catalog,results},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
