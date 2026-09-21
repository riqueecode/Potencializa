const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ffmpeg = 'C:/Users/conta/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build-shared/bin/ffmpeg.exe';
const projectDir = path.resolve(__dirname, '..');
const portfolioDir = path.join(projectDir, 'src/assets/VideoPortfolios');
const testimonialDir = path.join(projectDir, 'src/assets/Depoimentos');

function convertDirectory(directory) {
  for (const file of fs.readdirSync(directory)) {
    if (!file.toLowerCase().endsWith('.mov')) continue;
    const input = path.join(directory, file);
    const output = path.join(directory, file.replace(/\.mov$/i, '.mp4'));
    console.log(`Converting ${file} -> ${path.basename(output)}`);
    const result = spawnSync(ffmpeg, [
      '-y', '-i', input,
      '-vf', 'scale=720:-2:flags=lanczos',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart', output,
    ], { stdio: 'ignore' });
    if (result.status !== 0) throw new Error(`FFmpeg failed for ${file}`);
  }
}

convertDirectory(portfolioDir);

for (const file of fs.readdirSync(testimonialDir)) {
  if (!file.toLowerCase().endsWith('.mov')) continue;
  const equivalent = file
    .replace(/^Depoimento Edilaine\s*\.mov$/i, 'depoimento-edilaine.mp4')
    .replace(/^Depoimento Elaine\s*\.mov$/i, 'depoimento-elaine.mp4')
    .replace(/^Depoimento Iracelma\s*\.mov$/i, 'depoimento-iracelma.mp4');
  const target = path.join(testimonialDir, equivalent);
  if (!fs.existsSync(target)) throw new Error(`Missing equivalent MP4 for ${file}`);
  console.log(`Using existing equivalent ${path.basename(target)} for ${file}`);
}
