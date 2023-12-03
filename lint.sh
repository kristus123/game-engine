#!/bin/bash

source venv/bin/activate
python update_eslint.py

npx eslint . --fix
