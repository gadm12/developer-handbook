import { guides } from '../data/guides.js'

function link(href, label, active) {
  const a = document.createElement('a')
  a.className = `nav-link ${active ? 'is-active' : ''}`.trim()
  a.href = href
  a.textContent = label
  return a
}

function group(label) {
  const p = document.createElement('p')
  p.className = 'nav-group-label'
  p.textContent = label
  return p
}

export function createSidebar(route) {
  const nav = document.createElement('nav')
  nav.className = 'sidebar'

  const brand = document.createElement('a')
  brand.className = 'sidebar-brand'
  brand.href = '#/scaffold'
  brand.innerHTML = 'Developer <span>Handbook</span>'
  nav.append(brand)

  nav.append(group('Tools'))
  nav.append(link('#/scaffold', 'Scaffold Generator', route.name === 'scaffold'))

  // Group labels come from the data: a new one is emitted whenever `section`
  // changes, so group order is array order — no sort, no separate config.
  let section = null
  for (const guide of guides) {
    const label = guide.section ?? 'Guides'
    if (label !== section) {
      nav.append(group(label))
      section = label
    }

    nav.append(
      link(
        `#/guide/${guide.id}`,
        guide.label,
        route.name === 'guide' && route.id === guide.id,
      ),
    )
  }

  return nav
}
