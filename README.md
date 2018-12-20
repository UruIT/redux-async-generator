# Redux Async Generator

`redux-async-generator` is small library to generate common redux actions and reducers.

If you work with React and Redux, components that needs to load async data usually need to have actions that triggers the load, and others to indicate that async request succeeded or failed. You can leverage the boilerplate with `redux-async-generator/async-data`.

Use `redux-async-generator/async-form` to handle form fields in the redux store with state and validation separate from the component.

## Getting started

### Install

```sh
$ npm install --save redux-async-generator
```

or

```sh
$ yarn add redux-async-generator
```

## Async Data

### TL;DR;

When loading data from async source, define the actions and reducer files for handling the state of that load in redux.

#### `component.actions.js`

```javascript
import { createActions } from 'redux-async-generator/async-data';

export const { requested, failed, succeeded, actions } = createActions('COMPONENT');
```

#### `component.reducer.js`

```javascript
import { createReducer } from 'redux-async-generator/async-data';
import { actions } from './component.actions.js';

const defaultState = { data: [] }; // initial data

export default createReducer(defaultState, actions);
```

More info in [async data readme](/docs/async-data-readme.md)

## Form

### TL;DR;

When creating a form, define the actions, reducer and validation files for managing the state and rules that apply in redux.

#### `form.actions.js`

```javascript
import { createActions } from 'redux-async-generator/form';

export const { submitted, failed, succeeded, change, actions } = createActions('FORM');
```

#### `form.reducer.js`

```javascript
import { createReducer } from 'redux-async-generator/form';
import { actions } from './form.actions.js';

const defaultData = {
    username: '',
    password: ''
};

function validate({ username, password }, submitted) {
    return {
        username: submitted && !username && 'The username is required',
        password: submitted && !password && 'The password is required'
    };
}

export default createReducer(defaultData, actions, validate);
```

More info in [form readme](/docs/form-readme.md)

## Documentation

-   [API Reference](docs/api.md)
