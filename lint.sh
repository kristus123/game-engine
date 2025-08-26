#!/bin/bash

clear

node build_tools/update_eslint.js


find . -name "*.js" -type f -exec sed -i 's/^\(\s*\)    /\1\t/g' {} +

npx eslint . --fix
