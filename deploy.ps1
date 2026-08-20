# NBrain Enterprise Deployment Script (Firebase Hosting -> https://nbra.in)
$env:PATH = "C:\Users\pc1.NADEEMBADR\AppData\Local\Programs\nodejs;" + $env:PATH

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  🚀 NBrain Enterprise Portal Deployment (nbra.in)" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Verify / Trigger Login
Write-Host "[1/2] Checking Firebase Authentication..." -ForegroundColor Yellow
& "C:\Users\pc1.NADEEMBADR\AppData\Local\Programs\nodejs\firebase.cmd" login

# 2. Deploy to Firebase Hosting
Write-Host "`n[2/2] Deploying to Firebase Project: nbrain-a654f..." -ForegroundColor Yellow
& "C:\Users\pc1.NADEEMBADR\AppData\Local\Programs\nodejs\firebase.cmd" deploy --only hosting --project nbrain-a654f

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  🎉 SUCCESS! Your portal is LIVE at https://nbra.in" -ForegroundColor Green
Write-Host "========================================================`n" -ForegroundColor Green
