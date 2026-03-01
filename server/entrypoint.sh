#!/bin/sh
set -e

echo "🌱 Running seed..."
python seed.py

echo "🚀 Starting server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
