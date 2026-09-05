import { createCodeBlock } from '../../ui/code-block.js'
import { createCommandRows } from '../../ui/command-rows.js'
import { headingsFor } from './headings.js'

// Inline `code` spans and [label](href) links are the only markup allowed in
// prose, so escape everything first and then re-open just those two.
//
// Hrefs are restricted to internal routes and https:, and anything else is
// left as literal text — this is authored content, but the whitelist keeps a
// stray `javascript:` from ever becoming a live anchor.
function href(url) {
  if (url.startsWith('#/')) return { url, external: false }
  if (url.startsWith('https://')) return { url, external: true }
  return null
}

function prose(text) {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

  // Links before code spans, so a label may itself contain backticks.
  const linked = escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label, url) => {
    const target = href(url)
    if (!target) return whole
    const attrs = target.external
      ? ` target="_blank" rel="noopener noreferrer"`
      : ''
    return `<a href="${target.url}"${attrs}>${label}</a>`
  })

  return linked.replace(/`([^`]+)`/g, '<code>$1</code>')
}

function element(tag, html) {
  const el = document.createElement(tag)
  el.innerHTML = prose(html)
  return el
}

function list(items) {
  const ul = document.createElement('ul')
  for (const item of items) ul.append(element('li', item))
  return ul
}

function callout(className, blocks) {
  const aside = document.createElement('aside')
  aside.className = className
  for (const text of blocks) aside.append(element('p', text))
  return aside
}

function figure(block) {
  const fig = document.createElement('figure')
  fig.className = 'guide-figure'

  const img = document.createElement('img')
  // An imported asset URL — Vite has already hashed it and prefixed the base.
  img.src = block.src
  img.alt = block.alt
  img.loading = 'lazy'
  fig.append(img)

  if (block.caption) fig.append(element('figcaption', block.caption))
  return fig
}

// The one block type that emits anchors. Hrefs must be absolute and external:
// the app routes on the hash, so an in-page `#…` anchor would parse as a route
// and dump the reader on the scaffold page — the same reason toc-view.js uses
// buttons.
function linkList(block) {
  const ul = document.createElement('ul')
  ul.className = 'link-list'

  for (const item of block.items) {
    const li = document.createElement('li')

    const a = document.createElement('a')
    a.href = item.href
    a.textContent = item.label
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    li.append(a)

    if (item.note) {
      const note = element('span', item.note)
      note.className = 'link-note'
      li.append(note)
    }

    ul.append(li)
  }

  return ul
}

const RENDERERS = {
  h2: (block) => element('h2', block.text),
  h3: (block) => element('h3', block.text),
  p: (block) => element('p', block.text),
  ul: (block) => list(block.items),
  code: (block) => createCodeBlock(block.code, block.lang, { collapse: block.collapse }),
  note: (block) => callout('note', block.items ?? [block.text]),
  warn: (block) => callout('warn', block.items ?? [block.text]),
  image: figure,
  commands: (block) => createCommandRows(block.rows),
  links: linkList,
}

export function createGuideView(guide) {
  const root = document.createElement('article')

  const title = document.createElement('h1')
  title.className = 'page-title'
  title.textContent = guide.label
  root.append(title)

  if (guide.lede) {
    const lede = document.createElement('p')
    lede.className = 'page-lede'
    lede.textContent = guide.lede
    root.append(lede)
  }

  // Ids come from the same pure derivation the TOC uses, zipped by document
  // order, so the two can never drift apart.
  const headings = headingsFor(guide)
  let heading = 0

  for (const block of guide.blocks) {
    const render = RENDERERS[block.type]
    if (!render) continue

    const el = render(block)
    if (block.type === 'h2' || block.type === 'h3') el.id = headings[heading++].id
    root.append(el)
  }

  return root
}
