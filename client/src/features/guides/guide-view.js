import { createCodeBlock } from '../../ui/code-block.js'
import { headingsFor } from './headings.js'

// Inline `code` spans are the only markup allowed in prose, so escape
// everything first and then re-open just those.
function prose(text) {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>')
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

const RENDERERS = {
  h2: (block) => element('h2', block.text),
  h3: (block) => element('h3', block.text),
  p: (block) => element('p', block.text),
  ul: (block) => list(block.items),
  code: (block) => createCodeBlock(block.code, block.lang),
  note: (block) => callout('note', block.items ?? [block.text]),
  warn: (block) => callout('warn', block.items ?? [block.text]),
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
