#!/bin/bash

set -e

git fetch origin

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "New changes found. Updating..."

    git pull --ff-only

    sudo systemctl restart game-engine.service

    echo "Restarted game-engine.service"
else
    echo "Already up to date."
fi
