# Dumee Docker Setup

This directory contains Docker configurations for the Dumee application.

## Available Configurations

### Production Deployment
- `Dockerfile` - Multi-stage production build
- `Dockerfile.multi` - Same as Dockerfile, alternative name for compose files
- `deploy-compose.yml` - Production deployment configuration
- `docker-compose.production.yml` - Alternative production setup

### Development
- `docker-compose.yml` - Basic development setup
- `docker-compose.dev.yml` - Full development environment with hot reloading
- `.devcontainer/` - VS Code development container configuration

### Testing
- `utils/docker/test-compose.yml` - Testing environment

## Quick Start

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Access the application
# Frontend: http://localhost:3090
# Backend API: http://localhost:3080
# MongoDB: mongodb://localhost:27017
# Meilisearch: http://localhost:7700
```

### Production Build
```bash
# Build the application
./utils/docker/build-and-deploy.sh latest

# Build and push to registry
./utils/docker/build-and-deploy.sh latest push

# Deploy with compose
docker-compose -f deploy-compose.yml up -d
```

## Environment Configuration

Copy `docker.env.template` to `.env` and customize:

```bash
cp docker.env.template .env
# Edit .env with your configuration
```

**Important**: Generate secure secrets for production!

## Container Names

All containers use the `dumee-` prefix:
- `dumee-dev-api` - Development API server
- `dumee-dev-frontend` - Development frontend
- `dumee-mongodb` - MongoDB database
- `dumee-meilisearch` - Meilisearch engine
- `dumee-rag-api` - RAG API service
- `dumee-vectordb` - Vector database

## Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3090 | Web interface |
| API | 3080 | Backend API |
| MongoDB | 27017 | Database |
| Meilisearch | 7700 | Search engine |
| RAG API | 8000 | AI/RAG services |

## Volumes

- `mongodb_data` - Database storage
- `meilisearch_data` - Search index storage  
- `vectordb_data` - Vector database storage

## Build Scripts

- `utils/docker/docker-build.sh` - Build application image
- `utils/docker/docker-push.sh` - Push to registry
- `utils/docker/build-and-deploy.sh` - Combined build and deploy