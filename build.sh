#!/bin/bash
set -e

echo "Setting permissions for Vite..."
chmod +x node_modules/.bin/vite 2>/dev/null || true

echo "Running Vite build..."
npx vite build

echo "Build completed successfully!"