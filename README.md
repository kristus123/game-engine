# game-engine

## What is this game

Work in space as a transporter.

## Features

-   pick up and deliver containers
-   navigate in space

## First time set up

Do this for your very first time setting up the project

```
./first_time_setup.sh
```

## run locally

```
./run.sh
```

then open [http://localhost:5000]()

## Run linter

```
./lint.sh
```

## Play anywhere

[Play game](https://romskip.netlify.app/)


# NB! If you are using Windows


+## 0
+
+Install WSL with the following command:
+
+```
+wsl --install
+```
+
+## 0.1
+
+Now you need to make sure your ubuntu environment is ready for action.
+
+These commands download python and nodejs dev environment
+
+```
+# update ubuntu
+sudo apt update -y && sudo apt upgrade -y
+
+# install python dev environment
+sudo apt install -y python3-pip
+sudo apt install -y build-essential libssl-dev libffi-dev python3-dev
+sudo apt install -y python3-venv
+
+# install nodejs
+curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
+source ~/.bashrc
+nvm install latest
+```
+















Use WSL to run the code!

## 1

press windows key (or `win+r`)  and search/run `wsl`.

## 2

```
git clone https://github.com/kristus123/game-engine
cd game-engine && ./first_time_setup.sh
```

## 3

Run this command:

```
explorer.exe .
```

This will give you the path where the project is located. Now you can use your favorite editor like vsCode.

Now that you know the path of the project, you can run the game in wsl:

```
./run.sh
```

# Misc. info

- `runtime.txt` is for netlify.
- Imports are added later, so you don't need to import stuff; also it will crash if you include imports within `static/`
