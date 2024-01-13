#!/bin/bash

npm install

python3 -m venv venv || python -m venv venv
. venv/bin/activate

pip install -r requirements.txt
