// Hash routing, deliberately: GitHub Pages serves no rewrite rules, so a
// History-API route would 404 on reload.

export function parseRoute(hash = window.location.hash) {
  const [, section, id] = hash.replace(/^#\/?/, '/').split('/')
  if (section === 'guide' && id) return { name: 'guide', id }
  return { name: 'scaffold' }
}

export function startRouter(onRoute) {
  const handle = () => onRoute(parseRoute())
  window.addEventListener('hashchange', handle)
  handle()
}
