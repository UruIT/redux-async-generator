export const hasErrors = validation => {
	if (Array.isArray(validation)) {
		return validation.some(hasErrors)
	} else if (typeof validation === typeof {}) {
		return Object.values(validation).some(hasErrors)
	} else {
		return !!validation
	}
}
