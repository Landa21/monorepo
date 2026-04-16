$ErrorActionPreference = "Stop"

# --- 1. CONFIGURATION ---
$PROJECT_NAME = "monorepo"  #match the name in your ECR repository without the "-api" suffix
$AWS_ACCOUNT_ID = "678191059047" # Your 12-digit AWS Account ID, should be on the top right conner, 
$AWS_REGION = "eu-north-1"  # The AWS region where your ECR repository is located, e.g. us-east-1, us-west-2, etc.

# --- 2. DERIVED VARIABLES ---
$REPO_URL = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
$IMAGE_TAG = "$REPO_URL/$PROJECT_NAME-api:latest"

# --- 3. THE EXECUTION ---

# Build the image locally
Write-Host "Building Docker image..."
docker build -t "$PROJECT_NAME-api" .

# Explicitly check for Docker build failure
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker build failed. Script stopped."
    exit $LASTEXITCODE
}

# Login to AWS ECR
Write-Host "Logging into AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPO_URL
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Tag the image for the remote repository
Write-Host "Tagging image..."
docker tag "$PROJECT_NAME-api:latest" $IMAGE_TAG
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Push to the cloud
Write-Host "Pushing to AWS ECR..."
docker push $IMAGE_TAG
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Success! Image is now in the cloud."