# Redux Async Generator

`redux-async-generator` is small library to generate common redux actions and reducers. If you work with React and Redux, components that needs to load async data usually need to have actions that triggers the load, and others to indicate that async request succeeded or failed.

# Getting started

## Install

```sh
$ npm install --save redux-async-generator
```

or

```sh
$ yarn add redux-async-generator
```

## Example

Let's say you have a React Component -you're working with Redux (+ redux-saga or else)-, that needs to load a resource from an api once the component mounts, you'll probably need to write the following:

### `component.actions.js`

```javascript
export const COMPONENT_REQUESTED = 'COMPONENT_REQUESTED';
export const requested = () => ({
    type: COMPONENT_REQUESTED
});
```

### `Component.js`

```javascript
class Component extends React.Component {
    componentDidMount() {
        this.props.requested();
    }
    render() {
        ...
    }
}
```

We also have a `component.container.js` file to connect the `requested` callback (passed to `Component`) to the redux store `dispatch`.

Then, when the request starts, the reducer will show the request is in progress:

### `component.reducer.js`

```javascript
import { COMPONENT_REQUESTED } from './component.actions.js';

export default function reducer(state, action) {
    switch (action.type) {
        case COMPONENT_REQUESTED:
            return { ...state, requesting: true };
        default:
            return state;
    }
}
```

Let's say we're using `redux-saga` to handle our side effects, so we'll have the following:

### `component.sagas.js`

```javascript
import { takeLatest, call, put } from 'redux-saga/effects';
import { COMPONENT_REQUESTED, succeeded, failed } from './component.actions.js';

function* load() {
    try {
        const url = ...;
        const data = yield call(fetch(url));
        // send result to redux store
        yield put(succeeded(data))
    } catch (error) {
        // send error to redux store
        yield put(failed(error))
    }
}

function* watchRequested() {
    yield takeLatest(COMPONENT_REQUESTED, load);
}

export const sagas = [watchRequested];
```

Once the request to the url completes (failed or succeeded), we'll propagate the result to the redux store by putting an action. This is what the `component.actions.js` would look with these two new actions:

### `component.actions.js`

```javascript
...
export const COMPONENT_SUCCEEDED = 'COMPONENT_SUCCEEDED';
export const succeeded = data => ({
    type: COMPONENT_SUCCEEDED,
    data
});

export const COMPONENT_FAILED = 'COMPONENT_FAILED';
export const failed = error => ({
    type: COMPONENT_REQUESTED,
    error
});
```

And the reducer will handle this two actions to reflect the state change:

### `component.reducer.js`

```javascript
import { COMPONENT_REQUESTED } from './component.actions.js';

export default function reducer(state, action) {
    switch (action.type) {
        case COMPONENT_REQUESTED:
            return { ...state, requesting: true };
        case COMPONENT_SUCCEEDED:
            return { ...state, data: action.data, requesting: false, succeeded: true, error: null };
        case COMPONENT_FAILED:
            return { ...state, requesting: false, succeeded: false, error: action.error };
        default:
            return state;
    }
}
```

This behavior tends to repeat for each component that needs to load (or save) data asynchronously, you can use `redux-async-generator` to reduce the boilerplate for the actions and reducer as follow:

## Usage

### `component.actions.js`

```javascript
import { createActions } from 'redux-async-generator/async-data';

export const { requested, failed, succeeded, actions } = createActions('COMPONENT');
```

### `component.reducer.js`

```javascript
import { createReducer } from 'redux-async-generator/async-data';
import { actions } from './component.actions.js';

const defaultState = { data: [] }; // initial data

export default createReducer(defaultState, actions);
```

# Documentation

-   [API Reference](docs/api.md)
