Set-Location ..\photo-bomber-nodejs
npm run build
Set-Location ..\photo-bomber-react
npm run build
Move-Item build dist
Set-Location ..\scripts