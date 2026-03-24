#!/usr/bin/env bash
# download-fastclaw.sh

set -e

echo -e "\033[36mDownloading and setting up FastClaw...\033[0m"

if ! command -v git &> /dev/null; then
    echo -e "\033[31mError: Git is required but not installed.\033[0m"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "\033[31mError: Node.js is required but not installed.\033[0m"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "\033[33mInstalling pnpm...\033[0m"
    npm install -g pnpm
fi

CLONE_DIR="fastclaw-workspace"
if [ -d "$CLONE_DIR" ]; then
    echo -e "\033[31mDirectory '$CLONE_DIR' already exists. Aborting.\033[0m"
    exit 1
fi

echo -e "\033[33mCloning FastClaw repository...\033[0m"
git clone https://github.com/teo12342/FastClaw.git "$CLONE_DIR"

cd "$CLONE_DIR"

echo -e "\033[33mInstalling dependencies...\033[0m"
pnpm install

echo -e "\033[33mBuilding FastClaw UI...\033[0m"
pnpm ui:build

echo -e "\n\033[32mFastClaw Setup Complete!\nStarting the local server...\033[0m"
pnpm dev
