# Setup git for windows

# Step 1

Create a github account

# Step 2

install git and the github cli tool `gh`:

`winget` should be installed on your pc already.

```bash
winget install --id Git.Git -e --source winget
winget install --id GitHub.cli -e --source winget
```

# Step 3

When you have installed it, run:

```bash
gh auth login
```

# Step 4

now you can run the `windows_pr.sh` script which is in the parent folder.
