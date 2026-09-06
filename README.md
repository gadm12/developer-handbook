# Developer Handbook

[gadm12.github.io/developer-handbook](https://gadm12.github.io/developer-handbook/)

A personal reference site for a Django + React + Postgres + Redis + Docker
workflow. Two things live here:

- **Scaffold Generator** — an editable project tree that compiles to a
  copy-pasteable `mkdir -p` / `touch` script. Rename, add and delete nodes
  inline; edits are saved per preset in `localStorage`.
- **Guides** — Docker & Compose, venv + Django init, React/Vite init,
  PostgreSQL, Redis, GitHub Actions, a writeup of the JWT refresh race, and a
  filterable index of the Codewars solutions. Every code block has its own copy
  button.

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
  `warn`, `image`, `commands`, `links` and `solutions`; backticks in prose render
  as inline code. The sidebar and router pick it up automatically.
- **A scaffold preset**: append to the `presets` array in
  `client/src/data/presets.js` using the `dir()` / `file()` helpers. It becomes a
  new tab.

## Codewars solutions

The **Codewars Solutions** page lists all 191 Python solutions from
[data-structures-practice](https://github.com/gadm12/data-structures-practice),
filterable by category, so they are readable and copyable from the handbook
instead of only by browsing files on GitHub.

**It is not a symlink and not a submodule — there is no link between the two
repos.** `client/src/data/codewars.js` is a generated file holding a *copy* of
each solution's source, and it is committed. That is deliberate, and it is the
answer to the "does this survive a fresh clone?" question: a symlink would break
on clone, and a submodule would make every CI build clone a second repo. A
committed copy does neither.

**Fresh clone, new machine: no setup at all.** `npm install && npm run build`
works with the other repo absent. Nothing outside this repo is read at build
time, and the deploy workflow needs no extra step.

Setup is only needed to **regenerate** the page after adding or editing katas:

```bash
cd client
npm run gen:codewars
```

That reads the sibling checkout, expected at `../../data-structures-practice`
relative to this repo. If it lives elsewhere, point at it:

```bash
CODEWARS_DIR=/path/to/data-structures-practice/codewars npm run gen:codewars
```

Then commit the regenerated `client/src/data/codewars.js` — **the site does not
change until you do.** Nothing propagates automatically; that is the tradeoff
for a build that never reaches outside this repo.

Categories are hand-maintained in `client/scripts/categories.json`, keyed by
filename without `.py`. The generator refuses to run if the two sides drift —
a solution with no category, or a category with no matching file — rather than
quietly emitting a partial page.

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
