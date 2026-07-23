# GitHub Pull Requests Cheat Sheet

A quick reference for creating, reviewing, and merging Pull Requests (PRs).

---

# Table of Contents

| Section                                               | Description             |
| ----------------------------------------------------- | ----------------------- |
| [What is a Pull Request?](#what-is-a-pull-request)    | Purpose of a PR         |
| [Typical Workflow](#typical-workflow)                 | From branch to merge    |
| [Creating a Branch](#creating-a-branch)               | Start new work          |
| [Making Changes](#making-changes)                     | Commit your work        |
| [Opening a Pull Request](#opening-a-pull-request)     | Create the PR           |
| [Reviewing a PR](#reviewing-a-pr)                     | Code review             |
| [Updating a PR](#updating-a-pr)                       | Push additional commits |
| [Merging](#merging)                                   | Complete the PR         |
| [Resolving Conflicts](#resolving-conflicts)           | Fix merge conflicts     |
| [Useful Commands](#useful-commands)                   | Git commands            |
| [Typical Workflow Example](#typical-workflow-example) | End-to-end example      |

---

# What is a Pull Request?

A Pull Request (PR) is a request to merge one branch into another.

Example:

```text
feature/login
      ↓
Pull Request
      ↓
main
```

A PR lets others:

- Review your code
- Leave comments
- Request changes
- Approve your work
- Merge safely

---

# Typical Workflow

```text
main
 ↓
Create branch
 ↓
Write code
 ↓
Commit
 ↓
Push
 ↓
Open Pull Request
 ↓
Review
 ↓
Merge
```

---

# Creating a Branch

Create and switch to a new branch

```bash
git checkout -b feature/login
```

See your branches

```bash
git branch
```

Switch branches

```bash
git checkout main
```

---

# Making Changes

Check status

```bash
git status
```

Stage files

```bash
git add .
```

Commit

```bash
git commit -m "Add login form"
```

Push your branch

```bash
git push -u origin feature/login
```

The `-u` option sets the upstream so future pushes can simply use:

```bash
git push
```

---

# Opening a Pull Request

On GitHub:

1. Push your branch.
2. Click **Compare & pull request**.
3. Verify:
   - Base branch
   - Compare branch
4. Write:
   - Title
   - Description
5. Click **Create Pull Request**.

---

# Reviewing a PR

Things to check:

- Does the code work?
- Is it readable?
- Any duplicate code?
- Are variables named well?
- Are tests passing?
- Any comments needed?

Possible review actions:

- Comment
- Approve
- Request Changes

---

# Updating a PR

Simply make more commits.

```bash
git add .

git commit -m "Address review comments"

git push
```

The Pull Request updates automatically.

---

# Merging

After approval:

Click

```text
Merge Pull Request
```

Common merge options:

- Create Merge Commit
- Squash and Merge
- Rebase and Merge

As a junior developer, you'll most often use whatever your team's workflow requires.

---

# Resolving Conflicts

If GitHub says:

```text
This branch has conflicts.
```

Update your branch:

```bash
git checkout feature/login

git merge main
```

Resolve the conflicts.

Then:

```bash
git add .

git commit

git push
```

The Pull Request updates automatically.

---

# Useful Commands

Current branch

```bash
git branch
```

Switch branch

```bash
git checkout branch-name
```

Create branch

```bash
git checkout -b new-branch
```

Push

```bash
git push
```

Pull

```bash
git pull
```

Merge

```bash
git merge feature-branch
```

Delete local branch

```bash
git branch -d feature/login
```

Delete remote branch

```bash
git push origin --delete feature/login
```

---

# Typical Workflow Example

```text
git checkout -b feature/navbar

↓
Write code

↓
git add .

↓
git commit -m "Add responsive navbar"

↓
git push -u origin feature/navbar

↓
Open Pull Request

↓
Code Review

↓
Make requested changes

↓
git push

↓
Merge Pull Request

↓
git checkout main

↓
git pull

↓
git branch -d feature/navbar
```

---

# Common Terms

| Term           | Meaning                                     |
| -------------- | ------------------------------------------- |
| Branch         | Separate line of development                |
| PR             | Pull Request                                |
| Review         | Feedback before merging                     |
| Approve        | Reviewer accepts the changes                |
| Merge          | Combine branches                            |
| Conflict       | Git can't automatically combine changes     |
| Base Branch    | Branch receiving the changes (often `main`) |
| Compare Branch | Branch containing your work                 |

---

# My Pull Request Checklist

- [ ] Code works
- [ ] Tests pass
- [ ] No unnecessary files
- [ ] Meaningful commit messages
- [ ] Pull latest changes from `main`
- [ ] Review my own code before requesting review
- [ ] Respond to reviewer comments
