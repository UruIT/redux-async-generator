import {
	actionTypes as defaultActionTypes,
	createActions as defaultCreateActions,
	createActionTypes
} from '../utils/actions';

const actionTypes = ['SETDATA', 'CHANGE', 'SETNONDATA', 'SUBMITTED', ...defaultActionTypes];

export const createActions = prefix => {
	const actions = createActionTypes(actionTypes, prefix);
	return {
		...defaultCreateActions(prefix),
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
		submitted: () => ({
			type: actions.SUBMITTED
		}),
		actions
	};
};
