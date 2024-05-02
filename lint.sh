#!/bin/bash

clear

node build_tools/update_eslint.js

npx eslint . --fix
