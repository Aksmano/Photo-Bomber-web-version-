# $build = Start-Job -FilePath "./buildApps.ps1" -Name "buildApps"
# Wait-Job -Name $build.Name
Set-Location ..
Remove-Item -LiteralPath "build" -Recurse
New-Item -ItemType "directory" -Name "build"
Copy-Item -Recurse frontend-react/dist/* build

Set-Location build
# New-Item -ItemType "directory" -Name "backend"
Set-Location ..
Copy-Item -Recurse backend-nodejs/config build/config
# Copy-Item -Recurse backend-nodejs/node_modules build/node_modules
Copy-Item -Recurse backend-nodejs/dist/server.js build/server.js
Copy-Item backend-nodejs/package.json build/package.json
Copy-Item backend-nodejs/package-lock.json build/package-lock.json

scp -r '.\build\*' ubuntu@vps-50d6d0f5.vps.ovh.net:/var/www/vps-50d6d0f5.vps.ovh.net/html

Set-Location scripts