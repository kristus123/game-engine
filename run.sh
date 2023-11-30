#!/bin/sh

concurrently "./nodemon.sh" "reload -d dist/ -p 5000"
