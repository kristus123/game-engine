# game-engine

## set up github cli tool

it's used for running `./pr.sh`:

```bash
sudo apt update -y && sudo apt install gh -y
gh auth login
```
## Install node

Simply install the newest version of Node.

## Install Aseprite

Look at `/documentation/aseprite`.

## Run project

```
npm install
```

```
npm run start
```

Then open [http://localhost:5050]()

## Control Chrome for browser checks

The project includes a small Chrome DevTools Protocol controller. It uses Chrome and Node.js directly, with no extra browser automation dependencies. Start the development server in one terminal, then use another:

```bash
npm run chrome -- start http://localhost:5050
npm run chrome -- status
npm run chrome -- eval 'document.title'
npm run chrome -- click 'button.start'
npm run chrome -- type '#name' 'Sámi Game'
npm run chrome -- screenshot /tmp/game-engine.png
npm run chrome -- reload
npm run chrome -- stop
```

Replace the sample selectors with elements present in the page. The controller launches a visible Chrome instance with an isolated profile in the system temp directory. That profile is reused across commands and kept separate from your regular Chrome profile. Browser console output is shown while a command is connected. Set `CHROME_PATH` if Chrome is installed outside its standard location. Node.js 22 or newer is required for the built-in WebSocket client.

## Run linter

```
./lint.sh
```

## Play anywhere

[Play game](https://romskip.netlify.app/)

## setup Netlify

```js
npm install -g netlify-cli
netlify login
```

When you want to deply, run:

```js
./deploy_dist_to_netlify.sh
```
