#!/bin/sh

CONFIG_FILE="/usr/share/nginx/html/config.js"

# Ensure the file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "config.js not found at $CONFIG_FILE"
  exit 1
fi

# Replace placeholders using / delimiter (Alpine-compatible)
sed -i "s|REPLACE_BASE_URL|${VITE_BASE_URL}|g" "$CONFIG_FILE"
sed -i "s|REPLACE_BASE_API_VERSION|${VITE_BASE_API_VERSION}|g" "$CONFIG_FILE"
sed -i "s|REPLACE_STRAPI_API_URL|${VITE_STRAPI_API_URL}|g" "$CONFIG_FILE"
sed -i "s|REPLACE_SITE_URL|${VITE_SITE_URL}|g" "$CONFIG_FILE"

# Start Nginx
exec "$@"