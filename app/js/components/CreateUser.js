import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

class CreateUser extends Component {
  constructor(props, context) {
    super(props, context);

    // event bindings
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // initial state
    this.state = {
      isLoading: false,
      username: '',
      description: '',
      usernameHasChanged: false,
      error: ''
    };
  }

  /**
   * Events
   */
  handleClick() {
    this.setState({ isLoading: true });
    return DTwitter.methods.createAccount(this.state.username, this.state.description).send({gas: 200000}).then(() => {
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
      
      // tell our parent to re-render with new user
      this.props.onAction();

      this.props.history.push('/@' + this.state.username);
    }).catch((err) => {
      console.error(err);
      this.setState({ isLoading: false, error: err.message });
    });
  }

  handleChange(e) {
    let state = {};
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;

    if (input === 'username'){
      
      state.usernameHasChanged = true;

      if(value.length >= 5) {
        // not loading, check username doesn't exist
        if (!this.state.isLoading) {
          DTwitter.methods.userExists(value).call().then((exists) => {
            state.isLoading = false;
            state.error = exists ? 'Username not available' : '';
            this.setState(state);

          }).catch((err) => {
            console.error(err);
            state.isLoading = false;
            state.error = err.message;
            this.setState(state);
          });
          
          // set loading state while checking the contract
          state.isLoading = true;
        }

        // we are loading already, do nothing while we wait
        return true;
      }
    }

    this.setState(state);
  }

  /**
   * Helper methods
   */
  getValidationState() {
    if (this.state.isLoading) return null;

    const length = this.state.username.length;
    if(length === 0 && !this.state.usernameHasChanged) return null;
    if (length <= 5) return 'error';

    return this.state.error.length > 0 ? 'error' : 'success';
  }

  /**
   * React methods
   */
  render() {
    const { isLoading } = this.state;
    let validationState = this.getValidationState();
    let isValid = validationState !== 'error';
    let feedback = isValid ? 'Username is available' : this.state.error || 'Usernames must be 6 or more characters.';

    return (
      <form>
          <FieldGroup
            type="text"
            value={this.state.username}
            disabled={isLoading}
            placeholder="@username"
            onChange={this.handleChange}
            name="username"
            autoComplete="off"
            label="Desired username"
            validationState={validationState}
          />
          <FieldGroup
            type="text"
            value={this.state.description}
            placeholder="description"
            onChange={this.handleChange}
            name="description"
            label="Description"
          />
          <Button
            bsStyle="primary"
            disabled={isLoading || !isValid}
            onClick={(isLoading || !isValid) ? null : this.handleClick}
          >
            {isLoading ? 'Loading...' : 'Create user'}
          </Button>
          <HelpBlock>{feedback}</HelpBlock>
      </form>
    );
  }
}

export default withRouter(CreateUser);