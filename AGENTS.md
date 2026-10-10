# Repository Guide for Agents

As an agent, please update this file if you notice anything is not correct.
Also update it if you learn anything new which would be useful for yourself to add here.

Before you write your own code, look at all files to see if there is any files you can reuse.

## Project purpose and shape

This repository is a JavaScript ES module browser game and app project with its own source generator, live development watcher, and Node backend. The game design document lives in the separate [sapmi-game repository](https://github.com/kristus123/sapmi-game). The browser currently starts `Livestream()` from `frontend/index.js`; other apps in `frontend/apps/` are present and may be experimental or selectively enabled.

Keep changes in their owning source area:

- `frontend/` contains the browser app entry point, canvas/game engine primitives, UI and CSS, app experiments, and image/audio/Aseprite assets. `frontend/tools/game/` covers drawing, input, physics, positions, pathfinding, quests, and startup/assets. `frontend/tools/network/` and `frontend/tools/core/` cover networking, media, audio, device access, storage, and utilities. `frontend/apps/` holds app/game experiences such as canvas game, RPG/Sámi game, livestream, language practice, code editor, and baby games.
- `backend/` contains the HTTP server/routes/endpoints, WebSocket server, mediasoup SFU/RTC services, token helpers, and integrations.
- `shared/` contains code generated for and used by both browser and backend. Changes here can affect both runtimes.
- `dev/` contains the custom file watcher, generators, source transpiler, automatic import resolution, Aseprite conversion, and build helpers. Treat its assumptions as part of the project architecture.
- `scripts/` and `prod/` contain lint/build/deployment/maintenance utilities. Inspect a script before running it: some change files, contact external services, deploy, or act on a production server.
- `documentation/` contains coding, setup, Aseprite, Capacitor, and VPS notes. Several deployment notes are host-specific and should be treated as examples, not portable defaults.
- Root files such as `Paths.js`, `AllImports.js`, `watch.js`, and `start.js` are part of the build/runtime pipeline.

## Runtime and module architecture

The project has two related but different runtime paths:

- In development, `watch.js` writes the ignored `AllImports.js`, checks source filenames, clears `dist/`, and starts a polling watcher over `shared/`, `frontend/`, and `backend/`. The watcher polls every 50 ms and reacts only to `.js`, `.aseprite`, `.html`, `.css`, and `.md` changes. Changes are grouped with a 100 ms debounce. Once a change is detected, the watcher stops the backend, completes the required frontend, external bundle, Aseprite, and backend generation, then starts the backend with a new ID. Frontend-only changes skip backend generation; backend-only changes skip frontend and external bundle generation; shared changes rebuild both. The backend reports `ready: true` from `/ping` only after its HTTP, SFU, and WebSocket services are initialized. The browser waits for that signal before opening or reopening its WebSocket, then checks the backend ID and reloads if it changed. The initial build finishes frontend, Aseprite, external bundle, and backend generation before serving `dist/` on port `5050` and starting the backend on port `3000`.
- In production, `node dev/GenerateFrontend.js PRODUCTION` builds the static browser output and `node start.js PRODUCTION` generates and starts the backend. `start.js` does not start the static frontend server; production hosting/deployment is handled separately.

`watch.js` calls `Swoo.killPorts()` before startup. That runs `scripts/kill_ports.sh`, which force-kills processes listening on ports `3000` and `5050` when `lsof` is available. Account for that side effect before starting the watcher on a machine with services already using those ports.

Frontend startup is coordinated in `frontend/index.js`: it imports the enhancement runtime from `frontend/index.html`, loads generated HTML components, CSS, fonts, and catalogued image/audio/Aseprite assets, then invokes `Livestream()`. The canvas game loop is in `frontend/CanvasLoop.js`; game systems under `frontend/tools/game/` provide input, camera, drawing layers, physics, positions, entities, quests, and sprite/asset loading. `frontend/ui/html/` builds DOM elements and `frontend/ui/page/` provides simple page switching. Other `frontend/apps/` modules are opt-in experiments/apps; they are not automatically launched by the entry point.

Hyphenated HTML templates are registered by `frontend/ui/html/custom/RegisterCustomWebComponent.js`. A paired module can return `onConnected`, `onDisconnected`, `onDestroy`, and `neverDestroy`. Removed components call `onDestroy` and clear their children by default; `neverDestroy: true` keeps their state for reconnection. `Page.init()` sets this option for cached pages. Calling `element.destroy()` explicitly always destroys the component. The host dispatches `component-connected`, `component-disconnected`, and `component-destroyed` events; listen on the element for disconnect/destroy events, which dispatch after it leaves its parent. `destroy()` is asynchronous and can be awaited.

The custom source pipeline is important when changing JavaScript:

- `dev/GenerateFrontend.js` copies `frontend/` into `dist/`, runs `dev/Transpiler.js`, concatenates all frontend CSS into `dist/swag.css`, and generates `AssetPaths.js` data from HTML/Markdown, images, audio, and Aseprite filenames. `dev/ExportAseprite.js` stores generated files under the ignored `.cache/aseprite/<basename>/`, regenerates them only when one of the expected cached outputs is missing or older than its source, then copies them to `dist/generatedAseprite/<basename>/`.
- `dev/Transpiler.js` is source rewriting, not just syntax transpilation. It infers imports by scanning identifiers, adds `SuperClass` inheritance to exported classes, rewrites constructor-style factory calls, inserts null checks and constructor parameter assignments, rewrites `if`/`switch` syntax, and substitutes `ENVIRONMENT`. Keep `if (...) {` headers on one source line; the `if` rewriter cannot parse multiline conditions such as an object-literal call inside the condition. Inspect the source and generated output when a change depends on any of those behaviors. Add `// no-null-check` to each function signature that intentionally accepts `null` or `undefined`; annotating a caller does not disable checks inserted in a nullable helper it calls. `// disable-transpiling` opts a JavaScript file out of those source transformations.
- `dev/GenerateBackend.js` copies `shared/` into `transpiledBackend/shared/`, substitutes the environment, and adds inferred imports to generated backend files. Backend JavaScript also passes through the shared transpiler transformations used by the frontend, including class inheritance/constructor handling, null checks, constructor-style factory rewrites, and `if`/`switch` rewrites. Shared source files receive environment substitution and inferred imports but are not otherwise transpiled.
- `frontend/index.html` supplies the `#root/` browser import map. `package.json` supplies the matching `#root/*` mapping for Node. `AllImports.js` is a separate generated lazy-import index; never edit it by hand.
- HTML/Markdown templates are collected by basename. Hyphenated HTML files are emitted as custom web components, with an optional same-basename JS module. CSS is concatenated rather than imported one stylesheet at a time.

Backend HTTP and WebSocket share the Node HTTP server on port `3000`. `backend/StartServer.js` enhances built-in prototypes, imports endpoint modules to register handlers on `AdminRoute`, `UserRoute`, or `UnsecureRoute`, starts `HttpServer`, starts mediasoup (`SfuServer`), and attaches `SocketServer` to the HTTP server. HTTP POST route names map to those handler registries; WebSocket messages dispatch by `action`. Coordinate client action/payload changes with `frontend/tools/network/`. The mediasoup signaling server is in `backend/rtc/`, with its client-side peer/router handling in `frontend/tools/network/multiplayer/rtc/`.

WebSocket messages use an envelope with `data` for the application payload and `metaHeaders` for message metadata. Clients pass the complete encoded token as the `token` query parameter when connecting; `SocketServer` validates it with `ShaToken.decode()` and derives the socket identity from the signed `internal.userId`. Use `originUserId`, `targetUserId`, and `targetUserIds` for message routing, and `userIds` in `UPDATE_USERS_LIST` payloads. The server derives sender identity from the authenticated socket rather than trusting client-supplied metadata. Multiple sockets for one user share a user ID and user-directed messages are delivered to each of that user's connected sockets.

`shared/` is built for both browser and backend, but each runtime initializes a different set of prototype enhancements: `frontend/index.html` loads `shared/enhance/EnhanceAll.js`, while `backend/StartServer.js` calls `EnhanceBackend()`. Put genuinely cross-runtime code in `shared/` and check that it uses APIs available in both environments.

## Main app areas

- `frontend/tools/game/`: canvas engine primitives and game systems. `frontend/apps/canvas_game/CanvasGame.js` is a selectively started experience; the Sámi RPG under `frontend/apps/rpg_sami_game/` is another selectively started experience, and its game design document is maintained in the separate `sapmi-game` repository.
- `frontend/apps/livestream/`: browser recording/device-selection and stream UI; `SwappableMediaStream` sends one selected microphone through Web Audio before `MediaRecorder`. `Stream.setAudioDevice()` selects the active input, and `Stream.clearAudioDevice()` mutes it. The selection controls are in `ui/streamer/streamer-page.js`; radio inputs use the native `change` event because the `OnChange` enhancement only supports checkboxes. `backend/http/endpoints/hls/` accepts WebM chunks and uses FFmpeg to produce HLS output under ignored `public_folder/hls/`. `HlsVideo.start()` is asynchronous: await it so startup failures reach the viewer's retry handling. It loads hls.js from jsDelivr and uses `playingDate` to report the actual playing segment's UTC; native HLS remains a fallback using `HTMLMediaElement.getStartDate()` or `HlsPlaylist` program-date-time metadata plus a seekable live edge. Chrome's native live HLS can play with an empty `seekable` range and no `getStartDate()`, so native playback support alone does not guarantee UTC reporting. Do not substitute `buffered.end()` for the live edge: buffered footage can lag behind the latest playlist. Media errors clear the player so the online poll can retry. This flow is distinct from the mediasoup SFU used for live WebRTC calls/rooms.
- Livestream viewer arrows call `HlsVideo.seekBy()` for 30-second jumps. `getSeekTarget()` clamps to the video's `seekable` ranges, avoids gaps and the exact live edge, and returns `null` when movement is unavailable; the viewer uses this to disable buttons. Seeking updates the displayed playback UTC, including on `seeked`.
- `frontend/apps/practice_language/`, `frontend/apps/code_editor/`, and `frontend/apps/baby_game/`: standalone browser app experiments with their own template files. `frontend/apps/baby_game/` includes small game prototypes and local image/audio assets.
- `frontend/tools/core/`: audio, browser device/media access, IndexedDB, and worker helpers. `frontend/tools/network/`: HTTP/token/persisted-data helpers, WebSocket multiplayer, lobby utilities, and RTC clients.

## Generated and local-only files

`dist/` is generated browser output and `transpiledBackend/` is generated backend output; both are ignored by Git. Do not hand-edit them. Change source under `frontend/`, `shared/`, or `backend/`, then regenerate through the appropriate workflow. `AllImports.js` is generated at watcher startup from named exports. Do not edit it manually; duplicate exported names across modules make generation fail.

`Secrets.js` is gitignored local configuration. Never print, copy, or commit its contents. Keep credentials, tokens, private keys, and machine-specific paths out of tracked files and documentation. `ServerConfig.shaSecret` uses `CHANGE_ME` in development and reads `Secrets.shaSecret` in production, so the local ignored `Secrets.js` must define that field. Keep the production secret in backend source and out of shared source and browser output.

Generated output depends on project-wide filename rules. The watcher checks for duplicate basenames across `backend/`, `frontend/`, and `shared/` (including non-JS assets), and checks frontend/backend/dev JavaScript basenames against reserved words and browser/JavaScript globals. Preserve these constraints when adding or renaming files. HTML and Markdown basenames also need to be unique because they become runtime template keys.

## Runtime and build workflows

Requires Node.js and npm. Install dependencies with `npm install`.

- `npm run dev` and `npm start` run `node watch.js`. The watcher regenerates `AllImports.js`, validates names, clears and rebuilds `dist/`, exports Aseprite assets, prepares the external bundle, serves the browser app on port `5050`, and starts the generated backend. On source changes it marks the backend unavailable, finishes the required generated outputs, then starts the backend; `/ping` reports readiness only after HTTP, SFU, and WebSocket startup. The browser waits for readiness before reconnecting. Backend code is transpiled into `transpiledBackend/`; the dev backend uses `DEVELOPMENT` configuration.
- Ctrl-C in the development watcher stops its backend/build children, watcher interval, and static server. The backend closes active FFmpeg, mediasoup, WebSocket, and HTTP resources before exiting.
- Start and manually test the project with `npm run dev`. For browser checks, always use the Chrome DevTools MCP backed by headless Chrome; this machine blocks regular Chrome windows from opening.
- Open `http://localhost:5050` for the browser app. The HTTP and WebSocket backend listens on port `3000`; the browser's development configuration connects there. SFU media transport also uses the configured mediasoup ports/network settings.
- `npm run startInspect` starts the watcher with Node inspector enabled.
- `node dev/GenerateFrontend.js PRODUCTION` generates production browser files in `dist/`; `PRODUCTION` or `DEVELOPMENT` must be passed because the transpiler substitutes the `ENVIRONMENT` marker.
- Use the Chrome DevTools MCP backed by headless Chrome for manual frontend checks; do not launch a regular Chrome window on this machine.
- When checking several tabs after a rebuild, reload each tab explicitly. The backend ID is stored in shared local storage; one tab can update it before another receives the reload message, leaving that other tab with cached modules.
- `node dev/ExportAseprite.js` exports `.aseprite` sources into generated browser assets under `dist/generatedAseprite/`. This requires Aseprite to be installed/configured; see `documentation/aseprite/`.
- `node start.js PRODUCTION` generates the backend into `transpiledBackend/` and launches it. In deployment, `Config` selects production HTTP, WebSocket, and mediasoup announce settings.
- `scripts/deploy_dist_to_netlify.sh` and `scripts/deploy_language_app.sh` generate a production frontend and deploy it with Netlify CLI. These publish externally; only run when deployment is explicitly intended. `scripts/deploy_server.sh` also runs remote SSH deployment operations.

`dist/` and `transpiledBackend/` are ignored and may need to be generated before inspecting runtime output. `AllImports.js` is generated as a lazy-import table keyed by JS filename basename; the lazy loader expects a named export with that same name. The filename assertions enforce basename uniqueness in backend/frontend/shared, not uniqueness of arbitrary export names. The legacy root `test.js` is a standalone esbuild utility that expects a built `dist/`; there is no configured `npm test` script or standard test framework. `scripts/test.js` provisions a Capacitor Android project, removes/recreates `capacitor_setup/`, uses dependencies and machine-specific Android paths, and is not a unit-test command.

## Source transformation and module conventions

Read [documentation/coding_convention.md](documentation/coding_convention.md) before changing modules. The current conventions are unusual and enforced partly by custom generation:

- Use named exports; avoid `export default`. A module should generally export one item whose name matches its filename. `AllImports.js` requires exported names to be globally unique.
- The project auto-inserts imports by scanning identifiers. Follow nearby files and avoid adding explicit imports in generated client code unless the specific module/pipeline requires them. `frontend/index.html` uses the `#root/` import map, and `package.json` maps `#root/*` to the repository root for Node.
- The frontend and backend generators share the same transpiler transformations for their respective JavaScript source files. These add inferred imports, class inheritance/constructor behavior, null checks, and control-flow rewrites. Shared source files are not otherwise transpiled. A change can fail or behave differently after transformation even if its source parses; inspect generated output or use the normal dev workflow when appropriate.
- The convention says to use tabs; follow nearby code. JavaScript lint rules are in `.eslintrc.json`, CSS rules in `stylelint.config.js`, and HTML formatting in `.prettierrc`.
- Keep class/module filenames in descriptive PascalCase where that matches the neighboring subsystem. Use globally unique basenames because automatic imports and filename assertions depend on them.
- HTML and Markdown files under `frontend/` are collected into runtime templates; hyphenated HTML files are treated as custom web components. Images/audio and Aseprite assets are cataloged during frontend generation, so names and locations can be significant.

## Subsystem notes

- Frontend network clients use `shared/Config.js` for HTTP/WebSocket URLs. Development points to `localhost:3000` and advertises mediasoup at `127.0.0.1`; production uses `krispetter.duckdns.org`. Local development does not depend on a Cloudflare tunnel.
- `Network`'s initial HTTP check runs from `frontend/index.js` after module imports resolve. Do not call `JsonHttpClient` from `Network`'s static initializer: `LowLevelHttpClient` depends back on `Network`, so doing so can hit the ESM temporal dead zone during startup.
- Frontend startup must finish `Token.init()` before calling `SocketClient.connect()`. Socket open and first-message handlers read `Token.decoded.internal.userId`, so starting both together can race against token initialization.
- Backend HTTP endpoints are registered by importing generated endpoint modules during `StartServer`; endpoint behavior and route conventions are implemented in `backend/http/` and `backend/http/server/`.
- WebSocket actions are registered by action name through `SocketServer.on`; coordinate action names and payloads with the corresponding client under `frontend/tools/network/`.
- Livestream and RTC code spans `frontend/apps/livestream/`, frontend multiplayer RTC clients, and `backend/rtc/`; changes may need coordinated client/server updates.
- `shared/chaos/ChaosMonkey.js` owns the valid chaos feature strings. Pass a feature string in each options object; unknown strings throw. `Retry` accepts an optional feature and capped exponential backoff settings, so scoped chaos can exercise a specific retry path.
- Aseprite source files are stored below `frontend/`; the build exports tags, groups, layers, and tilemap metadata for browser loading. Generated source outputs are cached in `.cache/aseprite/` and copied into `dist/` for the browser build.
- `dist` static serving sets cross-origin isolation headers for `SharedArrayBuffer`/worker use. Preserve the equivalent headers in hosting configuration when changing deployment behavior.

## Checks and editing guidance

There is no standard automated test suite or `npm test` script. `scripts/check.sh` compares generated JS and bundle byte sizes; it is not a correctness test. Choose the smallest relevant verification for the change: run the dev watcher and inspect the browser/backend behavior, generate production output if changing generation, or run a focused utility. Do not assume `npm test` exists.

`./scripts/lint.sh` is an in-place fixer, not a read-only check. It rewrites equality operators, CSS, generated ESLint globals, indentation, JavaScript, and HTML across the repository. Review its diff carefully and avoid running it casually over unrelated work. The script may run `npx` commands and can need network access if dependencies are unavailable. `dev/UpdateEslint.js` regenerates globals based on filenames across source folders.

Before editing, inspect nearby modules and current Git changes. Do not overwrite unrelated user changes. Avoid running deployment, PR, remote SSH, port-killing, cleanup, or project-provisioning scripts unless that exact side effect is part of the requested task.

## Documentation references

- `documentation/coding_convention.md`: module and import conventions.
- `documentation/README.md`: local setup, Aseprite, and deployment entry points (some commands there predate the current `scripts/` layout).
- `documentation/aseprite/`: installing/configuring the Aseprite CLI used by asset export.
- `documentation/capacitor/`: experimental Android packaging workflow.
- `documentation/vps/`: deployment/server setup notes with host-specific examples.
