# Form

Managing forms state in React component's is not only repetitive but messy. The validation and state transitions shouldn't be part of the UI. Here's an example of managed fields, validation and submit:

### `Form.js`

```javascript
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
        if (!Object.values(state.errors).some(a => a)) {
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

## Usage

We use redux store state and actions to trigger the changes, a validation function -tied to the reducer- updates the field errors.

Every `<fieldset>` is wrapped in a `Field` component to handle the common display of label, error message and input.

### `Field.js`

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

### `form.actions.js`

```javascript
import { createActions } from 'redux-async-generator/form';

export const { submitted, failed, succeeded, change, actions } = createActions('FORM');
```

### `form.reducer.js`

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

### `form.selectors.js`

```javascript
export function form(state) {
    const result = // find in whole reducer state the form reducer state;
    return result;
}
```

### `form.container.js`

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

### `Form.js`

```javascript
import { hasErrors } from 'redux-async-generator/form';

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
        const { fields, change } = this.props;
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <Field label="Username" type="email" {...fields.username} onChange={change} />
                <Field label="Password" type="password" {...fields.password} onChange={change} />

                {/* show form validation errors here */}
                <button>Login</button>
            </form>
        );
    }
}
```

### `form.sagas.js`

The sagas will send the form data to the server and push back to the store the result.

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
