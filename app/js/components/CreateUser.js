import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import DTwitter from 'Embark/contracts/DTwitter';

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
    console.log('creating account with username = ' + this.state.username + ', and description = ' + this.state.description);
    return DTwitter.methods.createAccount(this.state.username, this.state.description).send({gas: 200000}).then(() => {
      console.log('account created event fired: ' + JSON.stringify(event));
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
      this.props.history.push('/@' + this.state.username);
    }).catch((err) => {
      console.error(err);
      this.setState({ isLoading: false, error: err.message });
    });
  }

  handleChange(e) {
    let state = {usernameHasChanged: true};
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;
    console.log('this.state = ' + JSON.stringify(this.state));
    if (input === 'username' && value.length >= 5) {
      // not loading, check username doesn't exist
      if (!this.state.isLoading) {
        console.log('checking if username exists: ' + value);
        DTwitter.methods.userExists(value).call().then((exists) => {
          console.log(`response username '${value}' exists: ${exists}`);
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
        <FormGroup
          controlId="formBasicText"
          validationState={validationState}
        >
          <ControlLabel>Enter desired username</ControlLabel>
          <FormControl
            type="text"
            value={this.state.username}
            disabled={isLoading}
            placeholder="@username"
            onChange={this.handleChange}
            name="username"
            autoComplete="off"
          />
          <FormControl
            type="text"
            value={this.state.description}
            placeholder="description"
            onChange={this.handleChange}
            name="description"
          />
          <Button
            bsStyle="primary"
            disabled={isLoading || !isValid}
            onClick={(isLoading || !isValid) ? null : this.handleClick}
          >
            {isLoading ? 'Loading...' : 'Create user'}
          </Button>
          <FormControl.Feedback />
          <HelpBlock>{feedback}</HelpBlock>
        </FormGroup>
      </form>
    );
  }
}

export default withRouter(CreateUser);