#!/bin/bash

git pull --rebase && git pull --rebase origin master

#./lint.sh

git add .
git commit -m "lint"
#git push

gh pr create --title "PR" --body "PR was created with the script" --base master
