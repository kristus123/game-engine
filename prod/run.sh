#!/usr/bin/env bash

set -e

HOST=kristian@krispetter.duckdns.org

COMMAND="$1"

if [ -z "$COMMAND" ]; then
    echo "Usage: $0 <command>"
    exit 1
fi

SCRIPT="$(dirname "$0")/$COMMAND.sh"

if [ ! -f "$SCRIPT" ]; then
    echo "Missing script: $SCRIPT"
    exit 1
fi

echo "Connecting to remote server"

ssh "$HOST" 'bash -s' < "$SCRIPT"

echo "finished executing script"
