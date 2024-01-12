#!/bin/bash

rsync -av --include='*.gif' --include='*.png' --include='assets/***' --exclude='*' static/ dist/static/
