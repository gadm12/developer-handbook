import { createCodeBlock } from '../../ui/code-block.js'

// The `solutions` block: a category filter over a list of collapsed solutions.
//
// This is the one stateful renderer in the guide view. Everything else in
// guide-view.js maps data to DOM once and forgets it; a filter has to remember
// which category is selected, so the state lives here in a closure rather than
// leaking into the block data.

const ALL = 'all'

function countByCategory(items) {
  const counts = new Map()
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
  }
  // Biggest first, then alphabetical, so the pill row is stable across runs
  // and does not reorder itself when a category gains a solution.
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

// One row: a toggle carrying the metadata, plus the code block it reveals.
//
// The code block is built on first expand, not up front. Highlighting ~190
// blocks synchronously on render is a visible hitch on this page, and most of
// them are never opened.
function createRow(item) {
  const row = document.createElement('div')
  row.className = 'sol-row'
  row.dataset.category = item.category

  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'sol-toggle'
  toggle.setAttribute('aria-expanded', 'false')

  const name = document.createElement('span')
  name.className = 'sol-name'
  name.textContent = item.title

  const file = document.createElement('span')
  file.className = 'sol-file'
  file.textContent = `${item.name}.py`

  const tag = document.createElement('span')
  tag.className = 'sol-tag'
  tag.textContent = item.category

  const lines = document.createElement('span')
  lines.className = 'sol-lines'
  lines.textContent = `${item.lines} ${item.lines === 1 ? 'line' : 'lines'}`

  toggle.append(name, file, tag, lines)

  const body = document.createElement('div')
  body.className = 'sol-body'
  body.hidden = true

  let built = false
  toggle.addEventListener('click', () => {
    const open = body.hidden
    if (open && !built) {
      body.append(createCodeBlock(item.code, 'python'))
      built = true
    }
    body.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    row.classList.toggle('is-open', open)
  })

  row.append(toggle, body)
  return row
}

export function createSolutionList(block) {
  const items = block.items ?? []

  const wrap = document.createElement('div')
  wrap.className = 'sol-list'

  // Reuses the scaffold page's preset pills rather than restyling them — same
  // shape, same active treatment, no second definition to keep in sync.
  const tabs = document.createElement('div')
  tabs.className = 'preset-tabs'

  const status = document.createElement('p')
  status.className = 'sol-status'
  // A filter that only hides rows is silent to a screen reader, so the count
  // is a live region rather than decoration.
  status.setAttribute('role', 'status')
  status.setAttribute('aria-live', 'polite')

  const rows = items.map(createRow)

  let selected = ALL
  const buttons = new Map()

  function apply() {
    let shown = 0
    for (const row of rows) {
      const match = selected === ALL || row.dataset.category === selected
      row.hidden = !match
      if (match) shown += 1
    }

    for (const [category, button] of buttons) {
      const active = category === selected
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-pressed', String(active))
    }

    status.textContent =
      selected === ALL
        ? `Showing all ${shown} solutions`
        : `Showing ${shown} of ${items.length} solutions in ${selected}`
  }

  function pill(category, label, count) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'preset-tab'
    button.textContent = `${label} ${count}`
    button.addEventListener('click', () => {
      selected = category
      apply()
    })
    buttons.set(category, button)
    tabs.append(button)
  }

  pill(ALL, 'All', items.length)
  for (const [category, count] of countByCategory(items)) {
    pill(category, category, count)
  }

  const list = document.createElement('div')
  list.className = 'sol-rows'
  list.append(...rows)

  wrap.append(tabs, status, list)
  apply()

  return wrap
}
