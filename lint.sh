#!/bin/bash

clear

source venv/bin/activate
python update_eslint.py

npx eslint . --fix
