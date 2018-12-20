export const forKeys = (callback, keys) =>
	keys && Object.keys(keys).reduce((res, key) => ({ ...res, [key]: callback(key) }), {})
