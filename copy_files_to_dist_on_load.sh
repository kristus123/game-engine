#!/bin/bash

rsync -av --include='*.png' --include='assets/' --exclude='*' static/ dist/static/

