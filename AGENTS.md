# Repository Guide for Agents

## Project purpose and shape

This repository is a JavaScript ES module browser game and app project with its own source generator, live development watcher, and Node backend. The game design document lives in the separate [sapmi-game repository](https://github.com/kristus123/sapmi-game). The browser currently starts `CanvasGame()` from `frontend/index.js`; other apps in `frontend/apps/` are present and may be experimental or selectively enabled.

Keep changes in their owning source area:

- `frontend/` contains the browser app entry point, canvas/game engine primitives, UI and CSS, app experiments, and image/audio/Aseprite assets. `frontend/tools/game/` covers drawing, input, physics, positions, pathfinding, quests, and startup/assets. `frontend/tools/network/` and `frontend/tools/core/` cover networking, media, audio, device access, storage, and utilities. `frontend/apps/` holds app/game experiences such as canvas game, RPG/Sámi game, livestream, language practice, code editor, and baby games.
- `backend/` contains the HTTP server/routes/endpoints, WebSocket server, mediasoup SFU/RTC services, token helpers, and integrations.
- `shared/` contains code generated for and used by both browser and backend. Changes here can affect both runtimes.
- `dev/` contains the custom file watcher, generators, source transpiler, automatic import resolution, Aseprite conversion, and build helpers. Treat its assumptions as part of the project architecture.
- `scripts/` and `prod/` contain lint/build/deployment/maintenance utilities. Inspect a script before running it: some change files, contact external services, deploy, or act on a production server.
- `documentation/` contains coding, setup, Aseprite, Capacitor, and VPS notes. Several deployment notes are host-specific and should be treated as examples, not portable defaults.
- Root files such as `Paths.js`, `AllImports.js`, `watch.js`, and `start.js` are part of the build/runtime pipeline.

## Generated and local-only files

`dist/` is generated browser output and `transpiledBackend/` is generated backend output; both are ignored by Git. Do not hand-edit them. Change source under `frontend/`, `shared/`, or `backend/`, then regenerate through the appropriate workflow. `AllImports.js` is generated at watcher startup from named exports. Do not edit it manually; duplicate exported names across modules make generation fail.

`Secrets.js` is gitignored local configuration. Never print, copy, or commit its contents. Keep credentials, tokens, private keys, and machine-specific paths out of tracked files and documentation. The current backend startup also contains a hard-coded placeholder token secret in source; do not treat that placeholder as secure production configuration.

Generated output depends on project-wide filename rules. The watcher checks for duplicate filenames (including non-JS assets) across `backend/`, `frontend/`, and `shared/`, and disallows reserved JavaScript keywords as filenames. Preserve these constraints when adding or renaming files.

## Runtime and build workflows

Requires Node.js and npm. Install dependencies with `npm install`.

- `npm run dev` and `npm start` run `node watch.js`. The watcher regenerates `AllImports.js`, validates names, clears and rebuilds `dist/`, exports Aseprite assets, prepares the external bundle, serves the browser app on port `5050`, and starts/restarts the generated backend. Source changes in `frontend/`, `backend/`, or `shared/` trigger rebuilds; backend code is transpiled into `transpiledBackend/` and restarted. The dev backend uses `DEVELOPMENT` configuration.
- Open `http://localhost:5050` for the browser app. The HTTP and WebSocket backend listens on port `3000`; the browser's development configuration connects there. SFU media transport also uses the configured mediasoup ports/network settings.
- `npm run startInspect` starts the watcher with Node inspector enabled.
- `node dev/GenerateFrontend.js PRODUCTION` generates production browser files in `dist/`; `PRODUCTION` or `DEVELOPMENT` must be passed because the transpiler substitutes the `ENVIRONMENT` marker.
- `node dev/ExportAseprite.js` exports `.aseprite` sources into generated browser assets under `dist/generatedAseprite/`. This requires Aseprite to be installed/configured; see `documentation/aseprite/`.
- `node start.js PRODUCTION` generates the backend into `transpiledBackend/` and launches it. In deployment, `Config` selects production HTTP, WebSocket, and mediasoup announce settings.
- `scripts/deploy_dist_to_netlify.sh` and `scripts/deploy_language_app.sh` generate a production frontend and deploy it with Netlify CLI. These publish externally; only run when deployment is explicitly intended. `scripts/deploy_server.sh` also runs remote SSH deployment operations.

`dist/` and `transpiledBackend/` are ignored and may need to be generated before inspecting runtime output. The legacy `test.js` is a standalone esbuild utility that expects a built `dist/`; there is no configured `npm test` script or standard test framework. `scripts/test.js` provisions a Capacitor Android project, removes/recreates `capacitor_setup/`, uses dependencies and machine-specific Android paths, and is not a unit-test command.

## Source transformation and module conventions

Read [documentation/coding_convention.md](documentation/coding_convention.md) before changing modules. The current conventions are unusual and enforced partly by custom generation:

- Use named exports; avoid `export default`. A module should generally export one item whose name matches its filename. `AllImports.js` requires exported names to be globally unique.
- The project auto-inserts imports by scanning identifiers. Follow nearby files and avoid adding explicit imports in generated client code unless the specific module/pipeline requires them. `frontend/index.html` uses the `#root/` import map, and `package.json` maps `#root/*` to the repository root for Node.
- The frontend transpiler adds inferred imports, class inheritance/constructor behavior, null checks, and control-flow rewrites. It transforms frontend source into `dist/`. Backend generation copies `backend/` plus generated `shared/` into `transpiledBackend/` and infers imports. A change can fail or behave differently after transformation even if its source parses; inspect generated output or use the normal dev workflow when appropriate.
- The convention says to use tabs; follow nearby code. JavaScript lint rules are in `.eslintrc.json`, CSS rules in `stylelint.config.js`, and HTML formatting in `.prettierrc`.
- Keep class/module filenames in descriptive PascalCase where that matches the neighboring subsystem. Use globally unique basenames because automatic imports and filename assertions depend on them.
- HTML and Markdown files under `frontend/` are collected into runtime templates; hyphenated HTML files are treated as custom web components. Images/audio and Aseprite assets are cataloged during frontend generation, so names and locations can be significant.

## Subsystem notes

- Frontend network clients use `shared/Config.js` for HTTP/WebSocket URLs. Keep development/production environment behavior aligned when changing routes or connection logic.
- Backend HTTP endpoints are registered by importing generated endpoint modules during `StartServer`; endpoint behavior and route conventions are implemented in `backend/http/` and `backend/http/server/`.
- WebSocket actions are registered by action name through `SocketServer.on`; coordinate action names and payloads with the corresponding client under `frontend/tools/network/`.
- Livestream and RTC code spans `frontend/apps/livestream/`, frontend multiplayer RTC clients, and `backend/rtc/`; changes may need coordinated client/server updates.
- Aseprite source files are stored below `frontend/`; the build exports tags, groups, layers, and tilemap metadata for browser loading.
- `dist` static serving sets cross-origin isolation headers for `SharedArrayBuffer`/worker use. Preserve the equivalent headers in hosting configuration when changing deployment behavior.

## Checks and editing guidance

There is no standard automated test suite. Choose the smallest relevant verification for the change: run the dev watcher and inspect the browser/backend behavior, generate production output if changing generation, or run a focused utility. Do not assume `npm test` exists.

`./scripts/lint.sh` is an in-place fixer, not a read-only check. It rewrites equality operators, CSS, generated ESLint globals, indentation, JavaScript, and HTML across the repository. Review its diff carefully and avoid running it casually over unrelated work. The script may run `npx` commands and can need network access if dependencies are unavailable. `dev/UpdateEslint.js` regenerates globals based on filenames across source folders.

Before editing, inspect nearby modules and current Git changes. Do not overwrite unrelated user changes. Avoid running deployment, PR, remote SSH, port-killing, cleanup, or project-provisioning scripts unless that exact side effect is part of the requested task.

## Documentation references

- `documentation/coding_convention.md`: module and import conventions.
- `documentation/README.md`: local setup, Aseprite, and deployment entry points (some commands there predate the current `scripts/` layout).
- `documentation/aseprite/`: installing/configuring the Aseprite CLI used by asset export.
- `documentation/capacitor/`: experimental Android packaging workflow.
- `documentation/vps/`: deployment/server setup notes with host-specific examples.
