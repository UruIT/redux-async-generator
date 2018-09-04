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
export interface ActionError extends Action {
	error: any;
}
export interface ActionSucceeded extends Action {
	data: any;
}
export interface ActionReplace extends Action {
	state: any;
}

export type FuncRequested = (params) => Action;
export type FuncFailed = (error) => ActionError;
export type FuncSucceeded = (data) => ActionSucceeded;
export type FuncReset = () => Action;
export type FuncReplace = (state) => ActionReplace;

export interface AsyncDataActions {
	actions: ActionTypes;
	requested: FuncRequested;
	failed: FuncFailed;
	succeeded: FuncSucceeded;
	reset: FuncReset;
	retry: FuncRequested;
	replace: FuncReplace;
}

export function createActions(PREFIX: string): AsyncDataActions;

export interface AsyncDataState {
	data: any;
	requesting: boolean;
	succeeded: boolean;
	error: any;
}

export type FuncAsyncDataReducer = (state: AsyncDataState, action: Action) => AsyncDataState;

export function createReducer(defaultState: AsyncDataState, actions: ActionTypes): FuncAsyncDataReducer;
