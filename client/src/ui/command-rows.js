import { createCodeBlock } from './code-block.js'

// Shell steps as small, individually copyable boxes — the scaffold page's venv
// Quick Setup and the Starship guide both render through here.
//
// A step is a bare command, or `{ code, caption }` when the command needs a
// short "why" above it. Captions are plain text, never part of what Copy
// yields.
//
// `layout` is how a row's tracks are sized, not a grouping of meaning:
//   auto  — equal tracks that drop 3 -> 2 -> 1 as the column narrows
//   split — one narrow track beside a double-width one
//   full  — a single box across the row
export function createCommandRows(rows) {
  const wrap = document.createElement('div')
  wrap.className = 'cmd-rows'

  for (const row of rows) {
    const rowEl = document.createElement('div')
    rowEl.className = `cmd-row is-${row.layout}`

    for (const step of row.steps) {
      const { code, caption } = typeof step === 'string' ? { code: step } : step

      const box = document.createElement('div')
      box.className = 'cmd-box'

      if (caption) {
        const p = document.createElement('p')
        p.className = 'cmd-caption'
        p.textContent = caption
        box.append(p)
      }

      box.append(createCodeBlock(code, 'bash'))
      rowEl.append(box)
    }

    wrap.append(rowEl)
  }

  return wrap
}
