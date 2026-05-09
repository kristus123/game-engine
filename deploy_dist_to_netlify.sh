#!/bin/bash

set -e

node build_tools/export_aseprite.js
node build_tools/generate_dist.js PRODUCTION

find dist -type f -name '*.js' -exec npx --yes terser {} --compress --mangle -o {} \;
find dist -type f -name '*.css' -exec npx --yes lightningcss --minify {} -o {} \;
find dist -type f -name '*.html' -exec npx --yes html-minifier-terser --collapse-whitespace --remove-comments -o {} {} \;


# needed in order to use shared array buffers between main and worker
cat > dist/netlify.toml <<EOF
[[headers]]
	for = "/*"
	[headers.values]
		Cross-Origin-Opener-Policy = "same-origin"
		Cross-Origin-Embedder-Policy = "require-corp"
EOF

# the id of 'romskip' aka. romskip.netlify.app
netlify deploy --prod --dir=dist --site=30335998-1c5b-49e4-b97c-cb0f1f5b3893

rm -r .netlify
