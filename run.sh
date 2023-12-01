#!/usr/bin/env sh
caddy start --config=/Caddyfile
cd /app
node src/index.js