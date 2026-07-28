#!/usr/bin/env bash

set -e

cd game-engine/

if [ "$(git branch --show-current)" != "master" ]; then
    echo "Error: You must be on the master branch"
    exit 1
fi

git pull

echo "restarting game-engine"

sudo systemctl daemon-reload
sudo systemctl restart game-engine
sudo systemctl status game-engine
