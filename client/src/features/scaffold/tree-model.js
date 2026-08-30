// Pure operations over a scaffold tree. No DOM in here.
//
// A node is { name, type: 'dir' | 'file', children?: Node[] }.
// Nodes are addressed by a path of child indices (e.g. [0, 2]) because names
// are not unique — two sibling folders can both hold a `Dockerfile`.

export function cloneTree(tree) {
  return structuredClone(tree)
}

export function findNode(tree, path) {
  return path.reduce((node, index) => node?.children?.[index], tree)
}

function findParent(tree, path) {
  return path.length ? findNode(tree, path.slice(0, -1)) : null
}

export function isDir(node) {
  return node.type === 'dir'
}

/**
 * Insert a new child. If `path` addresses a file, the node is inserted as a
 * sibling of that file instead — clicking "+" on a file should not nest inside
 * something that cannot have children.
 * Returns the path of the newly created node.
 */
export function addNode(tree, path, type) {
  const target = findNode(tree, path)
  const node = { name: type === 'dir' ? 'new-folder' : 'new-file', type }
  if (type === 'dir') node.children = []

  if (isDir(target)) {
    target.children ??= []
    target.children.push(node)
    return [...path, target.children.length - 1]
  }

  const parent = findParent(tree, path)
  if (!parent) return path
  const index = path.at(-1) + 1
  parent.children.splice(index, 0, node)
  return [...path.slice(0, -1), index]
}

export function renameNode(tree, path, name) {
  const node = findNode(tree, path)
  const trimmed = name.trim()
  // Reject empty names rather than producing an unusable path segment.
  if (node && trimmed) node.name = trimmed
  return node?.name ?? ''
}

/** The root itself cannot be deleted. */
export function deleteNode(tree, path) {
  if (!path.length) return
  const parent = findParent(tree, path)
  parent?.children?.splice(path.at(-1), 1)
}

// ---------------------------------------------------------------------------
// Shell script generation
// ---------------------------------------------------------------------------

const SAFE = /^[A-Za-z0-9._\-/]+$/

/** Single-quote anything a shell might reinterpret. */
export function quote(path) {
  if (SAFE.test(path)) return path
  return `'${path.replaceAll("'", `'\\''`)}'`
}

function walk(node, prefix, dirs, files) {
  for (const child of node.children ?? []) {
    const path = prefix ? `${prefix}/${child.name}` : child.name
    if (isDir(child)) {
      dirs.push(path)
      walk(child, path, dirs, files)
    } else {
      files.push(path)
    }
  }
}

/**
 * Turn the tree into `mkdir -p` / `touch` lines.
 *
 * `includeRoot` off (the default) means the script is meant to be run from
 * inside an already-created project directory, so the root node's own name is
 * not emitted as a path prefix.
 */
export function generateScript(tree, { includeRoot = false } = {}) {
  const dirs = []
  const files = []
  const root = includeRoot ? tree.name : ''

  if (includeRoot) dirs.push(root)
  walk(tree, root, dirs, files)

  // `mkdir -p a/b` already creates `a`, so drop any directory that is a strict
  // ancestor of another. Keeps the output short without losing empty dirs.
  const needed = dirs.filter(
    (dir) => !dirs.some((other) => other !== dir && other.startsWith(`${dir}/`)),
  )

  const lines = []
  if (needed.length) {
    lines.push(`mkdir -p ${needed.map(quote).join(' ')}`)
  }

  // Group `touch` by parent directory so the script reads like the tree.
  const byParent = new Map()
  for (const file of files) {
    const slash = file.lastIndexOf('/')
    const parent = slash === -1 ? '' : file.slice(0, slash)
    if (!byParent.has(parent)) byParent.set(parent, [])
    byParent.get(parent).push(file)
  }
  for (const group of byParent.values()) {
    lines.push(`touch ${group.map(quote).join(' ')}`)
  }

  return lines.join('\n')
}
