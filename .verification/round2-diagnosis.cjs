const fs=require('node:fs');
const {chromium}=require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async()=>{
 require('dotenv').config({quiet:true});
 const originals=['src/data/media.js','src/components/Reels/ReelsCarousel.jsx','src/components/Reels/ReelsCarousel.css','src/components/Reels/VideoModal.jsx','src/services/instagram.js'];
 fs.mkdirSync('.verification/round2-before',{recursive:true});
 for(const file of originals){const dest='.verification/round2-before/'+file.split('/').pop();if(!fs.existsSync(dest))fs.copyFileSync(file,dest);}
 const realFetch=global.fetch;let upstream;
 global.fetch=async(...args)=>{const r=await realFetch(...args);if(String(args[0]).includes('graph.instagram.com'))upstream=await r.clone().json();return r;};
 const {fetchInstagramReels}=await import('../server/services/instagram.js');const reels=await fetchInstagramReels();global.fetch=realFetch;
 const first=reels[0];const raw=upstream.data.find(x=>x.id===first.id);
 const detailURL=new URL('https://graph.instagram.com/v25.0/'+encodeURIComponent(first.id));
 detailURL.searchParams.set('fields','id,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp');detailURL.searchParams.set('access_token',process.env.INSTAGRAM_ACCESS_TOKEN);
 const detailResponse=await fetch(detailURL);const detail=await detailResponse.json();
 const safe=x=>({id:x.id,media_type:x.media_type,media_product_type:x.media_product_type,media_url:x.media_url?{present:true,host:new URL(x.media_url).host}:null,media_url_field_present:Object.hasOwn(x,'media_url'),thumbnail_url:x.thumbnail_url?{present:true,host:new URL(x.thumbnail_url).host}:null,permalink:x.permalink,timestamp:x.timestamp});
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();
 await page.goto('http://127.0.0.1:5173/Potencializa/',{waitUntil:'domcontentloaded'});
 const catalog=await page.evaluate(async()=> (await import('/Potencializa/src/data/media.js')).mediaCatalog);
 const normalized=await page.evaluate(async item=>(await import('/Potencializa/src/services/instagram.js')).normalizeInstagramReel(item),first);
 await page.locator(`[data-reel-id="${first.id}"]`).waitFor();
 const dom=await page.locator(`[data-reel-id="${first.id}"]`).evaluate(c=>({videos:c.querySelectorAll('video').length,links:[...c.querySelectorAll('a')].map(a=>({href:a.href,label:a.getAttribute('aria-label')})),thumbnail:!!c.querySelector('img')}));
 const evidence={rawFirst:safe(raw),backendFirst:safe(first),detail:{status:detailResponse.status,...safe(detail)},normalizedFirst:{...normalized,thumbnail:normalized.thumbnail?{present:true}:null,video:normalized.video?{present:true}:normalized.video},dom,catalog};
 fs.writeFileSync('.verification/round2-before.json',JSON.stringify(evidence,null,2));
 console.log(JSON.stringify({...evidence,catalog:catalog.reels.items.map((x,i)=>({position:i+1,...x}))},null,2));
 await browser.close();
})().catch(()=>{console.error('Diagnosis failed; no request URLs or credentials logged.');process.exit(1)});
