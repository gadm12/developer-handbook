// Heading ids are derived from block text so the guide view and the table of
// contents agree without either one reading the other's DOM. DOM-free on
// purpose, like tree-model.js — it can be exercised in plain Node.

function slug(text) {
  return text
    .replaceAll('`', '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Heading text repeats across the corpus ("The service", "Troubleshooting"), so
// ids carry a counter suffix once a slug has been claimed.
export function headingsFor(guide) {
  const seen = new Map()
  const headings = []

  for (const block of guide.blocks) {
    if (block.type !== 'h2' && block.type !== 'h3') continue

    const base = `s-${slug(block.text) || 'section'}`
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)

    headings.push({
      level: block.type === 'h2' ? 2 : 3,
      // Backticks are inline-code markup in prose; the TOC shows plain text.
      text: block.text.replaceAll('`', ''),
      id: n === 1 ? base : `${base}-${n}`,
    })
  }

  return headings
}
