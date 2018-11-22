# Redux Async Generator

`redux-async-generator` is small library to generate common redux actions and reducers.

If you work with React and Redux, components that needs to load async data usually need to have actions that triggers the load, and others to indicate that async request succeeded or failed. You can leverage the boilerplate with `redux-async-generator/async-data`.

You can use `redux-async-generator/async-form` to handle your form fields in the redux store with state and validation apart from the component.

# Getting started

## Install

```sh
$ npm install --save redux-async-generator
```

or

```sh
$ yarn add redux-async-generator
```

## Async Data

### Example

Let's say you have a React Component -you're working with Redux (+ redux-saga or similar)-, that needs to load a resource from an api once the component mounts, you'll probably need to write the following:

#### `component.actions.js`

```javascript
export const COMPONENT_REQUESTED = 'COMPONENT_REQUESTED';
export const requested = () => ({
    type: COMPONENT_REQUESTED
});
```

#### `Component.js`

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

#### `component.reducer.js`

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

#### `component.sagas.js`

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

#### `component.actions.js`

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

#### `component.reducer.js`

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

### Usage

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

## Form

### Example

While working with forms in React we found that handling their state in the component was not only repetitive but also messy because the validation and other rules shouldn't be part of the UI. This is what you'd probably write to handle fields, validation and submit:

#### `Form.js`

```javascript
import { hasErrors } from 'redux-async-generator/form';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            errors: {}
        };
    }

    handleChange(event) {
        const {
            target: { name, value }
        } = event;
        // apply validation and other rules
        let errors = this.state.errors;
        switch (name) {
            case 'username':
                errors = {
                    ...errors
                    username: !value && 'The username is required'
                };
                break;
            case 'password':
                errors = {
                    ...errors,
                    password: !value && 'The password is required'
                };
                break;
        }
        this.setState({ [name]: value, errors });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (Object.values(state.errors).filter(a => a).length) {
            // call some api to complete action
            this.props.submit(this.state).then(
                // show success message
            ).catch(
                // show error message
            );
        }
    }

    render() {
        const { username, password, errors } = this.state;
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <fieldset>
                    <label>Username</label>
                    <input type="email" name="username" value={username} onChange={this.handleChange} />
                    {errors.username && (
                        <span>{errors.username}</span>
                    )}
                </fieldset>
                <fieldset>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={this.handleChange} />
                    {errors.password && (
                        <span>{errors.password}</span>
                    )}
                </fieldset>

                {/* show form validation errors here */}
                <button>Login</button>
            </form>
        );
    }
}
```

### Usage

Instead of using component's state, we use the redux store state, actions to trigger the changes and a validation function tied to the reducer to update the errors.

Every `<fieldset>` is wrapped in a `Field` component to handle the common display of label, error message and input.

#### `Field.js`

```javascript
class Field extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const {
            target: { name, value }
        } = event;
        this.props.onChange({ name, value });
    }

    render() {
        const { label, name, value, error, type } = this.props;
        return (
            <fieldset>
                <label>{label}</label>
                <input type={type} name={name} value={value} onChange={this.handleChange} />
                {error && <span>{error}</span>}
            </fieldset>
        );
    }
}
```

#### `form.actions.js`

```javascript
import { createActions } from 'redux-async-generator/form';

export const { submitted, failed, succeeded, change, actions } = createActions('FORM');
```

#### `form.reducer.js`

Initial form state, validation and state updates are handled here. If no custom state behavior is needed, you can use default `createReducer` from `form`.

```javascript
import { createReducer } from 'redux-async-generator/form';
import { actions } from './form.actions.js';

const defaultData = {
    username: '',
    password: ''
};

function validate({ username, password }, submitted) {
    // only run validation once the form was attempted to submit
    return {
        username: submitted && !username && 'The username is required',
        password: submitted && !password && 'The password is required'
    };
}

export default createReducer(defaultData, actions, validate);
```

#### `form.selectors.js`

```javascript
export function form(state) {
    const result = // find in whole reducer state the form reducer state;
    return result;
}
```

#### `form.container.js`

Now we need to connect the `Form` component with the redux store for the form state (data + validation) and the actions it can trigger (change -to update a field value- and submitted -to send the data to the server-).

```javascript
import { connect } from 'react-redux';
import { form } from './form.selectors';
import { change, submitted } from './form.actions';
import Form from './Form';

const mapStateToProps = form;

const mapDispatchToProps = { change, submitted };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);
```

#### `Form.js`

```javascript
class Form extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!hasErrors(this.props.fields)) {
            this.props.requested(this.props.data);
        }
    }

    render() {
        const {
            fields: { username, password },
            change
        } = this.props;
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <Field label="Username" type="email" {...username} onChange={change} />
                <Field label="Password" type="password" {...password} onChange={change} />

                {/* show form validation errors here */}
                <button>Login</button>
            </form>
        );
    }
}
```

So far, the validation rules

#### `form.sagas.js`

```javascript
import { takeLatest } from 'redux-saga/effects';

function* login({ username, password }) {
    try {
        const result = yield call(fetch(url, { username, password }));
        yield put(succeeded());
    } catch (error) {
        yield put(failed(error));
    }
}

function* watchRequested() {
    yield takeLatest(actions.REQUESTED, login);
}

export const sagas = [watchSubmit];
```

## Documentation

-   [API Reference](docs/api.md)
