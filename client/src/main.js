import './style.css'

import { guides } from './data/guides.js'
import { createGuideView } from './features/guides/guide-view.js'
import { createToc } from './features/guides/toc-view.js'
import { createScaffoldView } from './features/scaffold/tree-view.js'
import { startRouter } from './router.js'
import { createSidebar } from './ui/sidebar.js'

const app = document.querySelector('#app')

function notFound(id) {
  const el = document.createElement('div')
  const title = document.createElement('h1')
  title.className = 'page-title'
  title.textContent = 'Not found'
  const body = document.createElement('p')
  body.textContent = `No guide with the id "${id}".`
  el.append(title, body)
  return el
}

function viewFor(route, guide) {
  if (route.name === 'guide') {
    return guide ? createGuideView(guide) : notFound(route.id)
  }
  return createScaffoldView()
}

// The table of contents listens on window scroll, which outlives the DOM that
// replaceChildren throws away, so each render tears down the one before it.
let disposeToc = null

function render(route) {
  disposeToc?.()
  disposeToc = null

  const guide =
    route.name === 'guide' ? guides.find((g) => g.id === route.id) : null

  const main = document.createElement('main')
  main.className = 'main'
  main.append(viewFor(route, guide))

  const layout = document.createElement('div')
  layout.className = 'layout'
  layout.append(createSidebar(route), main)

  const toc = guide ? createToc(guide) : null
  if (toc) {
    layout.classList.add('has-toc')
    layout.append(toc.element)
    disposeToc = toc.destroy
  }

  app.replaceChildren(layout)
  window.scrollTo(0, 0)
}

// Give a bare `/` a canonical hash so links and reloads agree.
if (!window.location.hash) {
  window.history.replaceState(null, '', `${window.location.pathname}#/scaffold`)
}

startRouter(render)
