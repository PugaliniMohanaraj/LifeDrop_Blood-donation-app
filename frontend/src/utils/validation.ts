export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Sign-up requires a Gmail address (@gmail.com). */
export function isGmailEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-()]/g, '')
  return /^\+?\d{9,15}$/.test(digits)
}

export const PASSWORD_HINT =
  'At least 8 characters with uppercase, lowercase, number, and special character (!@#$%^&* etc.)'

export function getPasswordValidationError(password: string): string | null {
  if (!password) return 'Please create a password.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include at least one number.'
  if (!/[^A-Za-z0-9]/.test(password))
    return 'Password must include at least one special character.'
  return null
}

export function isStrongPassword(password: string): boolean {
  return getPasswordValidationError(password) === null
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

export function isFutureDate(dateStr: string): boolean {
  if (!dateStr) return false
  const selected = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected >= today
}

export type FieldErrors = Record<string, string>

function validateSignupEmail(email: string, errors: FieldErrors) {
  if (!required(email)) errors.email = 'Please enter your email address.'
  else if (!isGmailEmail(email))
    errors.email = 'Please use a Gmail address ending with @gmail.com.'
}

function validateSignupPassword(password: string, confirmPassword: string, errors: FieldErrors) {
  const passwordError = getPasswordValidationError(password)
  if (passwordError) errors.password = passwordError
  if (!required(confirmPassword)) errors.confirmPassword = 'Please confirm your password.'
  else if (!passwordsMatch(password, confirmPassword))
    errors.confirmPassword = 'Passwords do not match.'
}

export function validateDonorForm(data: {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  bloodGroup: string
  location: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!required(data.fullName)) errors.fullName = 'Please enter your full name.'
  validateSignupEmail(data.email, errors)
  if (!required(data.phone)) errors.phone = 'Please enter your phone number.'
  else if (!isValidPhone(data.phone)) errors.phone = 'Please enter a valid phone number.'
  validateSignupPassword(data.password, data.confirmPassword, errors)
  if (!required(data.bloodGroup)) errors.bloodGroup = 'Please select your blood group.'
  if (!required(data.location)) errors.location = 'Please enter your location.'
  return errors
}

export function validateRecipientForm(data: {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  location: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!required(data.fullName)) errors.fullName = 'Please enter your full name.'
  validateSignupEmail(data.email, errors)
  if (!required(data.phone)) errors.phone = 'Please enter your phone number.'
  else if (!isValidPhone(data.phone)) errors.phone = 'Please enter a valid phone number.'
  validateSignupPassword(data.password, data.confirmPassword, errors)
  if (!required(data.location)) errors.location = 'Please enter your location.'
  return errors
}

export function validateOrgForm(data: {
  name: string
  type: string
  registrationNumber: string
  email: string
  phone: string
  address: string
  staffId: string
  staffName: string
  password: string
  documentName: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!required(data.name)) errors.name = 'Please enter the organization name.'
  if (!required(data.type)) errors.type = 'Please select hospital or blood bank.'
  if (!required(data.registrationNumber))
    errors.registrationNumber = 'Please enter the registration number.'
  if (!required(data.email)) errors.email = 'Please enter the official email.'
  else if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email address.'
  if (!required(data.phone)) errors.phone = 'Please enter a phone number.'
  else if (!isValidPhone(data.phone)) errors.phone = 'Please enter a valid phone number.'
  if (!required(data.address)) errors.address = 'Please enter the organization address.'
  if (!required(data.staffId)) errors.staffId = 'Please enter your staff ID.'
  if (!required(data.staffName)) errors.staffName = 'Please enter the staff contact name.'
  const passwordError = getPasswordValidationError(data.password)
  if (passwordError) errors.password = passwordError
  if (!required(data.documentName))
    errors.documentName = 'Please attach a supporting document.'
  return errors
}

export function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!required(email)) errors.email = 'Please enter your email address.'
  else if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.'
  if (!required(password)) errors.password = 'Please enter your password.'
  return errors
}
