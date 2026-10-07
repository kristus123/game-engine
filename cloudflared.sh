#!/bin/bash

while true; do
	cloudflared tunnel --loglevel debug run test
	sleep 2
done
