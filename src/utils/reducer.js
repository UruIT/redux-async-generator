import merge from 'merge';

export const createReducer = (defaultState, actions) => {
	const DEFAULT_STATE = defaultState;
	return (state = DEFAULT_STATE, action) => {
		switch (action.type) {
			case actions.SUCCEEDED:
				return merge.recursive(true, state, { succeeded: true });
			case actions.FAILED:
				return merge.recursive(true, state, { error: action.error });
			case actions.REPLACE:
				return action.state;
			case actions.RESET:
				return DEFAULT_STATE;
			default:
				return state;
		}
	};
};
