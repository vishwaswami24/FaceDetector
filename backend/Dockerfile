# syntax=docker/dockerfile:1
FROM python:3.11-slim

# System deps for OpenCV/Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python deps
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code + mediapipe model asset
COPY . .

# Render/containers set PORT; fall back to 5000
ENV PORT=5000

EXPOSE 5000

# Gunicorn runs Flask app:app
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT:-5000} app:app"]

