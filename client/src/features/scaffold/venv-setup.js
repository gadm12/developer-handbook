import { createCommandRows } from '../../ui/command-rows.js'

// Straight from legacy-reference/notes/setup_proj_folder/setup.md, in that
// order. One correction to the note: its last line redirects into
// `.vscode/settings`, which is not the file the `touch` above it creates.
//
// Rows are a layout choice only — nothing here is merged except `mkdir
// .vscode` + `touch .vscode/settings.json`, which are always run together.
// Every box copies on its own. See ui/command-rows.js for what `layout` means.
const ROWS = [
  {
    layout: 'auto',
    steps: ['deactivate', 'python3 -m venv .venv', 'source .venv/bin/activate'],
  },
  {
    layout: 'split',
    steps: [
      'touch .envrc',
      `echo 'export VIRTUAL_ENV="$PWD/.venv"
PATH_add "$VIRTUAL_ENV/bin"' > .envrc`,
    ],
  },
  {
    layout: 'split',
    steps: ['direnv allow', 'mkdir .vscode\ntouch .vscode/settings.json'],
  },
  {
    layout: 'full',
    steps: [
      `echo '{
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": false
}' > .vscode/settings.json`,
    ],
  },
]

/**
 * The venv setup sequence as small, individually copyable boxes.
 *
 * Stateless — build it once and re-append it; there is nothing to re-render.
 */
export function createVenvSetup() {
  const section = document.createElement('section')
  section.className = 'venv-setup'

  const heading = document.createElement('h2')
  heading.textContent = 'venv Quick Setup'
  section.append(heading)

  const intro = document.createElement('p')
  intro.textContent =
    'An isolated Python environment, switched on by direnv the moment you cd in and off when you leave, with VS Code pointed at the same interpreter your shell uses. Copy the boxes one at a time — these are rarely all run in one go.'
  section.append(intro)

  section.append(createCommandRows(ROWS))

  return section
}
