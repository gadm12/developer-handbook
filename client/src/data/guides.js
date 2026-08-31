// Guide content, extracted from the old static site (see legacy-reference/).
//
// Block types: h2, h3, p, ul{items}, code{lang,code}, note{text|items},
// warn{text|items}. Backticks in prose render as inline code.
//
// Add a guide by appending to this array — the sidebar and router pick it up.

const docker = {
  id: 'docker',
  label: 'Docker & Compose',
  lede: 'Every file in the stack — dev and prod compose, three Dockerfiles, the nginx vhost, the Makefile — plus the commands that drive them.',
  blocks: [
    { type: 'h2', text: 'Project layout' },
    {
      type: 'code',
      lang: 'bash',
      code: `root/
├── client/
│   ├── nginx/
│   │   └── default.conf
│   ├── .dockerignore
│   └── Dockerfile
├── server/
│   ├── .env
│   ├── .dockerignore
│   └── Dockerfile
├── db/
│   ├── .dockerignore
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── .gitignore
└── README.md`,
    },
    {
      type: 'p',
      text: 'Four services — Postgres, Redis, Django, React — each with its own build context. Compose is the only entry point; there are no per-service shell scripts and the Dockerfiles are never built by hand.',
    },
    {
      type: 'note',
      text: 'The Scaffold Generator has this exact tree as its "Full Stack Root" preset, so you can generate the folders and empty files in one command.',
    },

    { type: 'h2', text: 'docker-compose.yml' },
    {
      type: 'code',
      lang: 'yaml',
      code: `services:
  db:
    build: ./db
    container_name: db-container
    env_file:
      - ./server/.env
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: redis-container

  backend:
    build: ./server
    container_name: django-container
    command: python manage.py runserver 0.0.0.0:8000
    env_file:
      - ./server/.env
    ports:
      - "8000:8000"
    volumes:
      - ./server:/app
    depends_on:
      - db
      - redis

  frontend:
    build:
      context: ./client
      target: build
    container_name: react-container
    command: npm run dev -- --host 0.0.0.0
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:`,
    },
    {
      type: 'p',
      text: 'The development stack. Both app services override their image `CMD` with a dev server: Django runs `runserver` instead of gunicorn, and the client runs Vite instead of being built and handed to nginx. `target: build` stops the multi-stage client image at its builder stage, which is why the Vite binary is still there to run.',
    },
    {
      type: 'ul',
      items: [
        '`./server:/app` and `./client:/app` are bind mounts — your source is mapped in, so edits reload without a rebuild.',
        '`- /app/node_modules` is an anonymous volume layered over the client bind mount. Without it your host `node_modules` shadows the one `npm ci` installed in the image, and the container starts with nothing.',
        '`postgres_data` is a named volume, so the database survives `docker compose down`.',
        'Both dev servers bind `0.0.0.0`. A process on `127.0.0.1` inside a container is unreachable from the host even with the port published.',
      ],
    },

    { type: 'h2', text: 'docker-compose.prod.yml' },
    {
      type: 'code',
      lang: 'yaml',
      code: `services:
  db:
    build: ./db
    container_name: db-container
    restart: unless-stopped
    env_file:
      - ./server/.env
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: redis-container
    restart: unless-stopped

  backend:
    build: ./server
    container_name: django-container
    restart: unless-stopped
    env_file:
      - ./server/.env
    depends_on:
      - db
      - redis

  frontend:
    build: ./client
    container_name: react-container
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend

volumes:
  postgres_data:`,
    },
    {
      type: 'p',
      text: 'A separate file rather than an override, run with `-f docker-compose.prod.yml`. Every dev convenience is gone and the differences are the whole point:',
    },
    {
      type: 'ul',
      items: [
        'Every service gains `restart: unless-stopped` so the stack comes back after a reboot or a crash.',
        '`backend` loses its `command`, its published port, and its bind mount — it runs the baked image under gunicorn and is reachable only through nginx on the internal network.',
        '`frontend` drops `target: build`, so the full multi-stage image is used and nginx serves the compiled `dist/`. It publishes `80` and `443` and mounts the Let\'s Encrypt certificates read-only.',
        'No source is mounted anywhere — what runs is exactly what was built.',
      ],
    },

    { type: 'h2', text: 'server/Dockerfile' },
    {
      type: 'code',
      lang: 'dockerfile',
      code: `FROM python:3.13-slim

WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

RUN echo 'alias pm="python manage.py"' >> /root/.bashrc

CMD ["gunicorn", "server.wsgi:application", "--bind", "0.0.0.0:8000"]`,
    },
    {
      type: 'p',
      text: 'Copying `requirements.txt` on its own before `COPY . .` is deliberate: Docker caches per instruction, so as long as dependencies are unchanged the install layer is reused and a code edit rebuilds in seconds. The `pm` alias is baked into the image so it exists whenever you shell in. `CMD` is gunicorn — production behaviour by default, with the dev compose file overriding it with `runserver`.',
    },

    { type: 'h2', text: 'server/.dockerignore' },
    {
      type: 'code',
      lang: 'bash',
      code: `__pycache__
*.py[cod]
.pytest_cache
.mypy_cache
.venv
venv
.env
.env.*
.git
.gitignore
*.sqlite3`,
    },
    {
      type: 'p',
      text: 'Keeps the build context small and keeps secrets out of the image. `.venv` matters most — copying a host virtualenv into a Linux image gives you binaries built for the wrong platform on top of a much slower build. `.env` and `.env.*` are excluded because the values arrive at runtime through `env_file`, never baked into a layer.',
    },

    { type: 'h2', text: 'client/Dockerfile' },
    {
      type: 'code',
      lang: 'dockerfile',
      code: `FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf`,
    },
    {
      type: 'p',
      text: 'Two stages. The `build` stage needs Node and the full dependency tree; the image you ship needs neither, so `COPY --from=build` lifts only the compiled `dist/` into an nginx image and everything else is discarded. Same manifest-before-source ordering as the server, and `npm ci` rather than `npm install` so the lockfile is honoured exactly. Dev stops at `target: build`; prod runs the whole thing.',
    },

    { type: 'h2', text: 'client/.dockerignore' },
    {
      type: 'code',
      lang: 'bash',
      code: `node_modules
dist
.git
.gitignore
.env
.env.*
npm-debug.log*
README.md`,
    },
    {
      type: 'p',
      text: '`node_modules` is the important line — the image installs its own with `npm ci`, and copying the host copy in would both bloat the context and risk platform-mismatched native modules. `dist` is excluded for the same reason: it is built inside the image, not carried in.',
    },

    { type: 'h2', text: 'client/nginx/default.conf' },
    {
      type: 'code',
      lang: 'nginx',
      code: `# port 80 to redirect everything to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name gains-squad.duckdns.org www.gains-squad.duckdns.org;

    return 301 https://gains-squad.duckdns.org$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name gains-squad.duckdns.org www.gains-squad.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/gains-squad.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gains-squad.duckdns.org/privkey.pem;

    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;

        proxy_http_version 1.1;


        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
    },
    {
      type: 'p',
      text: 'Copied into the client image at build time, so it ships with the container rather than living on the host. The first block does nothing but redirect `:80` to HTTPS; the second terminates TLS with the mounted Let\'s Encrypt certificates and serves the app.',
    },
    {
      type: 'ul',
      items: [
        '`try_files $uri $uri/ /index.html` is the SPA fallback. Without it a refresh on a client-side route returns 404, because no such file exists on disk.',
        '`proxy_pass http://backend:8000` is compose service-name DNS — no IP, no container name, no link. It works because nginx and Django share the compose network.',
        'The `X-Forwarded-*` headers are what let Django see the original scheme and client IP; pair them with `SECURE_PROXY_SSL_HEADER` in settings or it will think every request arrived over plain HTTP.',
        'Certificates are read from `/etc/letsencrypt`, which the prod compose file mounts read-only from the host — so renewing on the host is enough, no rebuild needed.',
      ],
    },
    {
      type: 'warn',
      text: 'This file is carried over verbatim from your notes, including the real `gains-squad.duckdns.org` hostname and certificate paths. Swap the domain in all five places when reusing it for another project.',
    },

    { type: 'h2', text: 'db/Dockerfile' },
    {
      type: 'code',
      lang: 'dockerfile',
      code: `FROM postgres:15

EXPOSE 5432

CMD [ "postgres" ]`,
    },
    {
      type: 'p',
      text: 'Deliberately almost empty — the official image already does the work. There is a Dockerfile at all so the database is a first-class build context you can extend later (an init SQL script, an extension) without restructuring compose. Credentials are not baked in: they arrive from `env_file`, so the image carries no secrets and can be rebuilt freely.',
    },

    { type: 'h2', text: 'db/.dockerignore' },
    {
      type: 'p',
      text: 'Present but empty. The build context is one four-line Dockerfile, so there is nothing to exclude — the file exists to keep the three services structurally identical and to give you somewhere obvious to add exclusions if the folder ever grows.',
    },

    { type: 'h2', text: 'Makefile' },
    {
      type: 'code',
      lang: 'makefile',
      code: `dev:
\tdocker compose up --build

dev-down:
\tdocker compose down

prod:
\tdocker compose -f docker-compose.prod.yml up -d --build

prod-down:
\tdocker compose -f docker-compose.prod.yml down

logs:
\tdocker compose logs -f

backend:
\tdocker compose exec backend bash

frontend:
\tdocker compose exec frontend sh`,
    },
    {
      type: 'p',
      text: 'Mostly here so the `-f docker-compose.prod.yml` flag is never mistyped — the difference between `make dev` and `make prod` is one word rather than a long command you might get wrong on a server. Note `bash` for the backend and `sh` for the frontend: the Python image has bash, the alpine-based Node image does not.',
    },
    { type: 'h3', text: 'Optional additions' },
    {
      type: 'note',
      text: 'Everything below is my suggestion, not from your notes. `.PHONY` is the one I would actually add — without it, `make backend` would silently do nothing if a directory named `backend` ever appeared next to the Makefile.',
    },
    {
      type: 'code',
      lang: 'makefile',
      code: `.PHONY: dev dev-down prod prod-down logs backend frontend \\
        up down ps build migrate makemigrations shell superuser psql clean

up: dev
down: dev-down

ps:
\tdocker compose ps

build:
\tdocker compose build --no-cache

migrate:
\tdocker compose exec backend python manage.py migrate

makemigrations:
\tdocker compose exec backend python manage.py makemigrations

shell:
\tdocker compose exec backend python manage.py shell

superuser:
\tdocker compose exec backend python manage.py createsuperuser

psql:
\tdocker compose exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

clean:
\tdocker compose down -v
\tdocker system prune -f`,
    },
    {
      type: 'warn',
      text: '`make clean` runs `down -v`, which deletes the `postgres_data` volume and wipes the database. Keep it named something you will not type by accident.',
    },

    { type: 'h2', text: 'Commands' },
    {
      type: 'p',
      text: 'Everything below comes from your notes unless the line is marked *(added)* — those are standard commands that were not in the original list but come up constantly.',
    },

    { type: 'h3', text: 'Starting and stopping' },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose up
docker compose up -d
docker compose up -d db
docker compose down
docker compose down -v
docker compose stop
docker compose start`,
    },
    {
      type: 'ul',
      items: [
        '`up` — start the whole stack in the foreground, logs streaming. Best when you are actively debugging startup.',
        '`up -d` — detached, runs quietly in the background. The normal way to start.',
        '`up -d db` — start a single service and its dependencies. Useful when you only need Postgres up while running Django on the host.',
        '`down` — stop and remove the containers. Volumes survive, so your data is intact. Run it from the directory holding `docker-compose.yml`.',
        '`down -v` — **also deletes the volumes, which wipes the database.** Only when you want a genuinely clean slate.',
        '`stop` / `start` — *(added)* pause and resume without removing containers. Faster than `down` + `up` when you just need the ports back.',
      ],
    },

    { type: 'h3', text: 'Rebuilding' },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose up --build
docker compose up --build -d
docker compose up -d --build frontend
docker compose up -d --build backend
docker compose up -d --force-recreate backend
docker compose restart backend
docker compose build --no-cache backend
docker compose pull`,
    },
    {
      type: 'ul',
      items: [
        '`up --build` — rebuild images, then start. Needed after changing a Dockerfile or adding a dependency.',
        '`up -d --build frontend` — rebuild one service only. Much faster than rebuilding all four when you touched a single manifest.',
        '`up -d --force-recreate backend` — **the one after editing `.env`.** A rebuild alone will not pick up new environment values; the container has to be recreated.',
        '`restart backend` — restart without rebuilding. Enough for a stuck process, useless for code or dependency changes.',
        '`build --no-cache backend` — *(added)* rebuild ignoring the layer cache. The escape hatch when a build is reusing a stale layer it should not be.',
        '`pull` — *(added)* fetch newer base images (`redis:7`, `postgres:15`, `nginx:alpine`) without touching your own builds.',
      ],
    },

    { type: 'h3', text: 'Inspecting' },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose ps
docker compose logs -f
docker compose logs -f backend
docker exec -it django-container bash
docker compose exec backend bash
docker compose exec frontend sh
docker exec django-container env | grep POSTGRES
docker compose config`,
    },
    {
      type: 'ul',
      items: [
        '`ps` — what is actually running, and which ports are published. First thing to check when something will not connect.',
        '`logs -f backend` — follow one service. Without the service name you get all four interleaved, which is rarely what you want.',
        '`exec backend bash` — shell into the running backend. Where you run migrations, the Django shell, and anything else that needs the app environment. Use `sh` for the alpine-based frontend.',
        '`docker exec django-container env | grep POSTGRES` — read the database name and password the container actually received. The fastest way to confirm `.env` was picked up.',
        '`config` — *(added)* print the fully resolved compose file with variables substituted. Best way to see what compose thinks you wrote before blaming the stack.',
      ],
    },

    { type: 'h3', text: 'Django management' },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose exec backend python manage.py migrate

docker compose exec backend python manage.py loaddata subject_data.json student_data.json grade_data.json

docker compose exec backend bash
python manage.py loaddata subject_data.json student_data.json grade_data.json`,
    },
    {
      type: 'ul',
      items: [
        'Run these **inside the container**, either as a one-off `exec` or from a shell you have already opened — both forms are equivalent. Running them on the host points at a different database, which is the usual cause of `relation does not exist`.',
        'Once inside, the `pm` alias baked into the image shortens `python manage.py` to `pm`.',
        'Fixture order matters: load parents before children or the foreign keys will not resolve.',
      ],
    },

    { type: 'h3', text: 'Cleanup (added)' },
    {
      type: 'note',
      text: 'None of this section was in your notes, but disk usage from old images and build cache is the most common reason Docker suddenly stops working.',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `docker system df
docker image prune
docker container prune
docker builder prune -a
docker system prune -a`,
    },
    {
      type: 'ul',
      items: [
        '`system df` — where the disk went, broken down by images, containers, volumes and build cache. Always start here.',
        '`image prune` — remove dangling images left behind by rebuilds. Safe, and usually reclaims the most.',
        '`container prune` — remove stopped containers.',
        '`builder prune -a` — clear the build cache. Reclaims a lot; your next build will be slow.',
        '`system prune -a` — everything unused at once, including images no container references. Note it does **not** touch named volumes, so `postgres_data` is safe unless you add `--volumes`.',
      ],
    },

    { type: 'h2', text: 'Common problems' },
    { type: 'h3', text: 'Changes to .env are ignored' },
    {
      type: 'p',
      text: 'Rebuilding does not help — environment values are read when the container is created. Use `docker compose up -d --force-recreate backend`.',
    },
    { type: 'h3', text: 'A package you installed is missing inside the container' },
    {
      type: 'p',
      text: 'Installing on the host does not change the image. Rebuild the one service: `docker compose up -d --build backend`.',
    },
    { type: 'h3', text: 'Vite will not open in the browser' },
    {
      type: 'p',
      text: 'You need the published port and the host flag together — `ports: "5173:5173"` plus `--host 0.0.0.0` in the compose `command`. Without the flag Vite listens only on the container loopback.',
    },
    { type: 'h3', text: 'Code changes do not appear' },
    {
      type: 'ul',
      items: [
        'The service has no bind mount, or it is mounted at the wrong path — check `volumes:` for that service.',
        'You are running the prod compose file, which deliberately mounts no source.',
        'An old container is still up; confirm with `docker compose ps`.',
      ],
    },
    { type: 'h3', text: 'relation does not exist' },
    {
      type: 'p',
      text: 'Migrations were never applied to this database, or you ran them on the host against a different one. Run `docker compose exec backend python manage.py migrate`.',
    },
    { type: 'h3', text: '502 Bad Gateway from nginx in production' },
    {
      type: 'p',
      text: 'nginx is up but cannot reach `backend:8000`. Check `docker compose -f docker-compose.prod.yml logs -f backend` — usually gunicorn failed to boot, so the proxy target never came up.',
    },
  ],
}

const django = {
  id: 'django',
  label: 'venv + Django Init',
  lede: 'From an empty folder to a running Django project, in the order that avoids rework.',
  blocks: [
    { type: 'h2', text: 'The short version' },
    {
      type: 'p',
      text: 'If you already know the shape and just want the commands:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `python3 -m venv .venv
source .venv/bin/activate
alias pm="python manage.py"
pip install django "psycopg[binary]"
django-admin startproject server
cd server
pm runserver
pip freeze > requirements.txt`,
    },
    {
      type: 'note',
      text: 'Set the `pm` alias early — every Django command below uses it. Add it to the image too (`RUN echo \'alias pm="python manage.py"\' >> /root/.bashrc`) so it works inside the container as well.',
    },

    { type: 'h2', text: '1. Virtual environment' },
    {
      type: 'code',
      lang: 'bash',
      code: `deactivate           # leave any environment you are already in
python3 -m venv .venv
source .venv/bin/activate`,
    },
    {
      type: 'p',
      text: 'With `direnv` installed you can skip the activation step entirely — the environment turns on when you `cd` into the project and off when you leave:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `touch .envrc

echo 'export VIRTUAL_ENV="$PWD/.venv"
PATH_add "$VIRTUAL_ENV/bin"' > .envrc

direnv allow`,
    },
    {
      type: 'p',
      text: 'And point VS Code at the same interpreter so its linting matches your shell:',
    },
    {
      type: 'code',
      lang: 'json',
      code: `{
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": false
}`,
    },

    { type: 'h2', text: '2. .gitignore, before the first commit' },
    {
      type: 'code',
      lang: 'bash',
      code: `cat >> .gitignore << 'EOF'

# Python
.venv/
__pycache__/
*.py[cod]
*.sqlite3

# Environment Variables
.env
.env.*

# Testing / Coverage
.pytest_cache/
.coverage
htmlcov/

# Linters / Type Checking / Cache
.mypy_cache/
.ruff_cache/
.cache/

# VS Code / IDE
.vscode/
.idea/

# Node / React
node_modules/
dist/
build/

# Logs
*.log

# Operating System Files
.DS_Store
*Zone.Identifier*
EOF`,
    },
    {
      type: 'p',
      text: 'To check nothing sensitive is already tracked:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `git ls-files | grep -E '(^|/)\\.env($|\\.)'`,
    },
    {
      type: 'note',
      text: 'A global ignore file catches editor and OS junk across every repo: `git config --global core.excludesfile ~/.gitignore_global`.',
    },

    { type: 'h2', text: '3. Dependencies' },
    {
      type: 'p',
      text: 'Install what you know you will need up front, then freeze once. Freezing after every single install produces a churn-heavy `requirements.txt`.',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `pip install django "psycopg[binary]" djangorestframework django-cors-headers \\
  requests requests_oauthlib python-dotenv pylint-django gunicorn \\
  django-redis rich pillow djangorestframework-simplejwt`,
    },
    {
      type: 'code',
      lang: 'bash',
      code: `pip freeze > requirements.txt   # write it
pip install -r requirements.txt # restore it elsewhere`,
    },

    { type: 'h2', text: '4. Create the project and an app' },
    {
      type: 'code',
      lang: 'bash',
      code: `django-admin startproject server
cd server
pm startapp user_app`,
    },
    {
      type: 'warn',
      text: 'An app that is not in `INSTALLED_APPS` is invisible: no models, no migrations, no admin entry, no table. This is the most common reason `makemigrations` reports "No changes detected".',
    },
    {
      type: 'code',
      lang: 'python',
      code: `INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "user_app",
]`,
    },

    { type: 'h2', text: '5. Settings driven by environment' },
    {
      type: 'p',
      text: 'Nothing environment-specific should be a literal in `settings.py`. See the PostgreSQL guide for the matching `.env`.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `import os

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get(
    "ALLOWED_HOSTS", "backend,localhost,127.0.0.1"
).split(",")`,
    },
    {
      type: 'p',
      text: 'Generate a secret key rather than reusing the one Django scaffolded:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose run --rm backend python -c \\
  "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`,
    },
    {
      type: 'p',
      text: 'Load the `.env` relative to the settings file, not the working directory — otherwise it resolves differently depending on where you ran the command from:',
    },
    {
      type: 'code',
      lang: 'python',
      code: `from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")`,
    },

    { type: 'h2', text: '6. CORS, once React is talking to Django' },
    {
      type: 'p',
      text: 'React on `localhost:5173` calling Django on `localhost:8000` is a cross-origin request. The browser blocks reading the response unless Django says otherwise.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",   # must come first
    "django.middleware.common.CommonMiddleware",
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]`,
    },
    {
      type: 'warn',
      text: '`CorsMiddleware` must sit **before** `CommonMiddleware`. In the wrong order the headers are added too late and you still get "blocked by CORS policy" — which means Django did respond, the browser just refused to hand the response to your code.',
    },

    { type: 'h2', text: '7. Migrations' },
    {
      type: 'code',
      lang: 'bash',
      code: `pm makemigrations   # writes a migration file; the database is untouched
pm migrate          # applies it to Postgres
pm createsuperuser`,
    },
    {
      type: 'note',
      text: 'Run these **inside the backend container** — `docker compose exec backend bash` first. Running them on the host points at a different database, which is what `relation does not exist` usually means.',
    },
    { type: 'h3', text: 'Fixtures' },
    {
      type: 'code',
      lang: 'bash',
      code: `mkdir -p user_app/fixtures
pm dumpdata user_app.User --indent 2 > user_app/fixtures/user_data.json
pm loaddata user_app/fixtures/user_data.json`,
    },
    {
      type: 'warn',
      text: 'Fixtures are model data, not a database backup. Migrate before you load, and load parents before children or the foreign keys will not resolve.',
    },

    { type: 'h2', text: '8. Rate limiting your API' },
    {
      type: 'p',
      text: 'DRF has throttling built in, so you do not need `django-ratelimit`. Counters are stored in your cache — with Redis configured they land there automatically.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "10/min",
        "user": "100/hour",
    },
}`,
    },
    {
      type: 'p',
      text: 'Or per view:',
    },
    {
      type: 'code',
      lang: 'python',
      code: `from rest_framework.throttling import UserRateThrottle


class BookView(APIView):
    throttle_classes = [UserRateThrottle]`,
    },
    {
      type: 'p',
      text: 'Verify it — the eleventh request should come back `429`:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `for i in $(seq 1 12); do
    curl -s -o /dev/null -w "%{http_code}\\n" \\
    http://localhost:8000/api/v1/book/
done`,
    },

    { type: 'h2', text: 'Optional: better tracebacks' },
    {
      type: 'p',
      text: 'Wrapped in `try/except ImportError` so production, where `rich` may not be installed, still boots. Goes at the top of `manage.py`.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `try:
    from rich import print
    from rich.traceback import install
    from dotenv import load_dotenv

    install(show_locals=True)
    load_dotenv()

    print("[bold green]Starting Django...[/bold green]")

except ImportError:
    pass`,
    },

    { type: 'h2', text: 'Troubleshooting' },
    {
      type: 'ul',
      items: [
        '**No changes detected** — the app is missing from `INSTALLED_APPS`.',
        '**relation does not exist** — the migration was never applied, or you are connected to a different database than the one you migrated.',
        '**Connection refused** — check `docker compose ps`, port `5432`, and that the credentials in `.env` match the ones the db container was created with.',
        '**Permission denied on generated files** — they were created as root inside the container. Fix with `sudo chown -R $USER:$USER server/user_app`.',
        '**Admin shows "User object (1)"** — add a `__str__` method to the model.',
      ],
    },
  ],
}

const react = {
  id: 'react',
  label: 'React / Vite Init',
  lede: 'Scaffolding a Vite client, the dependencies worth adding on day one, and the errors that follow.',
  blocks: [
    { type: 'h2', text: 'Create the app' },
    {
      type: 'code',
      lang: 'bash',
      code: `npm create vite@latest client`,
    },
    {
      type: 'p',
      text: 'It prompts for a framework and a variant — pick **React**, then **JavaScript**. Then:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `cd client
npm install
npm run dev`,
    },
    {
      type: 'p',
      text: 'Joining a project that already exists is the same minus the scaffold:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `git clone <repository-url>
cd <project-folder>
npm install
npm run dev`,
    },

    { type: 'h2', text: 'Dependencies' },
    {
      type: 'code',
      lang: 'bash',
      code: `npm install axios react-router-dom clsx uuid
npm install -D cypress eslint-plugin-cypress prettier
npm install tailwindcss @tailwindcss/vite`,
    },
    {
      type: 'p',
      text: 'Runtime dependencies ship in the bundle; `-D` dev dependencies do not. Getting that split wrong is how a test runner ends up in production.',
    },

    { type: 'h2', text: 'Config' },
    { type: 'h3', text: 'vite.config.js' },
    {
      type: 'code',
      lang: 'javascript',
      code: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`,
    },
    {
      type: 'p',
      text: 'With Tailwind v4 there is no config file and no directives — one import in `index.css` is the whole setup:',
    },
    {
      type: 'code',
      lang: 'css',
      code: `@import "tailwindcss";`,
    },
    { type: 'h3', text: 'package.json scripts' },
    {
      type: 'code',
      lang: 'json',
      code: `{
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "watcher": "vite build --watch",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier . --write",
    "cy:open": "cypress open"
  }
}`,
    },
    {
      type: 'note',
      text: '`--host` matters the moment this runs in Docker: without it Vite listens only on the container loopback and the published port goes nowhere.',
    },
    { type: 'h3', text: 'eslint.config.js' },
    {
      type: 'code',
      lang: 'javascript',
      code: `import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import cypress from "eslint-plugin-cypress";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    files: ["cypress/**/*.{js,jsx}"],
    extends: [cypress.configs.recommended],
  },
]);`,
    },

    { type: 'h2', text: 'Routing' },
    {
      type: 'code',
      lang: 'javascript',
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);`,
    },
    {
      type: 'warn',
      text: 'Keep the catch-all `path: "*"` route last. Routes match in order, so a wildcard placed earlier swallows everything below it.',
    },
    {
      type: 'p',
      text: 'Navigate with `Link`, not `<a>` — an anchor triggers a full page reload and throws away your app state. For a back button, `useNavigate()` then `navigate(-1)`.',
    },

    { type: 'h2', text: 'Environment variables' },
    {
      type: 'p',
      text: 'Vite only exposes variables prefixed `VITE_`, and it inlines them at build time — they are visible in the shipped bundle, so nothing secret goes here.',
    },
    {
      type: 'code',
      lang: 'ini',
      code: `VITE_API_URL=http://localhost:8000
VITE_APP_NAME=My Application`,
    },
    {
      type: 'code',
      lang: 'javascript',
      code: `const apiUrl = import.meta.env.VITE_API_URL;`,
    },

    { type: 'h2', text: 'Common errors' },
    { type: 'h3', text: 'Module not found' },
    {
      type: 'p',
      text: 'Usually a missing install. Run `npm install`. If it persists, the dependency tree is inconsistent:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `rm -rf node_modules
npm install`,
    },
    {
      type: 'p',
      text: 'Still broken? Escalate to dropping the lockfile — but only then, since this discards your pinned versions:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `rm -rf node_modules
rm package-lock.json
npm install`,
    },
    {
      type: 'note',
      text: 'In CI use `npm ci` instead — it installs exactly what the lockfile says and fails if `package.json` and the lockfile disagree.',
    },
    { type: 'h3', text: 'ESLint cannot find the Cypress plugin' },
    {
      type: 'code',
      lang: 'bash',
      code: `npm install -D eslint-plugin-cypress`,
    },
    {
      type: 'p',
      text: 'Then import it and add the override block shown in the ESLint config above.',
    },
    { type: 'h3', text: 'Command not found' },
    {
      type: 'p',
      text: 'Locally installed tools are not on your `PATH`. Use `npx eslint .` or add an npm script and run `npm run lint`.',
    },
    { type: 'h3', text: 'Port already in use' },
    {
      type: 'code',
      lang: 'bash',
      code: `lsof -i :5173
kill -9 <PID>`,
    },
  ],
}

const postgres = {
  id: 'postgres',
  label: 'PostgreSQL',
  lede: 'Running Postgres as a container, pointing Django at it, and proving the tables are really there.',
  blocks: [
    { type: 'h2', text: 'The service' },
    {
      type: 'code',
      lang: 'yaml',
      code: `  db:
    build: ./db
    container_name: db-container
    env_file:
      - ./server/.env
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,
    },
    {
      type: 'p',
      text: 'The named volume is what makes the database survive `docker compose down`. Without it every restart is a fresh, empty Postgres.',
    },
    {
      type: 'code',
      lang: 'dockerfile',
      code: `FROM postgres:15

EXPOSE 5432

CMD [ "postgres" ]`,
    },

    { type: 'h2', text: 'Environment' },
    {
      type: 'p',
      text: 'The official image reads these on first start and creates the role and database from them. Same file feeds Django.',
    },
    {
      type: 'code',
      lang: 'ini',
      code: `SECRET_KEY=<generated>
DEBUG=False

POSTGRES_DB=workout_db
POSTGRES_USER=trainer
POSTGRES_PASSWORD=<choose one>
POSTGRES_HOST=db
POSTGRES_PORT=5432

REDIS_URL=redis://redis:6379/0

ALLOWED_HOSTS=localhost,127.0.0.1`,
    },
    {
      type: 'warn',
      text: 'These variables are read only when the data volume is empty. Changing the password later has no effect until you remove the volume — which also destroys the data.',
    },
    {
      type: 'note',
      text: 'To list which variables are set without printing their values: `cut -d= -f1 server/.env`. Commit a `.env.example` with the names and no values.',
    },

    { type: 'h2', text: 'Connecting Django' },
    {
      type: 'code',
      lang: 'python',
      code: `DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB"),
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_HOST", "db"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}`,
    },
    {
      type: 'p',
      text: '`HOST` defaults to `db` — the compose service name. That is the link between the two halves of the stack: compose provides DNS for the service, so no IP or container name is ever hardcoded. Outside Docker the same setting becomes `localhost`.',
    },
    {
      type: 'p',
      text: 'The driver is `psycopg[binary]`, installed with the quotes:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `pip install "psycopg[binary]"`,
    },

    { type: 'h2', text: 'Verifying from psql' },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose exec db bash
psql -U trainer -d workout_db`,
    },
    {
      type: 'code',
      lang: 'sql',
      code: `\\dt                              -- list tables
\\d user_app_user                 -- describe one table
SELECT * FROM user_app_user;     -- read it
\\q                              -- quit`,
    },
    {
      type: 'p',
      text: 'Or from the Django side, which proves the app and the database agree:',
    },
    {
      type: 'code',
      lang: 'python',
      code: `pm shell

from django.db import connection
print(connection.introspection.table_names())`,
    },

    { type: 'h2', text: 'Field types' },
    {
      type: 'ul',
      items: [
        '`CharField(max_length=…)` → `VARCHAR` — names, short labels.',
        '`TextField` → `TEXT` — notes, descriptions, anything unbounded.',
        '`IntegerField` → `INTEGER` — counts, grades.',
        '`BooleanField` → `BOOLEAN` — flags like `is_active`.',
        '`DateTimeField` → `TIMESTAMP`.',
      ],
    },
    {
      type: 'p',
      text: 'Django adds a `BigAutoField` primary key automatically unless you declare one.',
    },

    { type: 'h2', text: 'Backups vs fixtures' },
    {
      type: 'code',
      lang: 'bash',
      code: `pg_dump workout_db > backup.sql              # real backup: schema + data
pm dumpdata user_app.User --indent 2 > f.json # fixture: model rows only`,
    },
    {
      type: 'warn',
      text: 'They are not interchangeable. A fixture carries no schema, so it only loads into an already-migrated database.',
    },

    { type: 'h2', text: 'Troubleshooting' },
    {
      type: 'ul',
      items: [
        '**Connection refused** — the db container is not up (`docker compose ps`), or Django started first. `depends_on` controls start order, not readiness.',
        '**password authentication failed** — the volume was created with different credentials. Either restore the old values or remove the volume and start over.',
        '**relation does not exist** — migrations have not been applied to *this* database.',
        '**database "x" does not exist** — `POSTGRES_DB` and Django\'s `NAME` disagree.',
      ],
    },
  ],
}

const redis = {
  id: 'redis',
  label: 'Redis',
  lede: 'Caching, throttle counters, and sessions — one container doing three jobs.',
  blocks: [
    { type: 'h2', text: 'The service' },
    {
      type: 'code',
      lang: 'yaml',
      code: `  redis:
    image: redis:7
    container_name: redis-container`,
    },
    {
      type: 'p',
      text: 'No build, no volume. Everything in it is disposable by definition — if you would miss it when it vanished, it belongs in Postgres.',
    },

    { type: 'h2', text: 'Wiring Django to it' },
    {
      type: 'code',
      lang: 'bash',
      code: `pip install django-redis`,
    },
    {
      type: 'code',
      lang: 'python',
      code: `CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ.get("REDIS_URL", "redis://redis:6379/0"),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}`,
    },
    {
      type: 'p',
      text: '`redis://redis:6379/0` — the hostname is the compose service name, and `/0` is the database number. Use a different number to keep concerns apart on one server.',
    },

    { type: 'h2', text: 'Caching a view' },
    {
      type: 'p',
      text: 'The cache-aside pattern: look first, do the expensive thing only on a miss, then store the result. Useful whenever you are proxying a slow or rate-limited third-party API.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `from django.core.cache import cache

CACHE_TTL = 300


class BookView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "django")
        cache_key = f"books:{query}"

        cached = cache.get(cache_key)
        if cached is not None:
            return Response(cached)

        response = requests.get(
            endpoint,
            params={"q": query, "maxResults": 10},
            timeout=10,
        )
        data = {"query": query, "count": len(books), "books": books}

        cache.set(cache_key, data, timeout=CACHE_TTL)
        return Response(data)`,
    },
    {
      type: 'note',
      text: 'Test for `is not None` rather than truthiness — a legitimately cached empty list would otherwise look like a miss on every request.',
    },
    {
      type: 'p',
      text: 'Hoist the TTL to a module constant instead of scattering `timeout=300` through your views.',
    },

    { type: 'h2', text: 'Watching it work' },
    {
      type: 'code',
      lang: 'bash',
      code: `docker compose exec redis redis-cli`,
    },
    {
      type: 'code',
      lang: 'bash',
      code: `127.0.0.1:6379> keys *
1) ":1:books:python"
2) ":1:throttle_user_172.20.0.1"
3) ":1:throttle_anon_172.20.0.1"`,
    },
    {
      type: 'p',
      text: 'Two things to notice. The `:1:` prefix is django-redis versioning its keys. And the `throttle_` entries are DRF — configure throttling and the counters land here automatically, no extra setup. Cache and rate limiting share one Redis.',
    },
    {
      type: 'warn',
      text: '`keys *` scans the entire keyspace and blocks the server while it runs. Fine on your laptop, never on production — use `SCAN` there.',
    },
    {
      type: 'p',
      text: 'Other commands worth knowing: `GET <key>`, `TTL <key>` (seconds remaining), `DEL <key>`, `FLUSHDB` (clear this database), `INFO memory`.',
    },

    { type: 'h2', text: 'Sessions' },
    {
      type: 'p',
      text: 'Django stores sessions in the database by default, which means a query on every authenticated request. Point them at the cache instead:',
    },
    {
      type: 'code',
      lang: 'python',
      code: `SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"`,
    },
    {
      type: 'warn',
      text: 'With no persistence configured, restarting Redis logs everyone out. That is usually an acceptable trade; if it is not, use `cached_db` instead, which reads from cache and falls back to the database.',
    },

    { type: 'h2', text: 'As a Celery broker' },
    {
      type: 'p',
      text: 'The same instance can carry your background job queue. Keep it on a different database number so a `FLUSHDB` on the cache does not eat queued tasks.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/1")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/2")`,
    },
    {
      type: 'p',
      text: 'A worker is another compose service running the same image as the backend, with a different command:',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `  worker:
    build: ./server
    command: celery -A server worker --loglevel=info
    env_file:
      - ./server/.env
    depends_on:
      - redis
      - db`,
    },

    { type: 'h2', text: 'What goes where' },
    {
      type: 'ul',
      items: [
        '**Cache** — expensive query results, third-party API responses. Losing it costs latency, nothing else.',
        '**Throttle counters** — handled for you by DRF once a cache is configured.',
        '**Sessions** — fast, but everyone is logged out if Redis restarts.',
        '**Task queue** — separate database number from the cache.',
        '**Not in Redis** — anything you would be upset to lose. That is what Postgres is for.',
      ],
    },
  ],
}

const actions = {
  id: 'github-actions',
  label: 'GitHub Actions',
  lede: 'Workflow anatomy, dependency caching that actually hits, and staying under the rate limits.',
  blocks: [
    { type: 'h2', text: 'Anatomy' },
    {
      type: 'p',
      text: 'Workflows live in `.github/workflows/` and run on GitHub-hosted runners.',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `mkdir -p .github/workflows
touch .github/workflows/tests.yml`,
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`,
    },
    {
      type: 'ul',
      items: [
        '`on:` — what triggers the run. `workflow_dispatch` adds a manual "Run workflow" button, which is worth having on anything that deploys.',
        '`jobs:` — each runs on a fresh machine, in parallel by default. Use `needs:` to force an order.',
        '`uses:` runs a published action; `run:` runs a shell command.',
      ],
    },
    {
      type: 'note',
      text: 'Prefer `npm ci` over `npm install` in CI. It installs exactly what the lockfile pins and fails loudly if the lockfile and `package.json` have drifted — which is precisely what you want a build to tell you.',
    },

    { type: 'h2', text: 'Dependency caching' },
    {
      type: 'p',
      text: 'A fresh runner downloads every dependency from scratch. The setup actions have caching built in — one line, and it keys off your lockfile automatically:',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: client/package-lock.json`,
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `      - uses: actions/setup-python@v7
        with:
          python-version: "3.13"
          cache: pip`,
    },
    {
      type: 'warn',
      text: '`cache: npm` caches the npm **download cache**, not `node_modules`. You still run `npm ci` — it just resolves from disk instead of the network. Skipping the install step entirely will leave you with no dependencies.',
    },
    { type: 'h3', text: 'Caching something else' },
    {
      type: 'p',
      text: 'For anything the setup actions do not cover, use `actions/cache` directly. The mental model is the same one that makes Docker layers work: a key derived from the manifest, so the cache invalidates exactly when the dependencies change.',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `      - uses: actions/cache@v6
        with:
          path: ~/.cache/pip
          key: \${{ runner.os }}-pip-\${{ hashFiles('**/requirements.txt') }}
          restore-keys: |
            \${{ runner.os }}-pip-`,
    },
    {
      type: 'ul',
      items: [
        '`key` — an exact match restores and skips the save at the end.',
        '`restore-keys` — prefixes tried on a miss, newest first. A near-miss beats starting cold.',
        '`hashFiles(...)` — changes the moment the manifest does, which is the whole point.',
      ],
    },
    {
      type: 'note',
      text: 'Caches are scoped per branch, with reads allowed from the default branch. A PR branch cannot see caches from another PR — so a first run on a new branch will look slower than the same run on `main`.',
    },

    { type: 'h2', text: 'Rate limits' },
    { type: 'h3', text: 'The GitHub API' },
    {
      type: 'p',
      text: 'Unauthenticated calls get 60 requests per hour per IP — and runners share IPs, so you can hit that without doing anything unusual. Authenticating raises it to 1,000 per repository per hour. Every workflow already has a token; you just have to pass it:',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `      - name: Query the API
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: gh api repos/\${{ github.repository }}/releases`,
    },
    {
      type: 'p',
      text: 'That secret is created automatically — you do not add it. Grant it only what the job needs:',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `permissions:
  contents: read`,
    },
    { type: 'h3', text: 'Docker Hub' },
    {
      type: 'p',
      text: 'Anonymous pulls are capped per IP, and shared runner IPs make `toomanyrequests: You have reached your pull rate limit` a real failure mode. Log in first, or pull from a registry that does not meter you:',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}`,
    },
    { type: 'h3', text: 'Handling 429 in your own scripts' },
    {
      type: 'p',
      text: 'When a step calls a third-party API, back off rather than failing the build outright:',
    },
    {
      type: 'code',
      lang: 'bash',
      code: `for attempt in 1 2 3 4 5; do
    code=$(curl -s -o /tmp/out -w "%{http_code}" "$URL")
    [ "$code" != "429" ] && break
    sleep $((2 ** attempt))
done`,
    },
    {
      type: 'p',
      text: 'Also worth setting a `timeout-minutes:` on jobs — a step that hangs against a throttled API otherwise burns the full six-hour limit.',
    },

    { type: 'h2', text: 'Secrets' },
    {
      type: 'code',
      lang: 'yaml',
      code: `env:
  NODE_ENV: test

steps:
  - name: Use API key
    run: npm run test:api
    env:
      API_KEY: \${{ secrets.API_KEY }}`,
    },
    {
      type: 'warn',
      text: 'Secrets are masked in logs, but only by exact match. A secret that gets base64-encoded, JSON-escaped, or printed in pieces appears in the clear.',
    },

    { type: 'h2', text: 'Deploying this site' },
    {
      type: 'p',
      text: 'A worked example that uses most of the above — build the Vite app, publish it to GitHub Pages:',
    },
    {
      type: 'code',
      lang: 'yaml',
      code: `name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: client/package-lock.json
      - run: npm ci
        working-directory: client
      - run: npm run build
        working-directory: client
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: client/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5`,
    },
    {
      type: 'note',
      text: 'For a project site the Vite `base` must match the repository name (`base: "/developer-handbook/"`), or every asset URL resolves to the domain root and 404s.',
    },
    {
      type: 'warn',
      text: 'A workflow cannot switch a repository off "Deploy from a branch". Set Settings → Pages → Source to **GitHub Actions** once by hand, or the run goes green and the site never changes.',
    },

    { type: 'h2', text: 'When a run fails' },
    {
      type: 'ul',
      items: [
        'Open the Actions tab, select the failed run, then the failed job.',
        'Expand the red step — the error is at the bottom of its log.',
        'Re-run with debug logging if the message is thin: **Re-run jobs → Enable debug logging**.',
        'Reproduce locally with the same command the step ran, not an approximation of it.',
      ],
    },
  ],
}

const authRefresh = {
  id: 'auth-refresh',
  label: 'Token Refresh Bug',
  lede: 'Why a page with several API calls logs the user out, and the single-flight fix.',
  blocks: [
    { type: 'h2', text: 'The symptom' },
    {
      type: 'p',
      text: 'A page fires several requests at once. The access token has expired, so each one comes back `401`. In the Network tab you then see one `200` on the refresh endpoint and a run of `401`s behind it — and the user is logged out.',
    },

    { type: 'h2', text: 'The cause' },
    {
      type: 'p',
      text: 'The interceptor refreshes on every `401`. Five simultaneous failures start five refreshes with the same refresh token. Under rotation, the first one wins and invalidates that token; the other four are now presenting something blacklisted.',
    },
    {
      type: 'code',
      lang: 'python',
      code: `SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}`,
    },
    {
      type: 'p',
      text: 'Those two settings are correct and worth keeping — they are what makes a stolen refresh token useless. The client is what needs fixing.',
    },

    { type: 'h2', text: 'The fix' },
    {
      type: 'p',
      text: 'Let only one refresh be in flight at a time. Everyone else awaits the same promise.',
    },
    {
      type: 'code',
      lang: 'javascript',
      code: `let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post("/api/v1/users/refresh/", {}, { withCredentials: true })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};`,
    },
    {
      type: 'ul',
      items: [
        '`refreshPromise` lives **outside** the function. Declared inside, every call gets its own and nothing is shared.',
        '`.finally`, not `.then` — a failed refresh must clear the slot too, or every later attempt awaits a permanently rejected promise.',
        'Plain `axios`, not your configured `api` instance. Calling the instance re-enters its own interceptor: a `401` on refresh triggers a refresh, forever.',
      ],
    },
    {
      type: 'code',
      lang: 'javascript',
      code: `api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isRefreshCall = original.url.includes("/users/refresh/");

    if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true;
      await refreshAccessToken();
      return api(original);
    }

    return Promise.reject(error);
  }
);`,
    },
    {
      type: 'warn',
      text: 'The `_retry` flag is what stops an endlessly retried request when the refresh succeeds but the original still fails. Removing it turns one bad request into an infinite loop.',
    },

    { type: 'h2', text: 'Reproducing it' },
    {
      type: 'p',
      text: 'Shorten the access token lifetime so you do not have to wait:',
    },
    {
      type: 'code',
      lang: 'python',
      code: `"ACCESS_TOKEN_LIFETIME": timedelta(seconds=30),`,
    },
    {
      type: 'p',
      text: 'Expose the client, wait for expiry, then fire several calls at once from the console:',
    },
    {
      type: 'code',
      lang: 'javascript',
      code: `window.api = api;

Promise.all([1, 2, 3, 4, 5].map(() => api.get("tasks/")));`,
    },
    {
      type: 'p',
      text: 'Before the fix: one refresh succeeds, the rest fail. After: one refresh, five successful retries.',
    },
  ],
}

export const guides = [docker, django, react, postgres, redis, actions, authRefresh]
