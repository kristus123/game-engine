#!/usr/bin/env bash

find client/ -type f -name "*.js" -print0 | while IFS= read -r -d '' file; do
  perl -pi -e 's/\b(if)\s*\(([^()]*)\)\s*\{/$1 $2 {/g' "$file"
done
