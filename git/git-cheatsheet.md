# Git Cheat Sheet

A quick reference for the Git commands I use most often.

---

## Table of Contents

| Section                               | Description                      |
| ------------------------------------- | -------------------------------- |
| [Quick Commands](#quick-commands)     | Most-used Git commands           |
| [Initialize](#initialize)             | Start a Git repository           |
| [Status](#status)                     | Check repository status          |
| [Add](#add)                           | Stage files                      |
| [Commit](#commit)                     | Save changes                     |
| [Push](#push)                         | Upload changes to GitHub         |
| [Pull](#pull)                         | Download the latest changes      |
| [Log](#log)                           | View commit history              |
| [Branch](#branch)                     | Create and switch branches       |
| [Merge](#merge)                       | Combine branches                 |
| [Restore and Undo](#restore-and-undo) | Undo mistakes                    |
| [Stash](#stash)                       | Save unfinished work temporarily |
| [Diff](#diff)                         | Compare changes                  |
| [Remote](#remote)                     | Manage remote repositories       |
| [Clone](#clone)                       | Copy a repository                |
| [Tags](#tags)                         | Mark releases                    |
| [Typical Workflow](#typical-workflow) | Common Git workflow              |

---

## Quick Commands

These are the Git commands I use most often.

<div class="quick-grid">

<div class="quick-card">

### Start a Repository

```bash
git init
```

Initialize Git inside the current folder.

</div>

<div class="quick-card">

### Check Status

```bash
git status
```

See modified, staged, and untracked files.

</div>

<div class="quick-card">

### Stage Everything

```bash
git add .
```

Add all current changes to the staging area.

</div>

<div class="quick-card">

### Save Changes

```bash
git commit -m "Describe changes"
```

Create a commit with a meaningful message.

</div>

<div class="quick-card">

### First Push

```bash
git push -u origin main
```

Push `main` and connect it to the remote branch.

</div>

<div class="quick-card">

### Regular Push

```bash
git push
```

Upload committed changes to GitHub.

</div>

<div class="quick-card">

### Download Changes

```bash
git pull
```

Download and merge changes from GitHub.

</div>

<div class="quick-card">

### Create a Branch

```bash
git switch -c feature-name
```

Create a new branch and switch to it.

</div>

</div>

---

## Initialize

Initialize a new Git repository inside the current folder:

```bash
git init
```

Check that Git was initialized:

```bash
git status
```

---

## Status

Check the current state of the repository:

```bash
git status
```

This shows:

- Modified files
- Staged files
- Untracked files
- Current branch
- Whether the branch is ahead or behind the remote

Use the shorter version:

```bash
git status --short
```

Example output:

```text
M  app.py
?? README.md
```

Common status symbols:

| Symbol | Meaning   |
| ------ | --------- |
| `M`    | Modified  |
| `A`    | Added     |
| `D`    | Deleted   |
| `??`   | Untracked |

---

## Add

Stage one file:

```bash
git add file.py
```

Stage several files:

```bash
git add app.py README.md
```

Stage everything in the current repository:

```bash
git add .
```

Stage all tracked and untracked changes:

```bash
git add --all
```

Check what is staged:

```bash
git status
```

---

## Commit

Create a commit:

```bash
git commit -m "Meaningful message"
```

Example:

```bash
git commit -m "Add Pokemon search feature"
```

A good commit message should briefly explain what changed.

Good examples:

```bash
git commit -m "Fix login form validation"
```

```bash
git commit -m "Add Docker development environment"
```

```bash
git commit -m "Update Git cheat sheet"
```

Commit tracked files without running `git add` first:

```bash
git commit -am "Fix navigation bug"
```

> `git commit -am` only works for files Git is already tracking. It does not include new untracked files.

Change the most recent commit message:

```bash
git commit --amend -m "New commit message"
```

Add forgotten staged changes to the most recent commit:

```bash
git add forgotten-file.py
git commit --amend --no-edit
```

---

## Push

Push committed changes:

```bash
git push
```

Push a branch for the first time:

```bash
git push -u origin main
```

The `-u` option connects the local branch to the remote branch.

After the first push, use:

```bash
git push
```

Push a new feature branch:

```bash
git push -u origin feature-name
```

Force push more safely:

```bash
git push --force-with-lease
```

> Avoid using a regular force push unless you understand how it can overwrite remote work.

---

## Pull

Download and merge the latest remote changes:

```bash
git pull
```

Pull from a specific branch:

```bash
git pull origin main
```

Download changes without merging them:

```bash
git fetch
```

View remote changes after fetching:

```bash
git log main..origin/main
```

Pull using rebase:

```bash
git pull --rebase
```

This places your local commits after the newly downloaded commits.

---

## Log

View detailed commit history:

```bash
git log
```

Exit the log:

```text
q
```

View compact history:

```bash
git log --oneline
```

View commits as a graph:

```bash
git log --oneline --graph --all
```

View recent commits:

```bash
git log -5
```

View changes from each commit:

```bash
git log --stat
```

View commits for one file:

```bash
git log -- file.py
```

---

## Branch

List local branches:

```bash
git branch
```

The current branch is marked with `*`.

List local and remote branches:

```bash
git branch --all
```

Create a branch:

```bash
git branch feature-name
```

Create and switch to a branch:

```bash
git switch -c feature-name
```

Switch branches:

```bash
git switch main
```

Rename the current branch:

```bash
git branch -m new-name
```

Delete a merged branch:

```bash
git branch -d feature-name
```

Force-delete an unmerged branch:

```bash
git branch -D feature-name
```

Push a new branch to GitHub:

```bash
git push -u origin feature-name
```

Delete a remote branch:

```bash
git push origin --delete feature-name
```

---

## Merge

Switch to the branch that should receive the changes:

```bash
git switch main
```

Merge another branch into it:

```bash
git merge feature-name
```

Typical merge workflow:

```bash
git switch main
git pull
git merge feature-name
git push
```

After successfully merging, delete the local feature branch:

```bash
git branch -d feature-name
```

### Merge Conflicts

Git marks conflicted sections like this:

```text
<<<<<<< HEAD
Code from the current branch
=======
Code from the incoming branch
>>>>>>> feature-name
```

Resolve the conflict manually, remove the markers, and then run:

```bash
git add .
git commit -m "Resolve merge conflict"
```

---

## Restore and Undo

### Unstage One File

```bash
git restore --staged file.py
```

This removes the file from staging but keeps the changes.

### Unstage Everything

```bash
git restore --staged .
```

### Discard Local Changes

```bash
git restore file.py
```

> This permanently removes uncommitted changes from the file.

### Restore a Deleted File

```bash
git restore file.py
```

### Restore a File From a Previous Commit

```bash
git restore --source=COMMIT_HASH file.py
```

### Undo the Most Recent Commit but Keep Changes Staged

```bash
git reset --soft HEAD~1
```

### Undo the Most Recent Commit and Unstage Changes

```bash
git reset HEAD~1
```

### Undo a Commit That Was Already Pushed

```bash
git revert COMMIT_HASH
```

This creates a new commit that reverses the old commit.

### Remove an Untracked File

Preview what will be removed:

```bash
git clean -n
```

Remove untracked files:

```bash
git clean -f
```

Remove untracked folders too:

```bash
git clean -fd
```

---

## Stash

Temporarily save unfinished tracked changes:

```bash
git stash
```

Save changes with a description:

```bash
git stash push -m "Work in progress"
```

Include untracked files:

```bash
git stash -u
```

List saved stashes:

```bash
git stash list
```

Restore the latest stash and remove it from the stash list:

```bash
git stash pop
```

Restore the latest stash without removing it:

```bash
git stash apply
```

Restore a specific stash:

```bash
git stash apply stash@{1}
```

Delete a specific stash:

```bash
git stash drop stash@{1}
```

Delete all stashes:

```bash
git stash clear
```

---

## Diff

View unstaged changes:

```bash
git diff
```

View staged changes:

```bash
git diff --cached
```

You can also use:

```bash
git diff --staged
```

Compare two branches:

```bash
git diff main..feature-name
```

Compare two commits:

```bash
git diff COMMIT_ONE COMMIT_TWO
```

View changes for one file:

```bash
git diff file.py
```

Show the changes from the most recent commit:

```bash
git show
```

---

## Remote

View remote repositories:

```bash
git remote -v
```

Add a remote repository:

```bash
git remote add origin REPOSITORY_URL
```

Example:

```bash
git remote add origin https://github.com/username/repository.git
```

View more information about the remote:

```bash
git remote show origin
```

Change the remote URL:

```bash
git remote set-url origin NEW_REPOSITORY_URL
```

Remove a remote:

```bash
git remote remove origin
```

---

## Clone

Copy a repository from GitHub:

```bash
git clone REPOSITORY_URL
```

Example:

```bash
git clone https://github.com/username/repository.git
```

Clone into a custom folder name:

```bash
git clone REPOSITORY_URL custom-folder
```

Clone one specific branch:

```bash
git clone --branch branch-name REPOSITORY_URL
```

---

## Tags

List tags:

```bash
git tag
```

Create a lightweight tag:

```bash
git tag v1.0
```

Create an annotated tag:

```bash
git tag -a v1.0 -m "Version 1.0 release"
```

Push one tag:

```bash
git push origin v1.0
```

Push all tags:

```bash
git push origin --tags
```

Delete a local tag:

```bash
git tag -d v1.0
```

Delete a remote tag:

```bash
git push origin --delete v1.0
```

---

## Typical Workflow

### Working on the Main Branch

```text
git status
↓
git add .
↓
git commit -m "Describe your changes"
↓
git pull
↓
git push
```

Commands:

```bash
git status
git add .
git commit -m "Describe your changes"
git pull
git push
```

### Working With a Feature Branch

```text
Switch to main
↓
Pull the latest changes
↓
Create a feature branch
↓
Make changes
↓
Stage and commit
↓
Push the feature branch
↓
Open a pull request
```

Commands:

```bash
git switch main
git pull
git switch -c feature-name
git add .
git commit -m "Add new feature"
git push -u origin feature-name
```

### After the Pull Request Is Merged

```bash
git switch main
git pull
git branch -d feature-name
```

---

## Helpful Git Setup

Set your name:

```bash
git config --global user.name "Your Name"
```

Set your email:

```bash
git config --global user.email "you@example.com"
```

View global Git settings:

```bash
git config --global --list
```

Set the default branch name to `main`:

```bash
git config --global init.defaultBranch main
```

Set VS Code as the default Git editor:

```bash
git config --global core.editor "code --wait"
```

---

## Command Pattern

Most Git commands follow this pattern:

```text
git command options target
```

Example:

```bash
git switch -c feature-login
```

- `git` starts the Git command
- `switch` is the command
- `-c` is the option to create a branch
- `feature-login` is the branch name
