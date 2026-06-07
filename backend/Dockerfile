# Use a Python base image that includes building utilities
FROM python:3.11-slim

# Install system graphics libraries required by Mediapipe/OpenCV
RUN apt-get update && apt-get install -y \
    libgles2 \
    libegl1 \
    libgl1 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up the working directory inside the container
WORKDIR /app

# Copy and install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the dynamic port Render uses
EXPOSE 10000

# Start Gunicorn and bind it to the assigned port
CMD gunicorn -b 0.0.0.0:$PORT app:app
