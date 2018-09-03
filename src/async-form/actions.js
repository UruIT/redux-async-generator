import { createActionTypes, createActions as createDefaultActions } from '../async-data/actions'

const actionTypes = [...defaultActionTypes, 'SETDATA', 'CHANGE', 'SETNONDATA']

export const createActions = prefix => {
	const actions = createActionTypes(actionTypes, prefix)
	return {
		...createDefaultActions(prefix),
		setData: data => ({
			type: actions.SETDATA,
			data
		}),
		change: ({ value, name }) => ({
			type: actions.CHANGE,
			value,
			name
		}),
		setNonData: nonData => ({
			type: actions.SETNONDATA,
			nonData
		}),
		actions
	}
}
