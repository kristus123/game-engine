# game-engine

# set up github cli tool

it's used for running `./pr.sh`:

```bash
sudo apt update -y
sudo apt install gh -y
```
when installed do:

```bash
gh auth login
```

# Install node

install newest version of node

- [INSTALL](https://nodejs.org/en/download/current)


# Install Aseprite

if linux use:

    - ~/meta-repo/projects/aseprite 

if windows use:

## Coding conventions

- Imports are added automatically so you don't need to import stuff, also it will crash if you include imports within `static/`
- In every file, you can export one thing, and that one thing should have the same name as the file
- ´./lint.sh´ will take care of the code convention

## First time set up

```
npm install
```

## run locally

```
npm run start
```

then open [http://localhost:5000]()

## Run linter

```
./lint.sh
```

## Play anywhere

[Play game](https://romskip.netlify.app/)
