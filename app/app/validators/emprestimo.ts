type ValidationResult = {
  valid: boolean
  errors?: Record<string, string>
}

export function validateCreate(payload: any): ValidationResult {
  const errors: Record<string, string> = {}
  if (!payload || typeof payload !== 'object') return { valid: false, errors: { payload: 'Invalid payload' } }

  if (!payload.user_id || typeof payload.user_id !== 'number') errors.user_id = 'user_id is required and must be a number'
  if (!payload.livro_id || typeof payload.livro_id !== 'number') errors.livro_id = 'livro_id is required and must be a number'

  return { valid: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined }
}
