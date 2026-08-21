# NBrain Enterprise Deployment Script (Firebase Functions:chat + Hosting -> https://nbra.in)
$env:PATH = "C:\Users\pc1.NADEEMBADR\AppData\Local\Programs\nodejs;" + $env:PATH

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  🚀 NBrain Enterprise Portal & Cloud Functions Deployment" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Build & Encrypt Client Assets (JS Obfuscation + CSS Minification)
Write-Host "[1/3] Hardening & Obfuscating Client Assets..." -ForegroundColor Yellow
node build_secure_bundle.js

# 2. Install Functions Dependencies if needed
if (Test-Path "functions\package.json") {
  Write-Host "`n[2/3] Checking Functions Dependencies..." -ForegroundColor Yellow
  Push-Location functions
  npm install --prefer-offline
  Pop-Location
}

# 3. Deploy only the chat function and hosting to avoid touching other workspace functions
Write-Host "`n[3/3] Deploying Function (chat) & Hosting to Firebase Project: nbrain-a654f..." -ForegroundColor Yellow
npx firebase deploy --only functions:chat,hosting --project nbrain-a654f --non-interactive

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  🎉 SUCCESS! Your secure portal is LIVE at https://nbra.in" -ForegroundColor Green
Write-Host "========================================================`n" -ForegroundColor Green
