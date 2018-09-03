# API Reference

-   [async-data](#async-data)
    -   [actions](#actions)
        -   [`createActions(PREFIX)`](#createactionsprefix)
        -   [`requested(params)`](#requestedparams)
        -   [`failed(error)`](#failederror)
        -   [`succeeded(data)`](#succeededdata)
        -   [`reset()`](#reset)
        -   [`retry(params)`](#retryparams)
        -   [`replace(state)`](#replacestate)
    -   [reducer](#reducer)
        -   [`createReducer(defaultState, actions)`](#createreducerdefaultstateactions)

### async-data

### actions

#### `createActions(PREFIX)`

Returns an object with the `actions` types array prefixed by the `PREFIX` and the action functions `requested`, `failed`, `succeeded`, `reset`, `retry`, `replace`.

#### `requested(params)`

Returns an action with type `actions.REQUESTED` and spread `params` for the request

#### `failed(error)`

Returns an action with type `actions.FAILED` and the `error`

#### `succeeded(data)`

Returns an action with type `actions.SUCCEEDED` and the `data`

#### `reset()`

Returns an action with type `actions.RESET`, used to reset store state

#### `retry(params)`

Same as `requested`, but with type `actions.RETRY` to disambiguate if needed

#### `replace(state)`

Returns an action with type `actions.REPLACE`, used to modify store to a known state.

### reducer

#### `createReducer(defaultState, actions)`

Returns a reducer function handling action types from `actions` (created by async-data `createActions` method). `defaultState` is the initial (and reset) state of the reducer.
