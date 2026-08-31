import { headingsFor } from './headings.js'

// How far down the viewport a heading has to sit before it stops counting as
// the section you are reading. Must stay above the `scroll-margin-top` on
// .main h2/h3 in style.css — that is where a jumped-to heading parks, and the
// spy has to agree it is the current one once the jump settles.
const READING_LINE = 96

export function createToc(guide) {
  const headings = headingsFor(guide)
  if (headings.length < 2) return null

  const nav = document.createElement('nav')
  nav.className = 'toc'
  nav.setAttribute('aria-label', 'On this page')

  const label = document.createElement('p')
  label.className = 'toc-label'
  label.textContent = 'On this page'
  nav.append(label)

  const links = headings.map((heading) => {
    // A button, not an <a href="#...">. The app routes on the hash, so real
    // anchor navigation — including cmd-click into a new tab, which no click
    // handler can intercept — would parse as an unknown route and dump the
    // reader on the scaffold page.
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `toc-link level-${heading.level}`
    button.textContent = heading.text
    button.addEventListener('click', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(heading.id)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    })
    nav.append(button)
    return button
  })

  // Resolved on the first tick: the headings are not in the document yet.
  let targets = null
  let active = -1
  let frame = 0

  // The window is the scroller and the headings are flat siblings, not wrapped
  // sections, so an IntersectionObserver would fall silent exactly when a tall
  // section fills the viewport, and could not express the bottomed-out case at
  // all. Reading rects is a pure function of the current scroll offset, so it
  // is self-correcting after a resize or a dropped event.
  function activeIndex() {
    // The last section is often too short to ever reach the reading line, so
    // the bottom of the document always means the last entry.
    const page = document.documentElement
    if (window.innerHeight + window.scrollY >= page.scrollHeight - 2) {
      return targets.length - 1
    }

    // Headings are in document order, so the last one above the line wins.
    let index = 0
    for (let i = 0; i < targets.length; i += 1) {
      if (!targets[i] || targets[i].getBoundingClientRect().top > READING_LINE) break
      index = i
    }
    return index
  }

  function update() {
    frame = 0
    if (!nav.isConnected) return
    targets ??= headings.map((heading) => document.getElementById(heading.id))

    const index = activeIndex()
    if (index === active) return

    links[active]?.classList.remove('is-active')
    links[active]?.removeAttribute('aria-current')
    links[index].classList.add('is-active')
    links[index].setAttribute('aria-current', 'true')
    active = index
  }

  function schedule() {
    frame ||= requestAnimationFrame(update)
  }

  // main.js rebuilds the layout per route, but these listeners live on `window`
  // and are never torn down with it — without destroy(), every guide visited
  // leaves a live spy pinning its whole detached DOM.
  const controller = new AbortController()
  const { signal } = controller
  window.addEventListener('scroll', schedule, { passive: true, signal })
  window.addEventListener('resize', schedule, { signal })

  // Scheduled, not called: main.js has not appended this element yet, and it
  // calls scrollTo(0, 0) immediately after it does.
  schedule()

  return {
    element: nav,
    destroy() {
      controller.abort()
      cancelAnimationFrame(frame)
    },
  }
}
