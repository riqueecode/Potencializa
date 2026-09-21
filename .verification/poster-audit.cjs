const {chromium}=require('C:/Users/conta/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1500,height:1100}});
 await page.goto('http://127.0.0.1:5173/Potencializa/', {waitUntil:'domcontentloaded', timeout:60000});
 await page.evaluate(async()=>{
  const {mediaCatalog}=await import('/Potencializa/src/data/media.js');
  document.body.innerHTML='';document.body.style='background:white;color:black;padding:20px;display:grid;grid-template-columns:repeat(7,1fr);gap:12px;';
  for(const item of mediaCatalog.reels.items){const d=document.createElement('div');const title=document.createElement('p');title.textContent=item.id;const img=new Image();img.src=item.poster;img.style='width:170px;height:302px;object-fit:contain';d.append(title,img);document.body.append(d);}
  await Promise.all([...document.images].map(i=>i.decode()));
 });await page.screenshot({path:'.verification/poster-audit.png',fullPage:true});await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
