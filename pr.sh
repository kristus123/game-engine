#!/bin/bash

current_branch=$(git branch --show-current)

if [ "$current_branch" = "master" ]; then
    new_branch="auto-$(tr -dc a-z0-9 </dev/urandom | head -c 6)"
    git checkout -b "$new_branch"
fi

git pull --rebase && git pull --rebase origin master

./lint.sh

git add .
git commit -m "lint"
git push --set-upstream origin "$(git branch --show-current)"

gh pr create --title "PR" --body "PR was created with the script" --base master
