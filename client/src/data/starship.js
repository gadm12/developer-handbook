// The Starship page — the first entry under the Environment section, and the
// first guide that needs module imports rather than plain literals: the
// screenshot and the config file are real files, not transcriptions.

import promptImg from '../assets/starship-prompt.png'
import vscodeSettingsImg from '../assets/starship-vscode-settings.png'
import terminalFontImg from '../assets/starship-terminal-font.png'
import explainImg from '../assets/starship-explain.png'
// Imported raw so it stays byte-exact — the config has 19 line-continuation
// backslashes and ten `${…}` module refs, all of which a JS template literal
// would need escaped.
import starshipToml from './starship.toml?raw'

// Commands are those in legacy-reference/notes/startship/star.md, in that
// order, with the font install added ahead of them. The note's two `#`
// comments become captions, not copyable text. Only `mkdir -p ~/.config` +
// `touch ~/.config/starship.toml` share a box — they are one step, the same
// way `mkdir .vscode` + its `touch` are in venv-setup.js. See
// ui/command-rows.js for what `layout` means.
const SETUP = [
  {
    layout: 'full',
    steps: [
      {
        code: 'brew install --cask font-fira-code-nerd-font',
        caption:
          'Install the font first, so the very first prompt you see is the real one.',
      },
    ],
  },
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

// A fragment, not a whole file — it is pasted into settings.json among
// whatever is already there, which is why both lines carry trailing commas.
const VSCODE_SETTINGS = `"editor.fontFamily": "'FiraCode Nerd Font', monospace",
"terminal.integrated.fontFamily": "'FiraCode Nerd Font'",`

const EXPLAIN = [{ layout: 'full', steps: ['starship explain'] }]

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
      text: 'Every badge in the screenshot above is an icon glyph — the branch symbol, the Python and Node logos, the Docker whale — and none of them exist in an ordinary monospace font. They come from what is called a Nerd Font: an ordinary font patched with an extra range of developer icons. Without one you get tofu boxes and question marks where the icons should be, which looks exactly like a broken config and is not one. Fira Code is the font this page assumes.',
    },
    {
      type: 'p',
      text: 'Copy the boxes one at a time — the two in the middle are a check and its follow-up, not a sequence to paste in one go.',
    },
    { type: 'commands', rows: SETUP },
    {
      type: 'note',
      text: 'Installing the font is not the same as using it. Each terminal keeps its own font setting, and every one of them has to be pointed at the Nerd Font separately — the two sections after the config cover VS Code and macOS Terminal.',
    },

    { type: 'h2', text: 'Configuration' },
    {
      type: 'p',
      text: 'The file starts empty, and Starship falls back to its defaults until you fill it. This is the config behind the screenshot above — the custom venv and branch badges, the Docker segment, and the segment order — so paste it into the file you just opened.',
    },
    // 197 lines, and everything below it is more useful to a first-time
    // reader than the config is — so it opens clipped.
    { type: 'code', lang: 'toml', code: starshipToml, collapse: 5 },

    { type: 'h2', text: 'Fonts in VS Code' },
    {
      type: 'p',
      text: 'Open the settings file with `Cmd+Shift+P`, then search for "Preferences: Open User Settings (JSON)". That opens `settings.json` — the same settings you would otherwise click through, as text.',
    },
    { type: 'code', lang: 'json', code: VSCODE_SETTINGS },
    {
      type: 'note',
      text: 'These two lines go anywhere inside the outermost `{ }` that is already in the file — order does not matter. Just make sure every line inside the braces ends with a comma, or VS Code will flag the file and quietly keep your old fonts.',
    },
    {
      type: 'image',
      src: vscodeSettingsImg,
      alt: 'A fragment of VS Code settings.json with terminal.integrated.fontFamily set to FiraCode Nerd Font, highlighted, and editor.fontFamily set on the line below it.',
      caption:
        'The highlighted line is the one that matters here — `terminal.integrated.fontFamily` is what the prompt reads. `editor.fontFamily` sets the font of the code you are editing and is an independent choice, which is why the value on it in this file is a different one.',
    },
    {
      type: 'p',
      text: 'Reopen the integrated terminal and the badges appear. The screenshot at the top of this page is exactly this — Starship in VS Code, with the font set.',
    },

    { type: 'h2', text: 'Fonts in macOS Terminal' },
    {
      type: 'p',
      text: 'Terminal.app is a different application from the terminal inside VS Code, and it keeps its own font setting. Nothing in the previous section reaches it — if you use both, you have to do both.',
    },
    {
      type: 'p',
      text: 'Terminal → Settings → Profiles → Text → Font → Change, and pick `FiraCode NerdFont SemBd`.',
    },
    {
      type: 'image',
      src: terminalFontImg,
      alt: "The macOS Terminal Profiles settings pane, Text tab, with the Font reading FiraCode Nerd Font SemBd 18 and a Change button beside it. A terminal window behind it shows a Starship prompt with its icons rendering.",
      caption:
        'The font is set per profile, not per app — the pane changes whichever profile is selected on the left (here "Clear Dark"). Change the profile you actually use, or set it on all of them.',
    },

    { type: 'h2', text: '`starship explain`' },
    { type: 'commands', rows: EXPLAIN },
    {
      type: 'p',
      text: 'Run it inside any project directory and Starship annotates the prompt it just drew: one line per segment, saying what that segment is reporting and how long it took to work it out. It is the quickest way to find which module owns a badge you want to change — and the timings tell you which module to drop if the prompt ever feels slow.',
    },
    {
      type: 'image',
      src: explainImg,
      alt: 'Terminal output from starship explain, listing each prompt segment beside a plain-English description and a millisecond timing — the venv badge, the working directory, the git branch, the added and deleted line counts, the repo state symbol, and the Python version.',
      caption:
        'Each segment, what it means, and what it cost. Everything here is sub-50ms, which is why the prompt still feels instant.',
    },

    { type: 'h2', text: 'Further reading' },
    {
      type: 'links',
      items: [
        {
          href: 'https://starship.rs/',
          label: 'starship.rs',
          note: 'The config reference — every module, every option it takes, and a gallery of presets to start from.',
        },
        {
          href: 'https://github.com/starship/starship',
          label: 'github.com/starship/starship',
          note: 'The repo. Worth reading the module source when the docs leave a variable ambiguous, and where to check whether a bug is already known.',
        },
      ],
    },
  ],
}
