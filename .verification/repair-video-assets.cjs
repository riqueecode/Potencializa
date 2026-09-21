const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const ff = 'C:/Users/conta/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build-shared/bin/ffmpeg.exe';
const root='src/assets/VideoPortfolios';
fs.mkdirSync(root+'/web',{recursive:true});
function run(args){execFileSync(ff,['-hide_banner','-loglevel','error','-n',...args],{stdio:'inherit'});}
const original=fs.readdirSync(root).find(f=>f.normalize('NFC')==='Vídeo 4 .mov');
if(!fs.existsSync(root+'/web/portfolio-video4-web.mp4'))run(['-i',path.join(root,original),'-vf','scale=720:-2:flags=lanczos','-c:v','libx264','-preset','medium','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',root+'/web/portfolio-video4-web.mp4']);
const posters=[
 ['Depoimento Elaine .mov','depoimento-elaine',2],
 ['Vídeo 2.mp4','video-2',2],
 ['copy_03E91B91-0B23-455A-84CB-C080C092C19B.mp4','copy-original',2],
 ['portfolio-1.mp4','portfolio-1',2],
 ['portfolio-4.mp4','portfolio-4',2],
 ['portfolio-5.mp4','portfolio-5',2],
 ['portfolio-6.mp4','portfolio-6',2],
 ['Vídeo 1 .mp4','video-1',2],
 ['Vídeo 3 .mp4','video-3',2],
 ['Vídeo 6 .mp4','video-6',2],
 ['Vídeo 8 mp4.mp4','video-8',2],
];
for(const [file,name,time] of posters){
 const output=root+'/posters/'+name+'.jpg';
 if(!fs.existsSync(output))run(['-ss',String(time),'-i',root+'/'+file,'-frames:v','1','-vf','scale=720:-2','-q:v','3',output]);
 console.log(file+' -> '+output);
}
