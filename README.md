# Stereoscope

Stereoscope is a browser-based stereo video player that converts normal 2D video into a 3D presentation in real time using WebGL rendering.

The application is designed around a normal video player workflow: load a local movie, adjust stereo/depth settings, play it in the browser, and use fullscreen mode for a movie-only viewing experience.

## Purpose

The main purpose of Stereoscope is to take a normal 2D video and create a stereoscopic presentation from it without requiring the source movie itself to be converted before playback.

The renderer generates a depth representation from the video image and uses that depth to create left/right eye views. For anaglyph viewing, those views are combined into a single red/cyan image suitable for common red/cyan 3D glasses.

The project also includes a video conversion/export feature that can record the rendered 3D/anaglyph result and download it as a video file supported by the browser.

## Features

- Local video file playback
- Browser-based stereo rendering
- Red/cyan anaglyph output
- Multiple stereo/depth viewing modes
- Adjustable depth, convergence, zoom, and picture settings
- Ghost-reduction controls
- Audio playback through the original media element
- Subtitle support through the player
- Fullscreen movie-only mode
- Convert and download the rendered 3D result
- Responsive UI designed for desktop and larger displays
- PWA-related support included in the project
- Optional authentication/database infrastructure already present in the codebase

## How it works

At a high level:

```text
Local video
    │
    ▼
HTML video element
    │
    ▼
WebGL renderer
    │
    ├── depth estimation
    │
    ├── left-eye displacement
    │
    ├── right-eye displacement
    │
    └── anaglyph composition
    │
    ▼
Rendered canvas
    │
    ├── normal playback
    └── browser video export
```

The stereo renderer operates on the video frame in the GPU. This means the player does not first generate a separate converted movie file just to display the result.

## Requirements

### Runtime

- Node.js
- npm
- A modern browser with WebGL/WebGL2 support
- A system capable of playing the source video in the browser

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Chromium-based browsers with current MediaRecorder support

Firefox/Safari may work for playback, but export support can vary by browser and codec.

### Development environment

The project uses:

- React
- TypeScript
- Vite
- TanStack Start
- Tailwind CSS
- Zustand
- Radix UI components
- WebGL-based rendering
- Vitest/Node-based test scripts where applicable
- Nitro for production/server integration
- PGlite for local database functionality used by parts of the application

The exact dependency versions are defined in `package.json` and `package-lock.json`.

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd anaglyph-player
```

Install dependencies:

```bash
npm install
```

For a reproducible install from the lockfile:

```bash
npm ci
```

Do not commit `node_modules/` to Git.

## Development

Start the Vite development server:

```bash
npm run dev
```

The project is configured to serve the development application on:

```text
http://localhost:8080
```

The Vite server listens on:

```text
0.0.0.0:8080
```

so it can also be reached from another device on the same network when the host machine/firewall permits it.

You can also use the repository startup helper:

```bash
./startup.sh
```

The startup helper checks for an existing service on port 8080 before starting another development instance.

### Important: local filesystem vs UTM shared folders

When developing inside an ARM Linux VM under UTM, keep the Node project and especially `node_modules` on the VM's local filesystem rather than running Node/native npm dependencies directly from a 9p shared folder.

Recommended:

```text
/home/<user>/anaglyph-player
```

instead of:

```text
/mnt/utm/anaglyph-player
```

Use the UTM shared folder for transferring files when needed, but keep the active Node/Vite workspace local to the Linux guest.

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open the application in your browser:

   ```text
   http://localhost:8080
   ```

3. Load a local movie using the film/file picker.

4. Adjust the stereo settings as required.

5. Use the player controls to:
   - play/pause
   - seek
   - adjust volume
   - change playback rate
   - select the desired stereo/anaglyph presentation
   - change depth/convergence and other image controls

6. Press the fullscreen control (or the configured keyboard shortcut) to enter movie-only fullscreen mode.

### Fullscreen behavior

Fullscreen intentionally targets the movie stage rather than the entire application shell.

That means fullscreen hides:

- the application header
- the right-side controls/settings panel
- the normal transport area outside the movie stage

and displays the movie by itself.

## Convert and Download

The project includes a video conversion/export workflow.

The export process captures the already-rendered stereo/anaglyph canvas rather than replacing the existing playback renderer.

Typical workflow:

```text
Load movie
    ↓
Adjust stereo settings
    ↓
Click Convert
    ↓
Render/play through the movie from the beginning
    ↓
Capture the rendered canvas
    ↓
Download the encoded result
```

The exported file uses a browser-supported `MediaRecorder` format.

The exporter checks available MIME types and prefers supported formats, including WebM and MP4 where the browser provides them.

### Export limitations

Browser-side export has several important limitations:

- Export normally runs in real time, so a two-hour film can take approximately two hours to export.
- Output format depends on browser/OS `MediaRecorder` support.
- Browser recording does not guarantee preservation of the source container's embedded subtitle tracks as independent subtitle streams.
- Audio capture depends on browser media-stream support.
- The exported file represents the rendered stereo/anaglyph result, not the original video bitstream.

For the most predictable export behavior, use a Chromium-based browser and a source format that the browser can play normally.

## Project structure

Important directories and files:

```text
src/
├── components/
│   ├── player/
│   │   ├── stereoscope-app.tsx
│   │   ├── settings-panel.tsx
│   │   ├── transport-bar.tsx
│   │   └── convert-dialog.tsx
│   │
│   └── ui/
│       └── ...
│
├── lib/
│   ├── anaglyph/
│   │   ├── renderer.ts
│   │   ├── shaders.ts
│   │   ├── exporter.ts
│   │   ├── store.ts
│   │   ├── types.ts
│   │   └── demo-scene.ts
│   │
│   ├── auth/
│   ├── app-data/
│   ├── db.ts
│   └── utils.ts
│
├── routes/
├── router.tsx
└── styles.css
```

### Main player

`src/components/player/stereoscope-app.tsx`

Owns the primary player flow, video element, rendering loop integration, fullscreen behavior, file loading, player state, and player-level interactions.

### Stereo renderer

`src/lib/anaglyph/renderer.ts`

Owns the GPU/WebGL rendering pipeline used to transform the video image into the selected stereo presentation.

### Shaders

`src/lib/anaglyph/shaders.ts`

Contains the GPU shader programs used for depth/stereo processing and output composition.

### Exporter

`src/lib/anaglyph/exporter.ts`

Contains the browser-side video export logic, including:

- MediaRecorder format selection
- canvas/video stream creation
- recording
- progress reporting
- cancellation
- output file naming
- download handling

### Settings store

`src/lib/anaglyph/store.ts`

Stores user stereo settings and presets with Zustand persistence.

## NPM scripts

The main project commands are:

```bash
npm run dev
```

Start the development server.

```bash
npm run build
```

Build the application and run the project database migration step.

```bash
npm run build:dev
```

Create a development-mode production build.

```bash
npm run preview
```

Start the Vite preview server.

```bash
npm run preview:restart
```

Restart the project's preview helper.

```bash
npm run preview:stop
```

Stop the preview helper.

```bash
npm run typecheck
```

Run the TypeScript compiler without emitting files.

```bash
npm run check:auth
```

Run the authentication invariant checks used by the project.

```bash
npm test
```

Run the project's automated tests.

```bash
npm run lint
```

Run ESLint.

```bash
npm run format
```

Format the project with Prettier.

## Network access

Because Vite is configured for:

```text
0.0.0.0:8080
```

the application can be accessed from another device on the same LAN using the development machine's IP address.

For example:

```text
http://192.168.1.100:8080
```

Replace the address with the actual IP of the host running Stereoscope.

Make sure the machine firewall allows TCP port 8080.

## Configuration and environment

The project includes application environment handling through:

```text
.grok/app-env.json
```

Do not commit secrets, API keys, private tokens, or other sensitive values.

Use environment-specific configuration files or environment variables for deployment secrets as appropriate.

## Production build

Create a production build:

```bash
npm run build
```

Then use the project's supported deployment/preview workflow.

The Vite configuration integrates:

- TanStack Start
- Nitro
- PGlite bootstrap
- authentication popup handling
- PWA support
- Tailwind CSS
- React

Do not remove or bypass these plugins without understanding their role in the application.

## Troubleshooting

### `npm: command not found`

Install Node.js and npm, then verify:

```bash
node --version
npm --version
```

### `vite: command not found`

Install the project dependencies:

```bash
npm ci
```

Then verify:

```bash
./node_modules/.bin/vite --version
```

### Vite crashes with `Segmentation fault` in a UTM Linux guest

If the project is running from a UTM 9p shared folder, move the working project to the Linux guest's local filesystem and reinstall dependencies:

```bash
cp -a /mnt/utm/anaglyph-player ~/anaglyph-player
cd ~/anaglyph-player
rm -rf node_modules
npm ci
npm run dev
```

This avoids executing native Node dependencies directly from the shared filesystem.

### Port 8080 already in use

Check:

```bash
lsof -i :8080
```

Stop the conflicting process or use the project's existing startup helper.

### Video does not play

Confirm that the browser can play the original file directly.

For best compatibility, test with a common browser-supported format such as H.264/AAC in MP4.

### Conversion does not start

Check that:

- a local video is loaded
- the browser supports `MediaRecorder`
- the browser supports canvas capture
- the browser can play the source media

Open browser developer tools and inspect the Console for the specific export error.

## Development notes

Keep changes isolated and incremental.

The player, renderer, shader pipeline, settings store, and export system are separate pieces. When adding functionality, prefer introducing a new module/component and a small integration point rather than rewriting the existing rendering or playback pipeline.

In particular, preserve the movie-only fullscreen behavior: fullscreen is intentionally scoped to the movie stage rather than the entire application shell.

## Git

Recommended initial Git setup:

```bash
git init
git add .
git commit -m "Initial commit"
```

Then connect the repository to GitHub:

```bash
git remote add origin git@github.com:<username>/<repository>.git
git branch -M main
git push -u origin main
```

Before the first commit, verify that generated/dependency directories are ignored:

```text
node_modules/
dist/
.vite/
*.log
.DS_Store
.env
.env.*
```

Also review `.grok/app-env.json` before committing it if it contains environment-specific or sensitive values.

## License

No license is declared by this README. Add the appropriate license file and update this section if the project is released publicly.

## Status

Stereoscope is an actively developed browser-based stereoscopic video player. Features and implementation details may evolve as the rendering, playback, export, and deployment workflows are improved.
