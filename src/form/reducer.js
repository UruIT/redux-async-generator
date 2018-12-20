import { forKeys } from '../utils/object';
import merge from 'merge';
import { createReducer as defaultCreateReducer } from '../utils/reducer';

export const addDataToState = (state, data) => merge.recursive(true, state, { data });

export const selectData = ({ data }) => data;

const separator = '.';

const updateDataForName = (data, path, value) => {
	if (path.length === 1) {
		data[path[0]] = value;
	} else {
		updateDataForName(data[path[0]], path.slice(1), value);
	}
};

export const updateData = ({ data }, { name, value }) => {
	data = merge.recursive(true, data);
	updateDataForName(data, name.split(separator), value);
	return data;
};

const combineKey = (key, prefix = '') => (prefix ? `${prefix}${separator}${key}` : key);
export const dataToFields = (data, validation, prefix = '') => {
	if (Array.isArray(data)) {
		validation = validation || [];
		return data.map((d, ix) => dataToFields(d, validation[ix], combineKey(ix, prefix)));
	} else if (data && typeof data === typeof {}) {
		validation = validation || {};
		return forKeys(key => dataToFields(data[key], validation[key], combineKey(key, prefix)), data);
	} else {
		return {
			name: prefix,
			value: data,
			error: !!validation,
			errorMessage: validation
		};
	}
};

export const createFields = (data, submitted, validate, state) => {
	return dataToFields(data, validate(data, submitted, state));
};

export const addFieldsToState = (state, data, submitted, validate) => ({
	...state,
	fields: createFields(data, submitted, validate, state)
});

export const addToState = (state, data, validate) => {
	state = addDataToState(state, data);
	state = addFieldsToState(state, selectData(state), state.submitted, validate);
	return state;
};

export const createReducer = (defaultData, actions, validate, defaultNonData = {}) => {
	const DEFAULT_STATE = addToState(
		{
			submitting: false,
			...defaultNonData
		},
		defaultData,
		validate
	);
	const defaultReducer = defaultCreateReducer(DEFAULT_STATE, actions);

	return function(state, action) {
		switch (action.type) {
			case actions.SETDATA:
				return addToState(state, action.data, validate);
			case actions.CHANGE:
				return addToState(state, updateData(state, action), validate);
			case actions.SETNONDATA:
				return merge.recursive(true, state, action.nonData);
			case actions.SUBMITTED:
				return addToState(
					merge.recursive(true, state, { submitted: true, submitting: true, error: null }),
					selectData(state),
					validate
				);
			case actions.FAILED:
				return addToState(
					merge.recursive(true, defaultReducer(state, action), { submitting: false }),
					selectData(state),
					validate
				);
			case actions.SUCCEEDED:
				return addToState(
					merge.recursive(true, state, { submitting: false, result: action.result }),
					selectData(state),
					validate
				);
			default:
				return defaultReducer(state, action);
		}
	};
};
