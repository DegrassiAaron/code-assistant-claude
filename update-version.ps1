$json = Get-Content package.json -Raw | ConvertFrom-Json
$json.version = "1.0.1"
$json | ConvertTo-Json -Depth 100 | Set-Content package.json
