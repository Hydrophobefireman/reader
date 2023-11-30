#!/usr/bin/env sh
caddy start --config=/Caddyfile
cd /app
node index.js