#!/bin/bash

git pull --rebase && git pull --rebase origin master

./lint.sh

gh pr create --title "PR" --body "PR was created with the script" --base master
