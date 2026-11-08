#!/bin/bash

set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

node dev/GenerateImports.js
rm -rf -- dist
node dev/GenerateFrontend.js PRODUCTION
node dev/ExportAseprite.js
node scripts/BuildExternalBundle.js

# find dist -type f -name '*.js' -exec npx --yes terser {} --compress --mangle -o {} \;
# find dist -type f -name '*.css' -exec npx --yes lightningcss --minify {} -o {} \;
# find dist -type f -name '*.html' -exec npx --yes html-minifier-terser --collapse-whitespace --remove-comments -o {} {} \;


# needed in order to use shared array buffers between main and worker threads
cat > dist/_headers <<EOF
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
EOF

# the id of 'romskip' aka. romskip.netlify.app
netlify deploy --prod --no-build --dir=dist --site=30335998-1c5b-49e4-b97c-cb0f1f5b3893
