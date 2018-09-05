import merge from 'merge'

export const createReducer = (defaultState, actions) => {
	const DEFAULT_STATE = {
		requesting: false,
		...defaultState
	}
	return (state = DEFAULT_STATE, action) => {
		switch (action.type) {
			case actions.REQUESTED:
			case actions.RETRY:
				return merge.recursive(true, state, { requesting: true, succeeded: false })
			case actions.SUCCEEDED:
				return merge.recursive(true, state, {
					requesting: false,
					succeeded: true,
					data: action.data || state.data,
					error: null
				})
			case actions.FAILED:
				return merge.recursive(true, state, { requesting: false, error: action.error })
			case actions.REPLACE:
				return action.state
			case actions.RESET:
				return DEFAULT_STATE
			default:
				return state
		}
	}
}
