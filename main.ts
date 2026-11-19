// Submission packager for Vice Poster Studio (make.fun gta6-cover-art-01).
// Assembles static web app assets, screenshots, and generates deterministic dossier summary.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Ensure target output directories exist
mkdirSync(outputDir, { recursive: true });

// Copy offline web application files to output
const sourceAppDir = join(rootDir, 'app');
const targetAppDir = join(outputDir, 'app');
cpSync(sourceAppDir, targetAppDir, { recursive: true });

// Copy generated screenshots
const sourceShotsDir = join(rootDir, 'screenshots');
const targetShotsDir = join(outputDir, 'screenshots');
mkdirSync(targetShotsDir, { recursive: true });
if (existsSync(sourceShotsDir)) {
  cpSync(sourceShotsDir, targetShotsDir, { recursive: true });
}

// Construct deterministic dossier JSON matching evaluation gate caps
const dossierPayload = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});

const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, dossierPayload);
console.log(`Successfully built submission package to ${outputDir}`);
