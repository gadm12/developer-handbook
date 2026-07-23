# Dockerfile Cheat Sheet

A quick reference for the Dockerfile instructions I am most likely to use.

---

## Table of Contents

| Section                                           | Description                               |
| ------------------------------------------------- | ----------------------------------------- |
| [What Is a Dockerfile?](#what-is-a-dockerfile)    | Defines how Docker builds an image        |
| [Basic Structure](#basic-structure)               | Common Dockerfile layout                  |
| [FROM](#from)                                     | Choose the base image                     |
| [WORKDIR](#workdir)                               | Set the working directory                 |
| [COPY](#copy)                                     | Copy files into the image                 |
| [RUN](#run)                                       | Execute commands while building           |
| [EXPOSE](#expose)                                 | Document the application port             |
| [CMD](#cmd)                                       | Default command when the container starts |
| [ENV](#env)                                       | Set environment variables                 |
| [.dockerignore](#dockerignore)                    | Exclude files from the build              |
| [React and Vite Example](#react-and-vite-example) | Development Dockerfile                    |
| [Python Example](#python-example)                 | Python application Dockerfile             |
| [Build and Run](#build-and-run)                   | Commands used with a Dockerfile           |
| [Common Problems](#common-problems)               | Frequent Dockerfile mistakes              |
| [Improved Node Pattern](#improved-node-pattern)   | Better dependency caching                 |

---

# What Is a Dockerfile?

A `Dockerfile` is a text file containing instructions Docker uses to build an image.

The file is normally named exactly:

```text
Dockerfile
```

No file extension is required.

Basic process:

```text
Dockerfile
↓
docker build
↓
Docker image
↓
docker run
↓
Running container
```

---

# Basic Structure

```dockerfile
FROM node:24

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

# FROM

Selects the base image.

```dockerfile
FROM node:24
```

Python example:

```dockerfile
FROM python:3.13
```

Small Node image:

```dockerfile
FROM node:24-alpine
```

`FROM` is usually the first instruction in the Dockerfile.

---

# WORKDIR

Sets the working directory inside the image.

```dockerfile
WORKDIR /app
```

After this instruction, commands operate from `/app`.

For example:

```dockerfile
WORKDIR /app

RUN npm install
```

This runs `npm install` inside `/app`.

Docker creates the directory if it does not already exist.

---

# COPY

Copies files from your computer into the Docker image.

Copy everything:

```dockerfile
COPY . .
```

Meaning:

```text
COPY <source> <destination>
```

The first `.` means the current project folder on your computer.

The second `.` means the current `WORKDIR` inside the image.

Copy one file:

```dockerfile
COPY package.json .
```

Copy multiple dependency files:

```dockerfile
COPY package.json package-lock.json ./
```

Copy a folder:

```dockerfile
COPY src ./src
```

---

# RUN

Executes a command while Docker is building the image.

```dockerfile
RUN npm install
```

Python example:

```dockerfile
RUN pip install -r requirements.txt
```

Multiple commands:

```dockerfile
RUN npm install && npm run build
```

Each `RUN` instruction creates a new image layer.

`RUN` happens during:

```bash
docker build
```

It does not run every time the container starts.

---

# EXPOSE

Documents which port the application uses.

```dockerfile
EXPOSE 5173
```

For many web servers:

```dockerfile
EXPOSE 3000
```

Python Flask example:

```dockerfile
EXPOSE 5000
```

`EXPOSE` does not automatically publish the port to your computer.

You still need:

```bash
docker run -p 5173:5173 image-name
```

Port mapping format:

```text
-p <computer-port>:<container-port>
```

---

# CMD

Specifies the default command that runs when the container starts.

```dockerfile
CMD ["npm", "run", "dev"]
```

Vite inside Docker:

```dockerfile
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Python example:

```dockerfile
CMD ["python", "main.py"]
```

Preferred format:

```dockerfile
CMD ["command", "argument1", "argument2"]
```

Avoid this when possible:

```dockerfile
CMD npm run dev
```

A Dockerfile should normally contain only one `CMD`.

---

# RUN vs CMD

| Instruction | When it runs              | Purpose                               |
| ----------- | ------------------------- | ------------------------------------- |
| `RUN`       | While building the image  | Install packages or prepare the image |
| `CMD`       | When starting a container | Start the application                 |

Example:

```dockerfile
RUN npm install

CMD ["npm", "run", "dev"]
```

`npm install` happens during the build.

`npm run dev` happens when the container starts.

---

# ENV

Creates an environment variable inside the image.

```dockerfile
ENV NODE_ENV=development
```

Multiple variables:

```dockerfile
ENV HOST=0.0.0.0
ENV PORT=5173
```

Use in Python:

```python
import os

port = os.getenv("PORT")
```

Do not place passwords, tokens, or private keys directly in a Dockerfile.

---

# .dockerignore

A `.dockerignore` file prevents unnecessary files from being copied into the image.

Create:

```text
.dockerignore
```

Typical Node version:

```text
node_modules
dist
.git
.gitignore
Dockerfile
README.md
npm-debug.log
```

Typical Python version:

```text
__pycache__
*.pyc
.venv
venv
.git
.pytest_cache
.env
```

Benefits:

- Smaller build context
- Faster builds
- Avoids copying local dependencies
- Avoids copying private files accidentally

---

# React and Vite Example

Simple development Dockerfile:

```dockerfile
FROM node:24

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Build:

```bash
docker build -t react-img .
```

Run:

```bash
docker run --rm -it -p 5173:5173 react-img
```

Run with a bind mount:

```bash
docker run --rm -it \
  -p 5173:5173 \
  -v "$(pwd):/app" \
  react-img
```

When using a bind mount, local files replace the contents of `/app`.

A safer Node development command may use a separate container volume for `node_modules`:

```bash
docker run --rm -it \
  -p 5173:5173 \
  -v "$(pwd):/app" \
  -v /app/node_modules \
  react-img
```

---

# Python Example

```dockerfile
FROM python:3.13

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

Build:

```bash
docker build -t python-app .
```

Run:

```bash
docker run --rm python-app
```

---

# Build and Run

Build from the current directory:

```bash
docker build -t my-image .
```

Build without using cached layers:

```bash
docker build --no-cache -t my-image .
```

Run:

```bash
docker run my-image
```

Run and remove afterward:

```bash
docker run --rm my-image
```

Run interactively:

```bash
docker run --rm -it my-image
```

Publish a port:

```bash
docker run --rm -p 5173:5173 my-image
```

Name the container:

```bash
docker run --name my-container my-image
```

Use a different Dockerfile:

```bash
docker build -f Dockerfile.dev -t my-image .
```

---

# Common Problems

## Dependency Installed in the Wrong Folder

Your Docker build only sees files inside the build context.

For example:

```bash
docker build -t react-img .
```

The final `.` means:

```text
Use the current directory as the build context.
```

If your actual React app is inside `client`, either enter that folder:

```bash
cd client
docker build -t react-img .
```

or build it from the parent directory:

```bash
docker build -t react-img ./client
```

---

## Package Missing Inside the Container

After adding a dependency:

```bash
npm install react-bootstrap bootstrap
```

rebuild the image:

```bash
docker build -t react-img .
```

The old image does not automatically know about newly installed packages.

---

## Vite Cannot Be Opened in the Browser

Use:

```dockerfile
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Then publish the port:

```bash
docker run -p 5173:5173 react-img
```

Without `--host 0.0.0.0`, Vite may only listen inside the container.

---

## Port Is Already in Use

Use a different computer port:

```bash
docker run -p 5174:5173 react-img
```

Then open:

```text
http://localhost:5174
```

The application still uses port `5173` inside the container.

---

## Changes Do Not Appear

Possible causes:

- The image was not rebuilt.
- The project folder was not mounted.
- The bind mount points to the wrong folder.
- The container is still running an old image.

Rebuild:

```bash
docker build -t react-img .
```

Stop the old container, then run a new one.

---

# Improved Node Pattern

This version improves Docker layer caching:

```dockerfile
FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Why copy `package.json` first?

Docker can reuse the dependency-installation layer when your source code changes but your dependencies do not.

```text
package files unchanged
↓
Reuse npm install layer
↓
Faster rebuild
```

When `package.json` changes, Docker runs `npm install` again.

---

# Development Dockerfile

You can name a development-specific file:

```text
Dockerfile.dev
```

Example:

```dockerfile
FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Build it with:

```bash
docker build -f Dockerfile.dev -t react-dev .
```

---

# Typical React Workflow

Install dependencies locally:

```bash
npm install
```

Build the image:

```bash
docker build -t react-img .
```

Run the container:

```bash
docker run --rm -it -p 5173:5173 react-img
```

Stop it:

```text
Ctrl + C
```

After changing dependencies:

```bash
docker build -t react-img .
```

Run the rebuilt image:

```bash
docker run --rm -it -p 5173:5173 react-img
```

---

# Instructions I Use Most

```dockerfile
FROM
WORKDIR
COPY
RUN
EXPOSE
CMD
ENV
```

Most common React Dockerfile:

```dockerfile
FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```
