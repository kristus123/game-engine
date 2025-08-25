#!/bin/bash

set -e

# Minify JavaScript files in place
find dist -type f -name '*.js' -exec npx terser {} --compress --mangle -o {} \;

# Minify CSS files in place
find dist -type f -name '*.css' -exec npx lightningcss --minify {} -o {} \;

# Minify HTML files in place
find dist -type f -name '*.html' -exec npx html-minifier-terser --collapse-whitespace --remove-comments -o {} {} \;
