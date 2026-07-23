# Developer Cheat Sheet Website

## Goal

Create a developer cheat-sheet website that is optimized for **daily development workflow**, not as a complete tutorial.

The website should answer:

> "What commands or examples do I need while I'm coding right now?"

If something is easier to Google than to keep on a cheat sheet, it probably doesn't belong in the workflow section.

---

# Before Making Changes

1. Read every HTML and CSS file in the project.
2. Review every image in the `examples/` folder before making any edits.
3. If a page has HTML or CSS issues, fix them.
4. Preserve all existing content unless instructed otherwise.

---

# Design References

## Good Examples

Use these as the design standard.

* `examples/good_card_ex1.png`
* `examples/good_table.png`

## Avoid

Do **not** copy these layouts.

* `examples/bad_card_ex1.png`
* `examples/bad_card_ex2.png`

---

# Every Page Should Include

## Navigation Bar

Every page should have the same navigation layout.

---

## Header

The top section should contain:

* Page title
* Short description
* Official documentation link (when available)

The hero/header should occupy roughly the top half of the initial viewport.

Example:

Markdown
Official Documentation →

---

## Table of Contents

Keep the current table-of-contents design.

Use:

`examples/good_table.png`

as the reference.

---

# Daily Workflow Cards (Highest Priority)

This is the most important section on every page.

The cards should represent the commands developers actually type every day.

The goal is to let someone glance at the page and immediately continue working.

Avoid splitting a workflow into many tiny cards.

Instead, group commands that naturally belong together.

Example:

## Starting a Repository

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
git push
```

Explain only the commands that are commonly forgotten.

---

Example:

## Feature Branch Workflow

```bash
git checkout -b feature/cars
git add .
git commit -m "Describe changes"
git push
git checkout dev
git merge feature/cars
```

This workflow is much more useful than having six separate cards explaining one command each.

---

# Content After the Workflow Cards

Everything after the workflow cards in the current pages is already good.

Leave those sections mostly unchanged unless there is a clear improvement.

---

# Design Rules

* Keep the dark theme.
* Preserve each technology's accent color.
* Maintain consistent spacing across every page.
* Use the same card styling everywhere.
* Keep code blocks consistent.
* Keep copy buttons consistent.
* Keep navigation consistent.
* Make layouts responsive.

---

# Important

Optimize these pages for developers who already know the basics.

Prioritize:

1. Daily workflow
2. Commands
3. Examples
4. Common fixes

Do not turn the pages into long tutorials.


# Dependencies Page Requirements

The `dependencies/index.html` page should be organized primarily around **real development workflows**, not around isolated npm commands.

The page should help someone answer:

> "What sequence of commands do I need for the task I am doing right now?"

Do not create one card for every individual command. Group related commands into complete workflows.

## Required Workflow Cards

### Create a New React App

Show the complete Vite setup process:

```bash
npm create vite@latest my-app
```

Then show the interactive choices:

```text
Select a framework:
React

Select a variant:
JavaScript
```

Then continue the workflow:

```bash
cd my-app
npm install
npm run dev
```

This card should be usable from top to bottom without needing another website.

---

### Start an Existing Project

```bash
git clone <repository-url>
cd <project-folder>
npm install
npm run dev
```

Explain that `npm install` reads `package.json` and installs the required dependencies.

---

### Install a Runtime Dependency

```bash
npm install axios
```

Include a small example showing how the package is imported:

```js
import axios from "axios";
```

Explain that regular dependencies are packages the application needs while it runs.

---

### Install a Development Dependency

```bash
npm install -D eslint
npm install -D prettier
npm install -D cypress
```

Explain that `-D` is short for `--save-dev` and is used for development, testing, formatting, and linting tools.

---

### Add Common React Packages

Group commonly used packages together:

```bash
npm install axios
npm install react-router-dom
npm install clsx
npm install uuid
```

Briefly explain what each package is commonly used for.

---

### Fix a Broken Dependency Installation

```bash
rm -rf node_modules
npm install
npm run dev
```

Also include the more aggressive cleanup option:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

Clearly warn that deleting `package-lock.json` should not be the first step because it can install different package versions.

---

### Fix a Missing ESLint Plugin

Use the Cypress issue as the main example:

```bash
npm install -D eslint-plugin-cypress
```

Then show the required `eslint.config.js` configuration:

```js
import cypress from "eslint-plugin-cypress";

export default [
  {
    files: ["cypress/**/*.{js,jsx}"],
    extends: [cypress.configs.recommended],
  },
];
```

---

### Inspect and Update Packages

Group these commands into one workflow card:

```bash
npm list --depth=0
npm outdated
npm view axios version
npm update
```

Explain the difference between checking installed packages, checking outdated packages, viewing the newest published version, and updating within allowed version ranges.

---

### Remove a Package

```bash
npm uninstall package-name
```

Explain that this removes the package from both `node_modules` and `package.json`.

---

### Run Project Scripts

Group common `package.json` scripts together:

```bash
npm run dev
npm run lint
npm test
npm run build
```

Explain that the available commands come from the `scripts` section of `package.json`.

## Layout Priority

The workflow cards should appear near the top of the Dependencies page, immediately after the hero and table of contents.

Use:

* `examples/good_card_ex1.png` as the preferred card reference
* `examples/bad_card_ex1.png` and `examples/bad_card_ex2.png` as layouts to avoid
* `examples/good_table.png` as the table-of-contents reference

Keep the existing detailed content after the workflow cards unless it is duplicated, incorrect, or clearly unnecessary.

The Dependencies page should feel like a practical setup and troubleshooting guide, not a package-manager tutorial.

