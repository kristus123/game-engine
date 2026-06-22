#!/bin/bash

rg "// " . \
  -g '!node_modules/**' \
  -g '!dist/**' \
  --color=always \
  --heading | less -R
