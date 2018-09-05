import { AsyncDataActionTypes, AsyncDataActions, Action, AsyncDataState } from './async-data';

export interface AsyncFormActionTypes extends AsyncDataActionTypes {
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

export interface AsyncFormActions<TData, TError, TState> extends AsyncDataActions<TData, TError, TState> {
	actions: AsyncFormActionTypes;
	change: FuncChange;
	setData: FuncSetData<TData>;
	setNonData: FuncSetNonData;
}

export function createActions<TData, TError, TState>(PREFIX: string): AsyncDataActions<TData, TError, TState>;

export interface AsyncFormFields<TData> {}

export interface AsyncFormState<TData, TError> extends AsyncDataState<TData, TError> {
	requested: boolean;
	fields: AsyncFormFields<TData>;
}

export interface AsyncFormValidation<TData> {}

export type FuncAsyncFormValidate<TData, TError> = (
	data: TData,
	requested: boolean,
	state: AsyncFormState<TData, TError>
) => AsyncFormValidation<TData>;

export type FuncAsyncFormReducer<TData, TError> = (
	state: AsyncFormState<TData, TError>,
	action: Action
) => AsyncFormState<TData, TError>;

export function createReducer<TData, TError>(
	defaultData: TData,
	actions: AsyncFormActionTypes,
	validate: FuncAsyncFormValidate<TData, TError>,
	defaultNonData: any
): FuncAsyncFormReducer<TData, TError>;
