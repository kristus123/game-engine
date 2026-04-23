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

Then open [http://localhost:5000]()

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
