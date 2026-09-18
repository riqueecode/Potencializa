const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const baseDir = 'C:/Users/conta/Desktop/Potencializa/Potencializa/src/assets/Depoimentos';
const outDir = path.join(baseDir, 'posters');
fs.mkdirSync(outDir, { recursive: true });

const ffmpeg = 'C:/Users/conta/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build-shared/bin/ffmpeg.exe';

const files = fs.readdirSync(baseDir).filter((file) => /\.(mp4|mov)$/i.test(file));

for (const file of files) {
  const input = path.join(baseDir, file);
  const normalizedName = file
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const output = path.join(outDir, `${normalizedName}.jpg`);

  const result = spawnSync(ffmpeg, [
    '-y',
    '-ss', '00:00:01',
    '-i', input,
    '-frames:v', '1',
    '-q:v', '3',
    output,
  ], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${file} (exit ${result.status})`);
  }

  console.log('created', path.basename(output));
}
