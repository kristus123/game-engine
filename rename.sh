#!/usr/bin/env bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <OldName> <NewName>"
  exit 1
fi

OLD_NAME="$1"
NEW_NAME="$2"

OLD_FILE_NAME="${OLD_NAME}.js"
NEW_FILE_NAME="${NEW_NAME}.js"

# Find file safely (ignore node_modules)
FOUND_FILE=$(find . \
  -type d -name node_modules -prune -false -o \
  -type f -name "$OLD_FILE_NAME" -print -quit)

echo "Looking for: $OLD_FILE_NAME"
echo "Found file: $FOUND_FILE"

if [ -n "$FOUND_FILE" ]; then
  DIR="$(dirname "$FOUND_FILE")"
  git mv "$FOUND_FILE" "$DIR/$NEW_FILE_NAME"
  echo "Renamed file:"
  echo "  $FOUND_FILE → $DIR/$NEW_FILE_NAME"
else
  echo "❌ No file found named $OLD_FILE_NAME"
fi

# Replace references (ignore node_modules)
find . \
  -type d -name node_modules -prune -false -o \
  -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) \
  -print0 |
xargs -0 sed -i -E "s/\\b${OLD_NAME}\\b/${NEW_NAME}/g"

echo "Updated references: $OLD_NAME → $NEW_NAME"
