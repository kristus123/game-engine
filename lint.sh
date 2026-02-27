#!/bin/bash

clear
echo "linting project"

npx stylelint "**/*.css" "./*.css" --fix

node dev/build_tools/update_eslint.js

find . -name "*.js" -type f -exec sed -i 's/^\(\s*\)    /\1\t/g' {} +

npx eslint . --fix
