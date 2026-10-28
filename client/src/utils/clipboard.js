// Clipboard helper with fallback support
export async function copyToClipboard(text, onSuccess, onError) {
  if (!text) return false

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      if (onSuccess) onSuccess(text)
      return true
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      textArea.remove()
      if (successful) {
        if (onSuccess) onSuccess(text)
        return true
      }
    }
  } catch (err) {
    console.error('Clipboard copy error:', err)
    if (onError) onError(err)
    return false
  }
}
