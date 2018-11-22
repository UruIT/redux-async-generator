import { AsyncDataActionTypes, AsyncDataActions, Action, AsyncDataState } from './async-data';

export interface FormActionTypes extends AsyncDataActionTypes {
	CHANGE: string;
	SETDATA: string;
	SETNONDATA: string;
}

export interface ActionChange extends Action {
	name: string;
	value: string;
}
export interface ActionSetData<TData> extends Action {
	data: TData;
}
export interface ActionSetNonData extends Action {
	nonData: Object;
}

export type FuncChange = ({ name: string, value: any }) => ActionChange;
export type FuncSetData<TData> = (data: TData) => ActionSetData<TData>;
export type FuncSetNonData = (nonData: Object) => ActionSetNonData;

export interface FormActions<TData, TError, TState> extends AsyncDataActions<TData, TError, TState> {
	actions: FormActionTypes;
	change: FuncChange;
	setData: FuncSetData<TData>;
	setNonData: FuncSetNonData;
}

export function createActions<TData, TError, TState>(PREFIX: string): AsyncDataActions<TData, TError, TState>;

export interface FormFields<TData> {}

export interface FormState<TData, TError> extends AsyncDataState<TData, TError> {
	requested: boolean;
	fields: FormFields<TData>;
}

export interface FormValidation<TData> {}

export type FuncFormValidate<TData, TError> = (
	data: TData,
	requested: boolean,
	state: FormState<TData, TError>
) => FormValidation<TData>;

export type FuncFormReducer<TData, TError> = (
	state: FormState<TData, TError>,
	action: Action
) => FormState<TData, TError>;

export function createReducer<TData, TError>(
	defaultData: TData,
	actions: FormActionTypes,
	validate: FuncFormValidate<TData, TError>,
	defaultNonData: any
): FuncFormReducer<TData, TError>;
