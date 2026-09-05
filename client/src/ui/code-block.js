import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import ini from 'highlight.js/lib/languages/ini'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import makefile from 'highlight.js/lib/languages/makefile'
import nginx from 'highlight.js/lib/languages/nginx'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import 'highlight.js/styles/atom-one-dark.css'

import { copyToClipboard } from './copy.js'

// Only the languages the guides actually use — the full hljs bundle is ~1MB.
for (const [name, lang] of Object.entries({
  bash,
  css,
  dockerfile,
  ini,
  javascript,
  json,
  makefile,
  nginx,
  python,
  sql,
  xml,
  yaml,
})) {
  hljs.registerLanguage(name, lang)
}

// hljs ships no TOML grammar; ini highlights it correctly, and routing through
// an alias keeps the block's visible label reading `toml`.
const ALIASES = {
  sh: 'bash',
  shell: 'bash',
  jsx: 'javascript',
  js: 'javascript',
  yml: 'yaml',
  toml: 'ini',
}

/**
 * Build a code block with its own copy button.
 *
 * The button closes over `code` directly, so a block's Copy always yields that
 * block's text regardless of where it sits in the DOM.
 */
export function createCodeBlock(code, lang = 'bash') {
  const resolved = ALIASES[lang] ?? lang

  const wrap = document.createElement('div')
  wrap.className = 'code-block'

  const label = document.createElement('span')
  label.className = 'code-lang'
  label.textContent = lang

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'copy-btn'
  button.textContent = 'Copy'
  button.addEventListener('click', () => copyToClipboard(code, button))

  const pre = document.createElement('pre')
  const el = document.createElement('code')
  el.textContent = code

  if (hljs.getLanguage(resolved)) {
    el.innerHTML = hljs.highlight(code, { language: resolved }).value
  }

  pre.append(el)
  wrap.append(label, button, pre)
  return wrap
}
