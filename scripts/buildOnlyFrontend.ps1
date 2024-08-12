if (Test-Path -LiteralPath '..\frontend-react\dist') {
    Remove-Item -LiteralPath '..\frontend-react\dist' -Recurse
}
else {
    "Path doesn't exist: $path"
}

Set-Location ..\frontend-react
npm run build
Move-Item build dist
Set-Location ..\scripts