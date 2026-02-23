#!/usr/bin/env sh
set -e

# If PORT is unset or literally "$PORT" (platform substitution issue), fall back to 8000
if [ -z "$PORT" ] || [ "$PORT" = "\$PORT" ]; then
	PORT=8000
fi

# Ensure PORT is an integer; otherwise default to 8000
case "$PORT" in
	''|*[!0-9]*)
		PORT=8000
		;;
esac

exec uvicorn APP.main:app --host 0.0.0.0 --port "$PORT"
