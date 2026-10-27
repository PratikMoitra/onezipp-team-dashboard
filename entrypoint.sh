#!/bin/sh
# Refuse to start unless login credentials are provided via env (never baked into the image).
set -eu
if [ -z "${DASH_USER:-}" ] || [ -z "${DASH_PASS_HASH:-}" ]; then
  echo "FATAL: DASH_USER and DASH_PASS_HASH must be set (bcrypt hash). Refusing to start." >&2
  exit 1
fi
case "$DASH_PASS_HASH" in
  '$2a$'*|'$2b$'*|'$2y$'*) ;;
  *) echo "FATAL: DASH_PASS_HASH is not a bcrypt hash. Refusing to start." >&2; exit 1 ;;
esac
exec caddy run --config "${CADDYFILE:-/etc/caddy/Caddyfile}" --adapter caddyfile
