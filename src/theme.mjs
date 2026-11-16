export const THEME_STORAGE_KEY = 'borderline-theme'
export const THEME_COLORS = { light: '#f6f5f1', dark: '#171d1b' }
export const MEDIAKIT_THEME_COLORS = { light: '#ffffff', dark: '#111111' }
export const normalizeTheme = (value) => value === 'dark' ? 'dark' : 'light'

export const applyTheme = (value, { persist = false } = {}) => {
  const theme = normalizeTheme(value)
  if (typeof document === 'undefined') return theme
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme)
  const colors = document.documentElement.dataset.view === 'mediakit' ? MEDIAKIT_THEME_COLORS : THEME_COLORS
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[theme])
  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // A escolha continua válida nesta visita se o armazenamento for bloqueado.
    }
  }
  return theme
}
