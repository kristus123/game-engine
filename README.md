# game-engine

## Coding conventions

- Imports are added automatically so you don't need to import stuff, also it will crash if you include imports within `static/`
- In every file, you can export one thing, and that one thing should have the same name as the file
- ´./lint.sh´ will take care of the code convention

## First time set up

### For Windows

Follow [SETUP_WINDOWS.md](SETUP_WINDOWS.md) instead.

### For Linux

```
npm install

python3 -m venv venv || python -m venv venv
. venv/bin/activate
pip install -r requirements.txt
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

# Misc. info

- `runtime.txt` is used for netlify.
