# Linux Cheat Sheet

A quick reference for the Linux commands I use most often.

---

## Table of Contents

| Section                                    | Description                       |
| ------------------------------------------ | --------------------------------- |
| [Navigation](#navigation)                  | Move around directories           |
| [Files & Directories](#files--directories) | Create, copy, move, delete        |
| [Viewing Files](#viewing-files)            | Read file contents                |
| [Searching](#searching)                    | Find files and text               |
| [Permissions](#permissions)                | File permissions                  |
| [Git Helpers](#git-helpers)                | Useful Git-related Linux commands |
| [Processes](#processes)                    | Running programs                  |
| [Package Manager](#package-manager)        | Install software                  |
| [Networking](#networking)                  | Network commands                  |
| [Useful Shortcuts](#useful-shortcuts)      | Terminal shortcuts                |
| [Typical Workflow](#typical-workflow)      | Daily development                 |

---

# Navigation

Current directory

```bash
pwd
```

List files

```bash
ls
```

Detailed list

```bash
ls -l
```

Show hidden files

```bash
ls -la
```

Change directory

```bash
cd folder
```

Go back one folder

```bash
cd ..
```

Go home

```bash
cd ~
```

Go to previous directory

```bash
cd -
```

---

# Files & Directories

Create folder

```bash
mkdir project
```

Create nested folders

```bash
mkdir -p src/components
```

Create file

```bash
touch app.py
```

Copy file

```bash
cp old.py new.py
```

Copy folder

```bash
cp -r folder backup
```

Move or rename

```bash
mv old.py new.py
```

Delete file

```bash
rm file.py
```

Delete folder

```bash
rm -r folder
```

Delete empty folder

```bash
rmdir folder
```

---

# Viewing Files

Display file

```bash
cat file.txt
```

First 10 lines

```bash
head file.txt
```

Last 10 lines

```bash
tail file.txt
```

Follow log file

```bash
tail -f logfile.log
```

View file page by page

```bash
less file.txt
```

Exit:

```text
q
```

---

# Searching

Find a file

```bash
find . -name "*.py"
```

Search text inside files

```bash
grep "Pokemon" app.py
```

Search recursively

```bash
grep -r "useState" .
```

---

# Permissions

Make executable

```bash
chmod +x script.sh
```

View permissions

```bash
ls -l
```

---

# Git Helpers

Current Git branch

```bash
git branch
```

Open VS Code

```bash
code .
```

---

# Processes

Show running processes

```bash
ps
```

Detailed list

```bash
ps aux
```

Find a process

```bash
ps aux | grep python
```

Kill process

```bash
kill PID
```

Force kill

```bash
kill -9 PID
```

---

# Package Manager

Update packages

```bash
sudo apt update
```

Upgrade packages

```bash
sudo apt upgrade
```

Install package

```bash
sudo apt install package-name
```

Remove package

```bash
sudo apt remove package-name
```

---

# Networking

Show IP

```bash
ip addr
```

Test connection

```bash
ping google.com
```

Download file

```bash
wget URL
```

---

# Useful Shortcuts

Stop running command

```text
Ctrl + C
```

Suspend program

```text
Ctrl + Z
```

Clear screen

```bash
clear
```

or

```text
Ctrl + L
```

Previous command

```text
↑
```

Search command history

```text
Ctrl + R
```

Auto-complete

```text
Tab
```

Command history

```bash
history
```

---

# Typical Workflow

Open project

```bash
cd ~/code/project
```

Open VS Code

```bash
code .
```

Check Git

```bash
git status
```

Run program

```bash
python3 main.py
```

or

```bash
npm run dev
```
