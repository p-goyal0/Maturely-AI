# Deployment Guide

This guide explains how to deploy the AI Maturity Platform using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier deployment)

## Quick Start

### Using Docker Compose (Recommended)

1. Build and run the container:
```bash
docker-compose up -d --build
```

2. Access the application at `http://localhost`

3. Stop the container:
```bash
docker-compose down
```

### Using Docker Commands

1. Build the Docker image:
```bash
docker build -t ai-maturity-platform .
```

2. Run the container:
```bash
docker run -d -p 80:80 --name ai-maturity-platform ai-maturity-platform
```

3. Access the application at `http://localhost`

4. Stop the container:
```bash
docker stop ai-maturity-platform
docker rm ai-maturity-platform
```

## Environment Variables

If you need to set environment variables, create a `.env` file or pass them during build:

```bash
docker build --build-arg VITE_API_BASE_URL=https://your-api-url.com -t ai-maturity-platform .
```

Or use environment variables in docker-compose.yml:

```yaml
environment:
  - VITE_API_BASE_URL=https://your-api-url.com
  - VITE_API_TIMEOUT=60000
```

## Production Deployment

### On a VPS/Cloud Server

1. Clone your repository:
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Build and run:
```bash
docker-compose up -d --build
```

3. Set up reverse proxy (if needed) with Nginx or Traefik

### Using Docker Hub

1. Build and tag the image:
```bash
docker build -t yourusername/ai-maturity-platform:latest .
```

2. Push to Docker Hub:
```bash
docker push yourusername/ai-maturity-platform:latest
```

3. Pull and run on your server:
```bash
docker pull yourusername/ai-maturity-platform:latest
docker run -d -p 80:80 yourusername/ai-maturity-platform:latest
```

## Troubleshooting

- **Port already in use**: Change the port mapping in docker-compose.yml (e.g., `8080:80`)
- **Build fails**: Make sure all dependencies are in package.json
- **Application not loading**: Check container logs with `docker logs ai-maturity-platform`

## Health Check

The container includes a health check that verifies the application is running. Check status with:

```bash
docker ps
```

Look for the "healthy" status in the STATUS column.
