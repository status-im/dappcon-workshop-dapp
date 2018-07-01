import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React from 'react';

class CreateUser extends React.Component {
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
      userExists: false,
      usernameHasChanged: false
    };
  }

  /**
   * Events
   */
  handleClick() {
    this.setState({ isLoading: true });
    EmbarkJS.onReady(() => {
      console.log('creating account with username = ' + this.state.username + ', and description = ' + this.state.description);
      DTwitter.methods.createAccount(this.state.username, this.state.description).send({ gas: 800000 }).then(() => {
        console.log('account created event fired: ' + JSON.stringify(event));
        // Completed of async action, set loading state back
        this.setState({ isLoading: false });
        this.props.history.push('/@' + this.state.username);
      }).catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, error: err.message });
      });
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
          state.userExists = exists;
          this.setState(state);

        }).catch((err) => {
          console.error(err);
          state.isLoading = false;
          state.userExists = exists;
          state.error = err.message;
          this.setState(state);
        });
        console.log('sent async username check, setting isLoading is true');
        // set loading state while checking the contract
        return this.setState({ isLoading: true });
      }

      // we are loading already, do nothing while we wait
      return;
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

    return this.state.userExists ? 'error' : 'success';
  }

  /**
   * React methods
   */
  render() {
    const { isLoading } = this.state;
    let validationState = this.getValidationState();
    let isValid = validationState !== 'error';

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
          <HelpBlock>{this.state.error || 'Usernames must be 5 or more characters.'}</HelpBlock>
        </FormGroup>
      </form>
    );
  }
}

export default withRouter(CreateUser);