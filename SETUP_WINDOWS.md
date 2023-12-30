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

press windows key (or `win+r`)  and search/run `wsl`.

## 4

Paste all of these commands into your terminal.

```bash
# update ubuntu
sudo apt update -y && sudo apt upgrade -y

# install python dev environment
sudo apt install -y python3-pip
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev
sudo apt install -y python3-venv

# install nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install node
```

## 5

```bash
git clone https://github.com/kristus123/game-engine
cd game-engine && ./first_time_setup.sh
```

## 6

Run this command:

```bash
explorer.exe .
```

This will give you the path where the project is located. Now you can use your favorite editor like vsCode.

Now that you know the path of the project, you can run the game in wsl:

```bash
./run.sh
```
