import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, PageHeader } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

class CreateUser extends Component {
  constructor(props, context) {
    super(props, context);

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
  handleClick = async () => {

    this.setState({ isLoading: true });
    const { username, description } = this.state;
    const gasEstimate = await DTwitter.methods.createAccount(username, description).estimateGas();

    try {
      const result = await DTwitter.methods.createAccount(username, description).send({ gas: gasEstimate + 1000 });

      if (result.status !== '0x1') {
        return this.setState({ isLoading: false, formState: 'error', error: 'Error executing transaction, transaction details: ' + JSON.stringify(result) });
      }

      // Completed of async action, set loading state back
      this.setState({ isLoading: false });

      // tell our parent to re-render with new user
      this.props.onAfterUserUpdate();

      this.props.history.push('/@' + username);
    } catch (err) {
      this.setState({ isLoading: false, error: err.message });
    };
  }

  handleChange(e) {
    let state = {};
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;

    if (input === 'username') {

      state.usernameHasChanged = true;

      if (value.length >= 5) {
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
    if (length === 0 && !this.state.usernameHasChanged) return null;
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

    if (!this.state.usernameHasChanged) feedback = '';

    return (
      <Grid>
        <Row>
          <Col xs={12}>
          <PageHeader>Create a user <small>for { this.props.account }</small></PageHeader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <form>
              <FieldGroup
                type="text"
                value={this.state.username}
                disabled={isLoading}
                placeholder="germany2018champs"
                onChange={(e) => this.handleChange(e)}
                name="username"
                autoComplete="off"
                label="Desired username"
                validationState={validationState}
                hasFeedback={true}
                help={feedback}
                inputAddOn={
                  {
                    location: 'before',
                    addOn: '@'
                  }
                }
              />
              <FieldGroup
                type="text"
                value={this.state.description}
                placeholder="Germany for the 2018 World Cup winnnnnn!! 😞"
                onChange={(e) => this.handleChange(e)}
                name="description"
                label="Description"
              />
              <Button
                bsStyle="primary"
                disabled={isLoading || (!isValid && !this.state.error)}
                onClick={(isLoading || (!isValid && !this.state.error) || !this.state.usernameHasChanged) ? null : (e) => this.handleClick(e)}
              >
                {isLoading ? 'Loading...' : 'Create user'}
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(CreateUser);