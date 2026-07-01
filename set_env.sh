#!/bin/bash

# ==============================================================================
# Google Cloud Run Environment Variables Configuration Script
# ==============================================================================
# Use this script to easily set or update environment variables for your 
# Cloud Run service.
# ==============================================================================

# --- Cloud Run Service Configuration ---
SERVICE_NAME="winlossengine2-service"
GCP_REGION="asia-east1"

# --- Environment Variables to Set ---
# Adjust these values as needed for your environment.
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_JWT_SECRET="your-jwt-secret"

# ==============================================================================
# Execution
# ==============================================================================

echo "========================================="
echo " Updating Cloud Run Environment Variables"
echo "========================================="
echo "Service Name:  ${SERVICE_NAME}"
echo "GCP Region:    ${GCP_REGION}"
echo "Supabase URL:  ${SUPABASE_URL}"
echo "========================================="
echo ""

# Update the service configuration in Google Cloud Run
gcloud run services update "${SERVICE_NAME}" \
  --region "${GCP_REGION}" \
  --set-env-vars \
VITE_SUPABASE_URL="${SUPABASE_URL}",\
VITE_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}",\
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}",\
SUPABASE_JWT_SECRET="${SUPABASE_JWT_SECRET}"

if [ $? -ne 0 ]; then
    echo ""
    echo "Error: Failed to update Cloud Run environment variables."
    exit 1
fi

echo ""
echo "========================================="
echo " Environment variables updated successfully!"
echo "========================================="
