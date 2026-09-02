const REMEMBER_EMAIL_KEY = 'lifedrop_remember_email'

export function loadRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) || ''
  } catch {
    return ''
  }
}

export function saveRememberedEmail(email: string) {
  try {
    localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim().toLowerCase())
  } catch {
    /* ignore */
  }
}

export function clearRememberedEmail() {
  try {
    localStorage.removeItem(REMEMBER_EMAIL_KEY)
  } catch {
    /* ignore */
  }
}
