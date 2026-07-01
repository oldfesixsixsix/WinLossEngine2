#!/bin/bash

# ==============================================================================
# Google Cloud Run Deployment Script
# ==============================================================================
# This script builds a Docker image for amd64 architecture, pushes it to Google 
# Artifact Registry, and deploys it to Cloud Run.
# ==============================================================================

# --- Configuration Variables ---
GCP_REGION="asia-east1"
GCP_PROJECT="my-local-test"
ARTIFACT_REPO="my-repo"
IMAGE_NAME="my-image"
IMAGE_TAG="latest"
SERVICE_NAME="my-service"

# --- Derived Variables ---
FULL_IMAGE_URI="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

# Print execution settings
echo "========================================="
echo "  Cloud Run Deployment Settings"
echo "========================================="
echo "GCP Project:   ${GCP_PROJECT}"
echo "GCP Region:    ${GCP_REGION}"
echo "Repository:    ${ARTIFACT_REPO}"
echo "Image Name:    ${IMAGE_NAME}"
echo "Image Tag:     ${IMAGE_TAG}"
echo "Service Name:  ${SERVICE_NAME}"
echo "Full Image:    ${FULL_IMAGE_URI}"
echo "========================================="
echo ""

# 1. Build the docker image
echo "[Step 1/3] Building Docker image for linux/amd64..."
docker build --platform linux/amd64 -t "${FULL_IMAGE_URI}" .
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi
echo "Docker build completed successfully."
echo ""

# 2. Push the image to Artifact Registry
echo "[Step 2/3] Pushing Docker image to Artifact Registry..."
docker push "${FULL_IMAGE_URI}"
if [ $? -ne 0 ]; then
    echo "Error: Docker push failed. Please ensure you are authenticated (e.g., 'gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev')."
    exit 1
fi
echo "Docker push completed successfully."
echo ""

# 3. Deploy to Cloud Run
echo "[Step 3/3] Deploying service to Google Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${FULL_IMAGE_URI}" \
  --platform managed \
  --region "${GCP_REGION}" \
  --allow-unauthenticated

if [ $? -ne 0 ]; then
    echo "Error: Cloud Run deployment failed."
    exit 1
fi

echo ""
echo "========================================="
echo "Deployment completed successfully!"
echo "========================================="
