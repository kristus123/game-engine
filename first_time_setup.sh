#!/bin/sh

npm i -g eslint
npm i -g @stylistic/eslint-plugin-js
npm i -g concurrently
npm i -g reload

python -m venv venv || python3 -m venv venv

. venv/bin/activate
pip install -r requirements.txt
