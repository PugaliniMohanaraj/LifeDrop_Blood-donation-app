export const SRI_LANKA_PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
] as const

export type SriLankaProvince = (typeof SRI_LANKA_PROVINCES)[number]

export const SRI_LANKA_DISTRICTS: Record<SriLankaProvince, readonly string[]> = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  Eastern: ['Ampara', 'Batticaloa', 'Trincomalee'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
}

export function districtsForProvince(province: string): string[] {
  if (!province) return []
  const key = SRI_LANKA_PROVINCES.find((p) => p === province)
  return key ? [...SRI_LANKA_DISTRICTS[key]] : []
}
