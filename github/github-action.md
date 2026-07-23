# GitHub Actions Cheat Sheet

A quick reference for the GitHub Actions features I use most often.

---

# Table of Contents

| Section | Description |
|---------|-------------|
| [What is GitHub Actions?](#what-is-github-actions) | Continuous Integration (CI) |
| [Workflow Location](#workflow-location) | Where workflow files live |
| [Workflow Structure](#workflow-structure) | Main YAML sections |
| [Triggers](#triggers) | When a workflow runs |
| [Jobs](#jobs) | Groups of steps |
| [Steps](#steps) | Individual tasks |
| [Common Actions](#common-actions) | Frequently used actions |
| [Python Example](#python-example) | Run pytest |
| [Node Example](#node-example) | Run npm tests |
| [Useful GitHub Pages](#useful-github-pages) | Where to find workflows |
| [Typical Workflow](#typical-workflow) | My development cycle |

---

# What is GitHub Actions?

GitHub Actions automatically performs tasks whenever something happens in your repository.

Common examples:

- Run tests
- Check formatting
- Run linters
- Build projects
- Deploy applications

---

# Workflow Location

```
.github/
└── workflows/
    └── tests.yml
```

---

# Workflow Structure

```yaml
name:

on:

jobs:
```

---

# Triggers

Run on push

```yaml
on:
  push:
```

Run on pull request

```yaml
on:
  pull_request:
```

Run on both

```yaml
on:
  push:
  pull_request:
```

---

# Jobs

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```

---

# Steps

```yaml
steps:
  - uses:
  - run:
```

---

# Common Actions

Checkout repository

```yaml
- uses: actions/checkout@v4
```

Setup Python

```yaml
- uses: actions/setup-python@v5
```

Setup Node

```yaml
- uses: actions/setup-node@v4
```

---

# Python Example

```yaml
name: Python Tests

on:
  push:

jobs:
  test:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"

      - run: pip install -r requirements.txt

      - run: pytest
```

---

# Node Example

```yaml
name: Node Tests

on:
  push:

jobs:
  test:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm install

      - run: npm test
```

---

# Useful GitHub Pages

Repository

```
Code
```

Workflow history

```
Actions
```

Issues

```
Issues
```

Pull Requests

```
Pull Requests
```

---

# Typical Workflow

```
Write code
↓
git status
↓
git add .
↓
git commit -m "Meaningful message"
↓
git push
↓
GitHub Actions starts automatically
↓
✅ Green = Passed
❌ Red = Failed
↓
Fix if necessary
```

---

# Things I Learned

- Workflow files are YAML (`.yml`)
- They live in `.github/workflows/`
- Every workflow has:
  - name
  - on
  - jobs
  - steps
- `uses:` runs an existing action
- `run:` executes shell commands
- GitHub Actions automatically starts after a push if the workflow is configured