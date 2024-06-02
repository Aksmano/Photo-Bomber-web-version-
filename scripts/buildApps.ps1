$paths = '..\backend-nodejs\dist', '..\frontend-react\dist'
foreach ($path in $paths) {
    if (Test-Path -LiteralPath $path) {
      Remove-Item -LiteralPath $path -Recurse
    } else {
      "Path doesn't exist: $path"
    }
}
Set-Location ..\backend-nodejs
npm run build
Set-Location ..\frontend-react
npm run build
Move-Item build dist
Set-Location ..\scripts