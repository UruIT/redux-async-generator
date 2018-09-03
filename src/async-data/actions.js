export const actionTypes = ['REQUESTED', 'RETRY', 'SUCCEEDED', 'FAILED', 'REPLACE', 'RESET']

export const createActionTypes = (actionTypes, prefix) =>
	actionTypes.reduce((res, k) => ({ ...res, [k]: `${prefix}_${k}` }), {})

export const createActions = prefix => {
	const actions = createActionTypes(actionTypes, prefix)
	return {
		requested: params => ({
			...params,
			type: actions.REQUESTED
		}),
		retry: params => ({
			...params,
			type: actions.RETRY
		}),
		succeeded: data => ({
			type: actions.SUCCEEDED,
			data
		}),
		failed: error => ({
			type: actions.FAILED,
			error
		}),
		replace: state => ({
			type: actions.REPLACE,
			state
		}),
		reset: () => ({
			type: actions.RESET
		}),
		actions
	}
}
