#!/bin/bash

set -e

ssh kristian@krispetter.duckdns.org "

cd game-engine/

git checkout master
git pull

npm install

kill $(cat game_engine.pid) || true

git pull
npm install

nohup node start.js > app.log 2>&1 & echo $! > game_engine.pid
"
