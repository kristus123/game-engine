# Setup git for windows

A tutorial for artists.

# Step 1

1. Create a github account
2. send the username to Kristian

# Step 2

install git and the github cli tool `gh`:

`winget` should be installed on your pc already if you are using a recent version of windows.

```bash
winget install --id Git.Git -e --source winget
winget install --id GitHub.cli -e --source winget
```

# Step 3

When Kristian has added you to the project, you can download the game files:

```bash
git clone git@github.com:kristus123/game-engine.git
```

It will download the files to the directory you are currently in.

# Step 4

When you have installed it, run:

```bash
gh auth login
```

# Step 5

now you can run a window pr script which is in the parent folder.

# Aseprite files

All Aseprite files are located in xxx

It is important to put the aseprite files in the aseprite folder.
