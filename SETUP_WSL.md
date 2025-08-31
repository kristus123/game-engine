# Setup Windows

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
# Currently python is not being used in the project, but it is good to have it
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

## 6

You also need to set up your ssh key

```bash
ssh-keygen -t ed25519 -C "your email"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
clip < ~/.ssh/id_ed25519.pub
```

[Then add your ssh key to github](https://github.com/settings/ssh/new)

## Finished

Now you can follow the readme as usual

## Find the path of the project inside the windows file explorer

use `explorer.exe .` to open the path of the file, you can then use the editor of your choice.
If you are using vsCode, it is recommended to download the wsl extension, which makes it seamless to work within wsl.
