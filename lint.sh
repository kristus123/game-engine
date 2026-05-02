#!/bin/bash

clear
echo "linting project"

npx -y stylelint "**/*.css" "./*.css" --fix

node dev/build_tools/UpdateEslint.js

find . -name "*.js" -type f -exec sed -i 's/^\(\s*\)    /\1\t/g' {} +

npx -y eslint . --fix --cache

npx -y prettier "**/*.html" --write
