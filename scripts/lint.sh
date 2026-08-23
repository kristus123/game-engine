#!/bin/bash

clear

echo "linting project"

find . -path ./node_modules -prune -o -name "*.js" -type f -exec sed -i \
	-e 's/===/==/g' \
	-e 's/!==/!=/g' {} +

npx -y stylelint "**/*.css" "./*.css" --fix

node dev/UpdateEslint.js

find . -name "*.js" -type f -exec sed -i 's/^\(\s*\)    /\1\t/g' {} +

npx -y eslint . --fix --cache

npx -y prettier "**/*.html" --write
