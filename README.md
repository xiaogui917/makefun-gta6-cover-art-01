# Vice Poster Studio

[![make.fun bounty](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/xiaogui917/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/xiaogui917/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

An offline web application that transforms personal photos and custom captions into striking GTA 6 poster-style cover art. Designed with dynamic multi-panel collage compositions, cinematic sunset and neon color grading, bold extruded 3D typography, and high-resolution PNG export.

## Features

- **Dynamic Comic Collages**: Choose from multiple multi-panel layouts including Quad Mosaic, Classic Triptych, Duo Diagonal, and Hero Spotlight.
- **Cinematic Color Grading**: Authentic retro-tropical color washes (Vice Sunset, Neon Night, Golden Hour, and Pastel Tropic) with adjustable saturation and contrast.
- **GTA Poster Typography**: 3D extruded lettering, multi-stroke outlines, vibrant gradient fills, caption banners, and custom Roman numeral badges.
- **Multi-Ratio Export**: Instant PNG downloads in standard social resolutions (16:9 Banner, 1:1 Square, and 4:5 Story).
- **100% Offline & Private**: Zero external network requests or CDN dependencies; all processing is handled purely on the client canvas.

## Quick Start

Run the included lightweight local server:

```bash
node serve.ts
```

Open [http://localhost:8080](http://localhost:8080) in any modern desktop browser.

To serve on a custom port:

```bash
node serve.ts --port 8902
```

## How to Create Cover Art

1. **Select Photos**: Click **Upload Your Photo** to load a local picture, or pick one of the bundled sample scenes.
2. **Set Typography**: Enter your Main Title, Subtitle Caption, Tagline stamp, and Roman Numeral badge. Quick presets are also available.
3. **Choose Panel Layout**: Pick between Quad Mosaic (4 panels), Triptych (3 panels), Duo Diagonal (2 panels), or Single Hero.
4. **Tune Color Mood & FX**: Select a color grade wash (Vice Sunset, Neon Night, Golden Hour, Pastel Tropic), toggle comic halftone dots, and fine-tune contrast and borders.
5. **Export Poster**: Click **EXPORT PNG POSTER** to download your high-resolution PNG cover.

## Project Structure

- `app/index.html`: Web application mount and semantic markup.
- `app/style.css`: Responsive synthwave interface and preview layout styling.
- `app/src/`: Modular ES modules (photo processing, color grading, panel layouts, typography artist, cover renderer, and export pipeline).
- `app/samples/`: Bundled model-generated sample photographs.
- `shots.json`: Automated screenshot configurations and scene descriptions.
- `main.ts`: Deterministic packager and dossier generator.

## License

MIT License.
