# game-engine

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

## Work with the GUI

You can open the gui here

http://localhost:5000/static/ui/test.html


## visual bug

the strange line which looks unpleasent is all ebcaseu stuff are moved at not 'pixel perfect' aka positions are 1.23812837 and not 1
so just make påositions not move in decimals
