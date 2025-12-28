#!/bin/bash

clear
echo "linting project"

node build_tools/update_eslint.js

find . -name "*.js" -type f -exec sed -i 's/^\(\s*\)    /\1\t/g' {} +

npx eslint . --fix

npx stylelint "**/*.css" --fix
