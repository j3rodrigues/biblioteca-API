import vine from '@vinejs/vine'

type ValidationResult = {
	valid: boolean
	errors?: Record<string, string>
}

export function validateCreate(payload: any): ValidationResult {
	const errors: Record<string, string> = {}

	if (!payload || typeof payload !== 'object') {
		return { valid: false, errors: { payload: 'Invalid payload' } }
	}

	if (!payload.title || typeof payload.title !== 'string') {
		errors.title = 'Title is required and must be a string'
	}

	if (!payload.isbn || typeof payload.isbn !== 'string') {
		errors.isbn = 'ISBN is required and must be a string'
	}

	if (!Array.isArray(payload.authors) || payload.authors.some((a) => typeof a !== 'string')) {
		errors.authors = 'Authors is required and must be an array of strings'
	}

	if (!payload.publisher || typeof payload.publisher !== 'string') {
		errors.publisher = 'Publisher is required and must be a string'
	}

	if (typeof payload.year !== 'number') {
		errors.year = 'Year is required and must be a number'
	}

	if (typeof payload.edition !== 'number') {
		errors.edition = 'Edition is required and must be a number'
	}

	if (typeof payload.pages !== 'number') {
		errors.pages = 'Pages is required and must be a number'
	}

	if (!payload.category || typeof payload.category !== 'string') {
		errors.category = 'Category is required and must be a string'
	}

	if (typeof payload.quantity_available !== 'number') {
		errors.quantity_available = 'Quantity available is required and must be a number'
	}

	if (!payload.shelf_location || typeof payload.shelf_location !== 'string') {
		errors.shelf_location = 'Shelf location is required and must be a string'
	}

	return { valid: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined }
}

export function validateUpdate(payload: any): ValidationResult {
	const errors: Record<string, string> = {}

	if (!payload || typeof payload !== 'object') {
		return { valid: false, errors: { payload: 'Invalid payload' } }
	}

	if (payload.title && typeof payload.title !== 'string') {
		errors.title = 'Title must be a string'
	}

	if (payload.isbn && typeof payload.isbn !== 'string') {
		errors.isbn = 'ISBN must be a string'
	}

	if (payload.authors && (!Array.isArray(payload.authors) || payload.authors.some((a) => typeof a !== 'string')))
		errors.authors = 'Authors must be an array of strings'

	if (payload.publisher && typeof payload.publisher !== 'string') {
		errors.publisher = 'Publisher must be a string'
	}

	if (payload.year && typeof payload.year !== 'number') {
		errors.year = 'Year must be a number'
	}

	if (payload.edition && typeof payload.edition !== 'number') {
		errors.edition = 'Edition must be a number'
	}

	if (payload.pages && typeof payload.pages !== 'number') {
		errors.pages = 'Pages must be a number'
	}

	if (payload.category && typeof payload.category !== 'string') {
		errors.category = 'Category must be a string'
	}

	if (payload.quantity_available && typeof payload.quantity_available !== 'number') {
		errors.quantity_available = 'Quantity available must be a number'
	}

	if (payload.shelf_location && typeof payload.shelf_location !== 'string') {
		errors.shelf_location = 'Shelf location must be a string'
	}

	return { valid: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined }
}