export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-()]/g, '')
  return /^\+?\d{9,15}$/.test(digits)
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8
}

export function required(value: string): boolean {
  return value.trim().length > 0
}

export type FieldErrors = Record<string, string>

export function validateDonorForm(data: {
  fullName: string
  email: string
  phone: string
  password: string
  bloodGroup: string
  location: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!required(data.fullName)) errors.fullName = 'Please enter your full name.'
  if (!required(data.email)) errors.email = 'Please enter your email address.'
  else if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email address.'
  if (!required(data.phone)) errors.phone = 'Please enter your phone number.'
  else if (!isValidPhone(data.phone)) errors.phone = 'Please enter a valid phone number.'
  if (!required(data.password)) errors.password = 'Please create a password.'
  else if (!isStrongPassword(data.password))
    errors.password = 'Password must be at least 8 characters.'
  if (!required(data.bloodGroup)) errors.bloodGroup = 'Please select your blood group.'
  if (!required(data.location)) errors.location = 'Please enter your location.'
  return errors
}

export function validateRecipientForm(data: {
  fullName: string
  email: string
  phone: string
  password: string
  location: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!required(data.fullName)) errors.fullName = 'Please enter your full name.'
  if (!required(data.email)) errors.email = 'Please enter your email address.'
  else if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email address.'
  if (!required(data.phone)) errors.phone = 'Please enter your phone number.'
  else if (!isValidPhone(data.phone)) errors.phone = 'Please enter a valid phone number.'
  if (!required(data.password)) errors.password = 'Please create a password.'
  else if (!isStrongPassword(data.password))
    errors.password = 'Password must be at least 8 characters.'
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
