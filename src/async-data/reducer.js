import merge from 'merge';
import { createReducer as defaultCreateReducer } from '../utils/reducer';

export const createReducer = (defaultState, actions) => {
	const DEFAULT_STATE = {
		requesting: false,
		...defaultState
	};
	const defaultReducer = defaultCreateReducer(DEFAULT_STATE, actions);

	return function(state, action) {
		switch (action.type) {
			case actions.REQUESTED:
			case actions.RETRY:
				return merge.recursive(true, DEFAULT_STATE, { requesting: true });
			case actions.SUCCEEDED:
				return merge.recursive(true, defaultReducer(state, action), {
					requesting: false,
					data: action.data || state.data
				});
			case actions.FAILED:
				return merge.recursive(true, defaultReducer(state, action), { requesting: false });
			default:
				return defaultReducer(state, action);
		}
	};
};
