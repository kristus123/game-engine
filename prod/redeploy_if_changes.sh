#!/bin/bash

set -e

while true; do

	git fetch origin

	LOCAL=$(git rev-parse HEAD)
	REMOTE=$(git rev-parse @{u})

	if [ "$LOCAL" != "$REMOTE" ]; then
		echo "New changes found"
		echo "Redeploying"

		git pull --ff-only

		sudo systemctl restart game-engine.service

		echo "New changes detected"
		echo "Restarted game-engine.service"
	else
		echo "Already up to date. No action needed."
	fi

    sleep 5
done
