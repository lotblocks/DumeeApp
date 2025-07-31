#!/bin/bash
# Dumee - Complete Docker Build and Deploy Script

set -e

echo "🚀 Starting Dumee Docker Build Process..."

# Set default values
TAG=${1:-latest}
PUSH=${2:-false}
REGISTRY=${DOCKER_REMOTE_REGISTRY:-"ghcr.io/your-username"}

# Build the main application
echo "📦 Building Dumee application..."
docker build -t dumee:${TAG} .

# Tag for registry
if [[ "${PUSH}" == "true" || "${PUSH}" == "push" ]]; then
    echo "🏷️  Tagging for registry..."
    docker tag dumee:${TAG} ${REGISTRY}/dumee:${TAG}
    
    echo "⬆️  Pushing to registry..."
    docker push ${REGISTRY}/dumee:${TAG}
    
    echo "✅ Successfully pushed dumee:${TAG} to ${REGISTRY}"
else
    echo "✅ Successfully built dumee:${TAG}"
    echo "💡 To push to registry, run: $0 ${TAG} push"
fi

echo "🎉 Dumee Docker build completed!"