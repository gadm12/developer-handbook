/**
 * Copy `text`, showing the result on `button` for a moment.
 * The caller passes the text explicitly — never read it back out of the DOM by
 * sibling position.
 */
export async function copyToClipboard(text, button) {
  const original = button.dataset.label ?? button.textContent
  button.dataset.label = original

  try {
    await navigator.clipboard.writeText(text)
    button.textContent = 'Copied'
    button.classList.add('is-copied')
  } catch {
    button.textContent = 'Failed'
  }

  clearTimeout(Number(button.dataset.timer))
  button.dataset.timer = String(
    setTimeout(() => {
      button.textContent = original
      button.classList.remove('is-copied')
    }, 1500),
  )
}
