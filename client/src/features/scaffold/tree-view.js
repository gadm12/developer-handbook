import { presets } from '../../data/presets.js'
import { createCodeBlock } from '../../ui/code-block.js'
import { clearTree, loadTree, saveTree } from './storage.js'
import { createVenvSetup } from './venv-setup.js'
import {
  addNode,
  cloneTree,
  deleteNode,
  generateScript,
  isDir,
  renameNode,
  splitExtension,
} from './tree-model.js'

const samePath = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])

export function createScaffoldView() {
  const root = document.createElement('div')

  let presetId = presets[0].id
  let tree = loadTree(presetId) ?? cloneTree(presets[0].tree)
  let includeRoot = false
  let showOutput = false
  // Set after adding a node so the new name is focused and selected on render.
  let focusPath = null

  // Static, and render() clears root on every edit — so build it once and let
  // each render move it back in. Its copy buttons survive the move.
  const venvSection = createVenvSetup()

  const preset = () => presets.find((p) => p.id === presetId)
  const persist = () => saveTree(presetId, tree)

  function usePreset(id) {
    presetId = id
    tree = loadTree(id) ?? cloneTree(preset().tree)
    render()
  }

  function reset() {
    clearTree(presetId)
    tree = cloneTree(preset().tree)
    render()
  }

  // --- tree rendering -------------------------------------------------------

  function renderRow(node, path, prefix, container) {
    const row = document.createElement('div')
    row.className = `tree-row ${isDir(node) ? 'is-dir' : 'is-file'}`

    if (prefix) {
      const span = document.createElement('span')
      span.className = 'tree-prefix'
      span.textContent = prefix
      row.append(span)
    }

    // Only the base name is editable — the extension is rendered beside it and
    // put back on commit, so a rename cannot turn Navbar.jsx into Navbar.jsz.
    // Directories and names with no recognised extension stay fully editable.
    const { base, ext } = isDir(node)
      ? { base: node.name, ext: '' }
      : splitExtension(node.name)

    const label = document.createElement('span')
    label.className = 'tree-label'

    const name = document.createElement('span')
    name.className = 'tree-name'
    name.contentEditable = 'plaintext-only'
    name.spellcheck = false
    name.textContent = isDir(node) ? `${base}/` : base
    label.append(name)

    if (ext) {
      const suffix = document.createElement('span')
      suffix.className = 'tree-ext'
      suffix.textContent = ext
      label.append(suffix)
    }

    const revert = () => {
      name.textContent = isDir(node) ? `${base}/` : base
    }

    const commit = () => {
      const typed = name.textContent.replace(/\/+$/, '').trim()
      // An empty or slash-bearing name would break the generated paths.
      if (!typed || typed.includes('/')) {
        revert()
        return
      }
      const next = typed + ext
      if (next === node.name) {
        revert()
        return
      }
      renameNode(tree, path, next)
      persist()
      render()
    }

    name.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        name.blur()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        revert()
        name.blur()
      }
    })
    name.addEventListener('blur', commit)
    row.append(label)

    const actions = document.createElement('div')
    actions.className = 'tree-actions'

    const button = (text, title, onClick, className = '') => {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = `tree-btn ${className}`.trim()
      el.textContent = text
      el.title = title
      el.addEventListener('click', onClick)
      actions.append(el)
      return el
    }

    button('+file', 'Add a file here', () => {
      focusPath = addNode(tree, path, 'file')
      persist()
      render()
    })
    button('+dir', 'Add a folder here', () => {
      focusPath = addNode(tree, path, 'dir')
      persist()
      render()
    })
    if (path.length) {
      button('×', 'Delete', () => {
        deleteNode(tree, path)
        persist()
        render()
      }, 'danger')
    }

    row.append(actions)
    container.append(row)

    if (focusPath && samePath(focusPath, path)) {
      focusPath = null
      queueMicrotask(() => {
        name.focus()
        const range = document.createRange()
        range.selectNodeContents(name)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      })
    }
  }

  function renderChildren(node, path, prefix, container) {
    const children = node.children ?? []
    children.forEach((child, index) => {
      const last = index === children.length - 1
      renderRow(child, [...path, index], prefix + (last ? '└── ' : '├── '), container)
      if (isDir(child)) {
        renderChildren(child, [...path, index], prefix + (last ? '    ' : '│   '), container)
      }
    })
  }

  // --- page -----------------------------------------------------------------

  function render() {
    root.replaceChildren()

    const title = document.createElement('h1')
    title.className = 'page-title'
    title.textContent = 'Scaffold Generator'
    root.append(title)

    const lede = document.createElement('p')
    lede.className = 'page-lede'
    lede.textContent =
      'Start a project in order: stand up the environment, then lay out the folder tree.'
    root.append(lede)

    root.append(venvSection)

    const treeHeading = document.createElement('h2')
    treeHeading.textContent = 'Folder Tree'
    root.append(treeHeading)

    const treeLede = document.createElement('p')
    treeLede.textContent =
      'Edit the tree, then generate the shell commands that build it. Click any name to rename it. Edits are saved per preset.'
    root.append(treeLede)

    const tabs = document.createElement('div')
    tabs.className = 'preset-tabs'
    for (const item of presets) {
      const tab = document.createElement('button')
      tab.type = 'button'
      tab.className = `preset-tab ${item.id === presetId ? 'is-active' : ''}`.trim()
      tab.textContent = item.label
      tab.addEventListener('click', () => usePreset(item.id))
      tabs.append(tab)
    }
    root.append(tabs)

    const description = document.createElement('p')
    description.textContent = preset().description
    root.append(description)

    const treeEl = document.createElement('div')
    treeEl.className = 'tree'
    renderRow(tree, [], '', treeEl)
    renderChildren(tree, [], '', treeEl)
    root.append(treeEl)

    const toolbar = document.createElement('div')
    toolbar.className = 'toolbar'

    const generate = document.createElement('button')
    generate.type = 'button'
    generate.className = 'btn btn-primary'
    generate.textContent = showOutput ? 'Regenerate Commands' : 'Generate Commands'
    generate.addEventListener('click', () => {
      showOutput = true
      render()
    })

    const resetBtn = document.createElement('button')
    resetBtn.type = 'button'
    resetBtn.className = 'btn'
    resetBtn.textContent = 'Reset to preset'
    resetBtn.addEventListener('click', reset)

    const toggle = document.createElement('label')
    toggle.className = 'toolbar-toggle'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = includeRoot
    checkbox.addEventListener('change', () => {
      includeRoot = checkbox.checked
      render()
    })
    toggle.append(checkbox, document.createTextNode(`create ${tree.name}/ itself`))

    toolbar.append(generate, resetBtn, toggle)
    root.append(toolbar)

    if (showOutput) {
      const script = generateScript(tree, { includeRoot })
      root.append(createCodeBlock(script, 'bash'))

      const hint = document.createElement('p')
      hint.className = 'note'
      hint.textContent = includeRoot
        ? `Run this from the directory that should contain ${tree.name}/.`
        : `Run this from inside ${tree.name}/ — tick the box above to create that folder too.`
      root.append(hint)
    }
  }

  render()
  return root
}
