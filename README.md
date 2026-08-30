# Developer Handbook

[gadm12.github.io/developer-handbook](https://gadm12.github.io/developer-handbook/)

A personal reference site for a Django + React + Postgres + Redis + Docker
workflow. Two things live here:

- **Scaffold Generator** — an editable project tree that compiles to a
  copy-pasteable `mkdir -p` / `touch` script. Rename, add and delete nodes
  inline; edits are saved per preset in `localStorage`.
- **Guides** — Docker & Compose, venv + Django init, React/Vite init,
  PostgreSQL, Redis, GitHub Actions, and a writeup of the JWT refresh race.
  Every code block has its own copy button.

## Run it locally

```bash
cd client
npm install
npm run dev
```

`npm run build` writes to `client/dist`; `npm run preview` serves that build.

## Adding content

Content is data, not markup — you should not need to touch layout or logic code.

- **A guide**: append an object to the `guides` array in
  `client/src/data/guides.js`. Blocks are `h2`, `h3`, `p`, `ul`, `code`, `note`,
  and `warn`; backticks in prose render as inline code. The sidebar and router
  pick it up automatically.
- **A scaffold preset**: append to the `presets` array in
  `client/src/data/presets.js` using the `dir()` / `file()` helpers. It becomes a
  new tab.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds `client/`
and publishes `client/dist` to GitHub Pages. You can also run it by hand from the
Actions tab (`workflow_dispatch`).

Two things that must stay in sync for a project site:

- `base` in `client/vite.config.js` must match the repository name.
- Settings → Pages → Source must be **GitHub Actions**, not "Deploy from a
  branch". A workflow cannot change this itself.

## Layout

```
client/src/
├── data/                 guides.js, presets.js — all content lives here
├── features/scaffold/    tree-model.js (pure logic), tree-view.js, storage.js
├── features/guides/      guide-view.js
├── ui/                   sidebar.js, code-block.js, copy.js
├── router.js             hash routing
└── main.js
```

`legacy-reference/` holds the previous version of this site — the static
per-topic HTML pages and the raw notes they were written from. It is git-ignored
and is kept only as source material; nothing in it is built or served.
