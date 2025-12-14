#!/bin/bash

# Remove all console.log and console.debug statements from source files
# Keep console.error and console.warn as they're useful for production

echo "Removing console.log and console.debug statements..."

# Find all TypeScript, TSX, and Astro files
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.astro" \) | while read -r file; do
  if grep -q "console\.log\|console\.debug" "$file"; then
    # Remove entire lines containing console.log or console.debug
    sed -i '/^\s*console\.log(/d; /^\s*console\.debug(/d' "$file"
    echo "✓ Cleaned: $file"
  fi
done

echo "Done!"
