export interface ActionTypes {
	REQUESTED: string;
	FAILED: string;
	SUCCEEDED: string;
	RESET: string;
	RETRY: string;
	REPLACE: string;
}

export interface Action {
	type: string;
}
export interface ActionError<TError> extends Action {
	error: TError;
}
export interface ActionSucceeded<TData> extends Action {
	data: TData;
}
export interface ActionReplace<TState> extends Action {
	state: TState;
}

export type FuncRequested = (params) => Action;
export type FuncFailed<TError> = (error: TError) => ActionError<TError>;
export type FuncSucceeded<TData> = (data: TData) => ActionSucceeded<TData>;
export type FuncReset = () => Action;
export type FuncReplace<TState> = (state: TState) => ActionReplace<TState>;

export interface AsyncDataActions<TData, TError, TState> {
	actions: ActionTypes;
	requested: FuncRequested;
	failed: FuncFailed<TError>;
	succeeded: FuncSucceeded<TData>;
	reset: FuncReset;
	retry: FuncRequested;
	replace: FuncReplace<TState>;
}

export function createActions<TData, TError, TState>(PREFIX: string): AsyncDataActions<TData, TError, TState>;

export interface AsyncDataState<TData, TError> {
	data: TData;
	requesting: boolean;
	succeeded: boolean;
	error: TError;
}

export type FuncAsyncDataReducer<TData, TError> = (
	state: AsyncDataState<TData, TError>,
	action: Action
) => AsyncDataState<TData, TError>;

export function createReducer<TData, TError>(
	defaultState: AsyncDataState<TData, TError>,
	actions: ActionTypes
): FuncAsyncDataReducer<TData, TError>;
