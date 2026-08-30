const key = (presetId) => `developer-handbook:scaffold:${presetId}`

// localStorage throws in private-mode Safari and when site data is blocked, so
// every access is guarded — a failure just means edits don't persist.

export function loadTree(presetId) {
  try {
    const raw = localStorage.getItem(key(presetId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveTree(presetId, tree) {
  try {
    localStorage.setItem(key(presetId), JSON.stringify(tree))
  } catch {
    /* not persisted — the in-memory tree still works */
  }
}

export function clearTree(presetId) {
  try {
    localStorage.removeItem(key(presetId))
  } catch {
    /* nothing to do */
  }
}
