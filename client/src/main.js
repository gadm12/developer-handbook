import './style.css'

import { guides } from './data/guides.js'
import { createGuideView } from './features/guides/guide-view.js'
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

function viewFor(route) {
  if (route.name === 'guide') {
    const guide = guides.find((g) => g.id === route.id)
    return guide ? createGuideView(guide) : notFound(route.id)
  }
  return createScaffoldView()
}

function render(route) {
  const main = document.createElement('main')
  main.className = 'main'
  main.append(viewFor(route))

  const layout = document.createElement('div')
  layout.className = 'layout'
  layout.append(createSidebar(route), main)

  app.replaceChildren(layout)
  window.scrollTo(0, 0)
}

// Give a bare `/` a canonical hash so links and reloads agree.
if (!window.location.hash) {
  window.history.replaceState(null, '', `${window.location.pathname}#/scaffold`)
}

startRouter(render)
