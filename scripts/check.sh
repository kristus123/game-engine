#!/bin/bash

source=$(find dist -name "*.js" -not -name "bundle.js" -print0 | xargs -0 cat | wc -c)
bundle=$(wc -c < dist/bundle.js)

difference=$((source - bundle))
percentage=$(awk "BEGIN { printf \"%.2f\", ($difference / $source) * 100 }")

echo "Source:     $(awk "BEGIN { printf \"%.2f KB\", $source / 1024 }")"
echo "Bundle:     $(awk "BEGIN { printf \"%.2f KB\", $bundle / 1024 }")"
echo "Saved:      $(awk "BEGIN { printf \"%.2f KB\", $difference / 1024 }") ($percentage%)"
