// The Starship page — the first entry under the Environment section, and the
// first guide that needs module imports rather than plain literals: the
// screenshot and the config file are real files, not transcriptions.

import promptImg from '../assets/starship-prompt.png'
// Imported raw so it stays byte-exact — the config has 19 line-continuation
// backslashes and ten `${…}` module refs, all of which a JS template literal
// would need escaped.
import starshipToml from './starship.toml?raw'

// Commands are exactly those in legacy-reference/notes/startship/star.md, in
// that order. The note's two `#` comments become captions, not copyable text.
// Only `mkdir -p ~/.config` + `touch ~/.config/starship.toml` share a box —
// they are one step, the same way `mkdir .vscode` + its `touch` are in
// venv-setup.js. See ui/command-rows.js for what `layout` means.
const SETUP = [
  {
    layout: 'split',
    steps: [
      'brew install starship',
      `printf '\\neval "$(starship init zsh)"\\n' >> ~/.zshrc`,
    ],
  },
  {
    layout: 'auto',
    steps: [
      {
        code: 'tail -n 5 ~/.zshrc',
        caption: 'Check the eval line was really added to ~/.zshrc.',
      },
      {
        code: 'source ~/.zshrc',
        caption: 'If it was, load it into the current shell.',
      },
    ],
  },
  {
    layout: 'auto',
    steps: [
      'mkdir -p ~/.config\ntouch ~/.config/starship.toml',
      'code ~/.config/starship.toml',
    ],
  },
]

export const starship = {
  id: 'starship',
  label: 'Starship',
  section: 'Environment',
  lede: 'A prompt that answers "which branch, which venv, which Python" before you think to ask.',
  blocks: [
    {
      type: 'image',
      src: promptImg,
      alt: 'A terminal showing four Starship prompts across two git switches and a cd. Each prompt line carries, left to right: a .venv badge, the folder name, a one-letter branch badge, the git branch, the Python version, and a Docker badge — with a Node version appearing once the shell moves into the client folder.',
      caption:
        'One prompt line, six answers: active venv, folder, branch badge, branch, language versions, Docker. The Node segment appears only after `cd client` — segments show up when the directory calls for them and stay out of the way when it does not.',
    },

    { type: 'h2', text: 'Why bother' },
    {
      type: 'p',
      text: 'Starship reads the directory you are standing in and prints what it finds on the prompt line: the virtualenv that is actually active, the git branch and whether the tree is dirty, the versions of the languages the project uses, whether Docker is in play. It is the output of `git branch`, `git status`, `python --version` and `echo $VIRTUAL_ENV` — reported on every line, without being asked.',
    },
    {
      type: 'p',
      text: 'The value shows up when you are switching between projects and branches all day. Committing to the wrong branch, installing into the system Python because the venv silently failed to activate, running `manage.py` against a project you thought you had left — those mistakes are all a form of stale context, and they stop being possible once the answer is already on screen.',
    },

    { type: 'h2', text: 'Setup (macOS)' },
    {
      type: 'p',
      text: 'Copy the boxes one at a time — the two in the middle are a check and its follow-up, not a sequence to paste in one go.',
    },
    { type: 'commands', rows: SETUP },

    { type: 'h2', text: 'Configuration' },
    {
      type: 'p',
      text: 'The file starts empty, and Starship falls back to its defaults until you fill it. This is the config behind the screenshot above — the custom venv and branch badges, the Docker segment, and the segment order — so paste it into the file you just opened.',
    },
    { type: 'code', lang: 'toml', code: starshipToml },
  ],
}
