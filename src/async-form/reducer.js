import { forKeys } from '../utils/object';
import { createReducer as createDefaultReducer } from '../async-data/reducer';
import merge from 'merge';

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

export const createFields = (data, requested, validate, state) => {
	return dataToFields(data, validate(data, requested, state));
};

export const addFieldsToState = (state, data, requested, validate) => ({
	...state,
	fields: createFields(data, requested, validate, state)
});

export const addToState = (state, data, validate) => {
	state = addDataToState(state, data);
	state = addFieldsToState(state, selectData(state), state.requested, validate);
	return state;
};

export const createReducer = (defaultData, actions, validate, defaultNonData = {}) => {
	const DEFAULT_STATE = addToState(
		{
			requesting: false,
			...defaultNonData
		},
		defaultData,
		validate
	);
	const defaultReducer = createDefaultReducer(DEFAULT_STATE, actions);
	return (state = DEFAULT_STATE, action) => {
		switch (action.type) {
			case actions.SETDATA:
				return addToState(state, action.data, validate);
			case actions.CHANGE:
				return addToState(state, updateData(state, action), validate);
			case actions.SETNONDATA:
				return merge.recursive(true, state, action.nonData);
			case actions.REQUESTED:
				state = defaultReducer(state, action);
				return addToState({ ...state, requested: true }, selectData(state), validate);
			default:
				return defaultReducer(state, action);
		}
	};
};
