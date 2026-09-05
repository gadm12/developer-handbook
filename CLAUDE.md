# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal static reference site (Vite, vanilla JS, no framework) deployed to
GitHub Pages at https://gadm12.github.io/developer-handbook/. Two features:

- **Scaffold Generator** — an editable project tree that compiles to a
  `mkdir -p` / `touch` shell script.
- **Guides** — Docker/Compose, venv + Django, React/Vite, PostgreSQL, Redis,
  GitHub Actions, and a JWT refresh-race writeup.

## Commands

All from `client/`:

```
npm install
npm run dev       # dev server at /developer-handbook/
npm run build     # -> client/dist
npm run preview   # serve the built output
```

No test runner or linter is configured. `highlight.js` is the only runtime
dependency.

## Architecture

The rule that shapes everything: **content is data, layout is code.** Adding a
guide or a scaffold preset means appending to an array in `client/src/data/`,
never touching a view.

```
client/src/
├── data/guides.js         all guide content (~1500 lines) — the bulk of the repo
├── data/starship.js       the one guide needing imports (png + starship.toml?raw)
├── data/presets.js        scaffold starter trees, built with dir()/file() helpers
├── features/scaffold/
│   ├── tree-model.js      pure tree CRUD + generateScript(); no DOM
│   ├── tree-view.js       renders the tree, inline rename, add/delete
│   ├── venv-setup.js      the venv Quick Setup rows
│   └── storage.js         localStorage, per preset id
├── features/guides/guide-view.js   maps a guide's blocks[] to DOM
├── ui/code-block.js       <pre> + per-block copy button + hljs
├── ui/command-rows.js     grid of individually copyable command boxes
├── ui/sidebar.js, ui/copy.js
├── router.js              hash routing (#/scaffold, #/guide/:id)
└── main.js                re-renders the whole layout per route
```

Guide blocks are
`h2 | h3 | p | ul | code | note | warn | image | commands | links`.
Prose is HTML-escaped first, then exactly two things are re-opened: backticks
become inline `<code>`, and `[label](href)` becomes a link. `code` blocks
take a `lang` that must be registered in `ui/code-block.js` — only the languages actually used are imported, since the
full hljs bundle is ~1MB. A `code` block may also carry `collapse: N`, which
clips it to its first N lines behind a toggle; the whole block stays in the DOM,
so Copy still yields all of it.

A `commands` block renders through `ui/command-rows.js`, shared with the
scaffold page's venv Quick Setup: rows of small boxes that each copy on their
own, with an optional plain-text `caption` above a box that Copy never yields.

Anchors come from two places: the `links` block, and `[label](href)` in prose.
Both accept only an internal route (`#/scaffold`, `#/guide/:id`) or an
`https://` URL — anything else is left as literal text, and external links get
`target="_blank"`. A bare in-page `#…` fragment is deliberately not supported:
it would be read as a route and land the reader on the scaffold page, which is
the same reason `toc-view.js` uses buttons rather than anchors.

The sidebar's groups come from the data — a guide with a `section` starts a new
group at that point in the `guides` array, and one without falls under
"Guides" — so group order is array order.

Two things worth preserving:

- `tree-model.js` is deliberately DOM-free so the script generator can be tested
  in plain Node. Nodes are addressed by **index path** (`[0, 2]`), not name,
  because names are not unique.
- Copy buttons close over their own text (`createCodeBlock(code)`). The previous
  version of this site read `button.nextElementSibling.innerText`, which broke
  whenever markup shifted. Don't reintroduce sibling coupling.

## Deployment

`.github/workflows/deploy.yml` builds `client/` on push to `main` and publishes
`client/dist` via the official Pages actions. Two invariants:

- `base` in `client/vite.config.js` must equal `/<repo-name>/` or every asset
  404s on the project site.
- Repo Settings → Pages → Source must be **GitHub Actions**. A workflow cannot
  set this itself; if it is on "Deploy from a branch" the run goes green and the
  site never updates.

Hash routing is intentional — GitHub Pages serves no rewrite rules, so a
History-API route would 404 on reload.

## legacy-reference/

The previous version of the site: per-topic static HTML pages plus the raw
`notes/` they were written from. **Git-ignored, kept only as source material** —
nothing in it is built or served, and it is not a place to add code.

It is still the best source when extending a guide, but note: the `index.html`
pages are newer and richer than the sibling `.md` cheatsheets, and several notes
contain errors that were corrected during extraction (e.g. `CASHES` typo, wrong
`redis_cache.cache.RedisCache` backend path). `notes/` was never git-tracked, so
do not delete it.
