#!/usr/bin/env bash

set -e

sudo journalctl -u game-engine.service -f
