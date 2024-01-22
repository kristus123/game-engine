#!/bin/bash

clear

source venv/bin/activate
node build_tools/update_eslint.js

npx eslint . --fix
