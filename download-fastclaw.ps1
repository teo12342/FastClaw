#!/usr/bin/env pwsh
# download-fastclaw.ps1

Write-Host "Downloading and setting up FastClaw..." -ForegroundColor Cyan

# Check if git is installed
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is required but not installed." -ForegroundColor Red
    exit 1
}

# Check if Node is installed
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is required but not installed." -ForegroundColor Red
    exit 1
}

# Check if PNPM is installed
if (-not (Get-Command "pnpm" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

$CloneDir = "fastclaw-workspace"
if (Test-Path $CloneDir) {
    Write-Host "Directory '$CloneDir' already exists. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "Cloning FastClaw repository..." -ForegroundColor Yellow
# Assuming this repo is the source of truth, you'd clone it. For local test we just copy.
# In a real scenario: git clone https://github.com/fastclaw/fastclaw.git $CloneDir
# For demonstration:
git clone https://github.com/openclaw/openclaw.git $CloneDir

Set-Location $CloneDir

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "Building FastClaw UI..." -ForegroundColor Yellow
pnpm ui:build

Write-Host ""
Write-Host "FastClaw Setup Complete! Starting the local server..." -ForegroundColor Green
pnpm dev
