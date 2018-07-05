import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, InputGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';

class Search extends Component {

  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      username: '',
      usernameHasChanged: false
    };
  }

  /**
   * Events
   */
  handleClick(e) {
    if (this.getValidationState() === 'error' || !this.state.usernameHasChanged) {
      return e.preventDefault();
    }
    this.props.history.push('/@' + this.state.username);
  }

  handleChange(e) {
    let state = { usernameHasChanged: true };
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  /**
   * Helper methods
   */
  getValidationState() {
    return (this.state.username === '' && !this.state.usernameHasChanged) || this.state.username.length > 0 ? null : 'error';
  }

  render() {
    let validationState = this.getValidationState();
    let isValid = validationState !== 'error';

    return (
      <FormGroup validationState={validationState}>
        <InputGroup>
          <FormControl 
            type="text"
            value={this.state.username}
            placeholder="username"
            onChange={(e) => this.handleChange(e)}
            name="username" />
          <InputGroup.Button>
          <Button
            bsStyle="primary"
            disabled={ !isValid }
            onClick={ !isValid ? null : (e) => this.handleClick(e) }><Glyphicon glyph="search" /></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }

}

export default withRouter(Search);