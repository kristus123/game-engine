#!/bin/bash

rsync -av --include='*.png' --exclude='*' static/ dist/static/
