# Docker Cheat Sheet

A quick reference for the Docker commands I use most often.

---

## Table of Contents

| Section                               | Description                     |
| ------------------------------------- | ------------------------------- |
| [Images](#images)                     | Build and manage images         |
| [Containers](#containers)             | Run and manage containers       |
| [Logs](#logs)                         | View container output           |
| [Shell](#shell)                       | Open a shell inside a container |
| [Cleanup](#cleanup)                   | Remove containers and images    |
| [Docker Compose](#docker-compose)     | Multi-container projects        |
| [Useful Commands](#useful-commands)   | General Docker information      |
| [Typical Workflow](#typical-workflow) | My normal Docker workflow       |

---

# Images

Build an image

```bash
docker build -t react-img .
```

List images

```bash
docker images
```

Remove an image

```bash
docker rmi react-img
```

Remove an image by ID

```bash
docker rmi <IMAGE_ID>
```

---

# Containers

Run a container

```bash
docker run react-img
```

Run and remove when finished

```bash
docker run --rm react-img
```

Run a Vite React app

```bash
docker run --rm -it -p 5173:5173 react-img
```

Run with a mounted project folder

```bash
docker run --rm -it \
-v $(pwd):/app \
-p 5173:5173 \
react-img
```

List running containers

```bash
docker ps
```

List all containers

```bash
docker ps -a
```

Stop a container

```bash
docker stop <CONTAINER_ID>
```

Start a stopped container

```bash
docker start <CONTAINER_ID>
```

Restart a container

```bash
docker restart <CONTAINER_ID>
```

---

# Logs

View logs

```bash
docker logs <CONTAINER_ID>
```

Follow logs live

```bash
docker logs -f <CONTAINER_ID>
```

---

# Shell

Open Bash

```bash
docker exec -it <CONTAINER_ID> bash
```

If Bash isn't installed

```bash
docker exec -it <CONTAINER_ID> sh
```

---

# Cleanup

Remove a container

```bash
docker rm <CONTAINER_ID>
```

Remove all stopped containers

```bash
docker container prune
```

Remove unused images

```bash
docker image prune
```

Remove everything unused

```bash
docker system prune
```

Remove everything including unused images

```bash
docker system prune -a
```

---

# Docker Compose

Start services

```bash
docker compose up
```

Run in background

```bash
docker compose up -d
```

Stop services

```bash
docker compose down
```

Rebuild

```bash
docker compose up --build
```

---

# Useful Commands

Docker version

```bash
docker --version
```

Docker information

```bash
docker info
```

View running processes

```bash
docker top <CONTAINER_ID>
```

Inspect a container

```bash
docker inspect <CONTAINER_ID>
```

---

# Typical Workflow

Build image

```bash
docker build -t react-img .
```

Run project

```bash
docker run --rm -it -p 5173:5173 react-img
```

Stop project

```bash
Ctrl + C
```

Clean up (if needed)

```bash
docker system prune
```
