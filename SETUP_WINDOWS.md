# Setup for Windows

## 1

Install WSL with the following command:

```bash
wsl --install
```

## 2

Now you need to make sure your new ubuntu environment is ready for action.

## 3

Open wsl

press windows key (or `win+r`) and search/run `wsl`.

## 4

Paste all of these commands into your terminal:

```bash
# update ubuntu
sudo apt update -y && sudo apt upgrade -y

# install python dev environment
sudo apt install -y python3-pip
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev
sudo apt install -y python3-venv

# install nodejs version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install node
```

## 5

```bash
git clone https://github.com/kristus123/game-engine
```

Now you can follow the readme as usual

## Find the path of the project

use `explorer.exe .` to open the path of the file, you can then use the editor of your choice.
If you are using vsCode, it is recommended to download the wsl extension, which makes it seamless to work within wsl.
