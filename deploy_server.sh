#!/bin/bash

set -e

ssh kristian@krispetter.duckdns.org "

cd game-engine/

git checkout master
git pull

npm install

kill $(cat app.pid) || true

git pull
npm install

nohup node start.js > app.log 2>&1 & echo $! > /run/game_engine.pid
"
