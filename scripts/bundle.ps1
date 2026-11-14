# Packs the webpack output into bundle-<version>.zip for deployment (see DEPLOY.md).
# Run through `npm run bundle:release`, which builds release/ first.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

$version = (Get-Content package.json -Raw | ConvertFrom-Json).version
$commit = (git rev-parse --short HEAD).Trim()
$dirty = [bool](git status --porcelain --untracked-files=no)
if ($dirty) {
    Write-Warning "Uncommitted changes: this bundle will not match commit $commit exactly."
}

# Which source went into this bundle, readable on the server.
@(
    "version: $version"
    "commit:  $commit$(if ($dirty) { ' (with uncommitted changes)' })"
    "built:   $((Get-Date).ToString('yyyy-MM-dd HH:mm'))"
    "node:    $((node -v).Trim())"
) | Set-Content -Path release/BUILD.txt -Encoding utf8

$zip = "bundle-$version.zip"
Compress-Archive -Force -DestinationPath $zip -Path `
    release, package.json, package-lock.json, .nvmrc, .env.template, views, public

Write-Host "Built $zip (v$version, $commit)"
