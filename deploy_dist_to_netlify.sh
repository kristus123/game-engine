#!/bin/bash

set -e

node build_tools/export_aseprite.js
node build_tools/generate_dist.js PRODUCTION


# Minify JavaScript files in place
find dist -type f -name '*.js' -exec npx --yes terser {} --compress --mangle -o {} \;

# Minify CSS files in place
find dist -type f -name '*.css' -exec npx --yes lightningcss --minify {} -o {} \;

# Minify HTML files in place
find dist -type f -name '*.html' -exec npx --yes html-minifier-terser --collapse-whitespace --remove-comments -o {} {} \;


# the id is 'romskip' aka romskip.netlify.app
netlify deploy --prod --dir=dist --site=30335998-1c5b-49e4-b97c-cb0f1f5b3893

rm -r .netlify
