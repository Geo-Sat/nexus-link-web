#!/bin/sh

# Create a config file that will be loaded by your app
CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "window.env = {" > $CONFIG_FILE
echo "  VITE_API_BASE_URL: \"${VITE_API_BASE_URL}\"," >> $CONFIG_FILE
echo "  VITE_WS_BASE_URL: \"${VITE_WS_BASE_URL}\"" >> $CONFIG_FILE
echo "};" >> $CONFIG_FILE

# Also replace placeholders in built files if needed
if [ -n "$VITE_API_BASE_URL" ]; then
    find /usr/share/nginx/html -name '*.js' -exec sed -i "s|__VITE_API_BASE_URL__|${VITE_API_BASE_URL}|g" {} \;
fi

if [ -n "$VITE_WS_BASE_URL" ]; then
    find /usr/share/nginx/html -name '*.js' -exec sed -i "s|__VITE_WS_BASE_URL__|${VITE_WS_BASE_URL}|g" {} \;
fi