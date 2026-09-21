const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const js=fs.readFileSync('dist/assets/index.js','utf8');
 assert.ok(!/C:\\\\Users\\\\|file:\/\/|\/src\/assets\//.test(js));
 const urls=[...new Set([...js.matchAll(/["'](\/Potencializa\/assets\/[^"']+)["']/g)].map(m=>m[1]))];
 const files=fs.readdirSync('dist/assets');const result=[];
 for(const url of urls){
  const filename=decodeURIComponent(url.split('/').pop());assert.ok(files.includes(filename),`missing/exact case: ${filename}`);
  if(!/\.(mp4|jpg)$/.test(filename))continue;
  const response=await fetch('http://127.0.0.1:4173'+url,{headers:{Range:'bytes=0-127'}});
  assert.ok(response.ok,filename);assert.equal(response.status,206,filename);
  const type=response.headers.get('content-type');assert.ok(type.includes(filename.endsWith('.mp4')?'video/mp4':'image/jpeg'),filename);
  await response.arrayBuffer();result.push({filename,status:response.status,type});
 }
 for(const name of ['depoimento-elaine.jpg','video-2.jpg','portfolio-video4-web.mp4'])assert.ok(result.some(r=>r.filename===name));
 assert.ok(!files.includes('Depoimento Elaine .mp4'));assert.ok(!files.includes('portfolio-2.mp4'));
 fs.writeFileSync('.verification/dist-audit.json',JSON.stringify(result,null,2));console.log(`PASS: ${result.length} media URLs, exact case, MIME and HTTP 206; no source/local paths.`);
})().catch(e=>{console.error(e);process.exit(1)});
