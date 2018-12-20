import merge from 'merge';
import {
	actionTypes as defaultActionTypes,
	createActions as defaultCreateActions,
	createActionTypes
} from '../utils/actions';

export const actionTypes = ['REQUESTED', 'RETRY', ...defaultActionTypes];

export const createActions = prefix => {
	const actions = createActionTypes(actionTypes, prefix);
	return {
		...defaultCreateActions(prefix),
		requested: params =>
			merge.recursive(true, params, {
				type: actions.REQUESTED
			}),
		retry: params =>
			merge.recursive(true, params, {
				type: actions.RETRY
			}),
		actions
	};
};
