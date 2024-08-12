Set-Location ..
Remove-Item -LiteralPath "build" -Recurse
New-Item -ItemType "directory" -Name "build"
Copy-Item -Recurse frontend-react/dist/* build
scp -r '.\build\*' ubuntu@vps-50d6d0f5.vps.ovh.net:/var/www/vps-50d6d0f5.vps.ovh.net/html

Set-Location scripts