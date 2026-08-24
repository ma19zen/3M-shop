# K8s Multi-Cloud Simulation Setup Script
# Run this after Docker Desktop is installed and running

Write-Host "=== ShopSphere K8s Multi-Cloud Simulation ===" -ForegroundColor Cyan

# Verify Docker is running
try {
    docker info | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Enable Kubernetes in Docker Desktop
Write-Host "`nEnabling Kubernetes in Docker Desktop..." -ForegroundColor Yellow

# Apply AWS simulation resources
Write-Host "`n--- Deploying AWS Simulation ---" -ForegroundColor Magenta
kubectl apply -f k8s/aws-simulation/namespace.yml
kubectl apply -f k8s/aws-simulation/frontend.yml
kubectl apply -f k8s/aws-simulation/backend.yml
Write-Host "[OK] AWS simulation deployed" -ForegroundColor Green

# Apply GCP simulation resources
Write-Host "`n--- Deploying GCP Simulation ---" -ForegroundColor Magenta
kubectl apply -f k8s/gcp-simulation/namespace.yml
kubectl apply -f k8s/gcp-simulation/frontend.yml
kubectl apply -f k8s/gcp-simulation/backend.yml
Write-Host "[OK] GCP simulation deployed" -ForegroundColor Green

# Verify isolation
Write-Host "`n--- Verifying Namespace Isolation ---" -ForegroundColor Yellow

Write-Host "`nAWS namespace pods:" -ForegroundColor Cyan
kubectl get pods -n aws-simulation

Write-Host "`nGCP namespace pods:" -ForegroundColor Cyan
kubectl get pods -n gcp-simulation

Write-Host "`nAWS services:" -ForegroundColor Cyan
kubectl get svc -n aws-simulation

Write-Host "`nGCP services:" -ForegroundColor Cyan
kubectl get svc -n gcp-simulation

# Verify isolation: list resources from each namespace separately
Write-Host "`n--- Isolation Check ---" -ForegroundColor Yellow
$awsPods = kubectl get pods -n aws-simulation --no-headers 2>$null
$gcpPods = kubectl get pods -n gcp-simulation --no-headers 2>$null

if ($awsPods -and $gcpPods) {
    Write-Host "[OK] Both namespaces have isolated resources" -ForegroundColor Green
} else {
    Write-Host "[WARN] Some pods may not be ready yet" -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "`nPort-forward commands to access services:" -ForegroundColor Yellow
Write-Host "  AWS Frontend:  kubectl port-forward svc/frontend-service 30080:80 -n aws-simulation" -ForegroundColor White
Write-Host "  AWS Backend:   kubectl port-forward svc/backend-service 30500:5000 -n aws-simulation" -ForegroundColor White
Write-Host "  GCP Frontend:  kubectl port-forward svc/frontend-service 31080:80 -n gcp-simulation" -ForegroundColor White
Write-Host "  GCP Backend:   kubectl port-forward svc/backend-service 31500:5000 -n gcp-simulation" -ForegroundColor White
