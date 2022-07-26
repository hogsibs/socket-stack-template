FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg && \
    sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg && \
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs)-prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list' && \
    sudo apt-get update && \
    sudo apt-get install -y azure-functions-core-tools-4 nodejs
