export function createActionTypes(actionTypes, prefix) {
	return actionTypes.reduce((res, k) => ({ ...res, [k]: `${prefix}_${k}` }), {});
}

export const actionTypes = ['FAILED', 'SUCCEEDED', 'REPLACE', 'RESET'];

export function createActions(prefix) {
	const actions = createActionTypes(actionTypes, prefix);
	return {
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
	};
}
