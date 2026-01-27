#!/usr/bin/env bash

set -e

# Check arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <oldName> <newName>"
  exit 1
fi

OLD_NAME="$1"
NEW_NAME="$2"

# Convert to PascalCase for filenames
# Example: otherClient -> OtherClient
OLD_FILE_NAME="$(echo "${OLD_NAME:0:1}" | tr '[:lower:]' '[:upper:]')${OLD_NAME:1}.js"
NEW_FILE_NAME="$(echo "${NEW_NAME:0:1}" | tr '[:lower:]' '[:upper:]')${NEW_NAME:1}.js"

# 1. Rename the file if it exists
if [ -f "$OLD_FILE_NAME" ]; then
  mv "$OLD_FILE_NAME" "$NEW_FILE_NAME"
  echo "Renamed file: $OLD_FILE_NAME → $NEW_FILE_NAME"
fi

# 2. Replace exact matches in source files (ignore node_modules)
find . \
  -type d -name node_modules -prune -o \
  -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) \
  -print0 |
xargs -0 sed -i '' -E "s/\\b${OLD_NAME}\\b/${NEW_NAME}/g"

echo "Updated references: $OLD_NAME → $NEW_NAME"
