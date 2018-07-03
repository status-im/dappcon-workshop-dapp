import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Image } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

class UpdateUser extends Component {
  constructor(props, context) {
    super(props, context);

    // event bindings
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // initial state
    this.state = {
      isLoading: false,
      picture: '',
      description: this.props.user.description,
      usernameHasChanged: false,
      error: '',
      formState: null
    };
  }

  /**
   * Events
   */
  handleClick() {
    if (this.state.picture !== '') {
      this.setState({ isLoading: true });

      EmbarkJS.Storage.uploadFile([this.inputPicture]).then((hash) => {

        DTwitter.methods.editAccount(this.props.user.username, this.state.description, hash).send().then(() => {
          this.setState({ isLoading: false, formState: 'success' });
          // tell parent we've got an updated user
          return this.props.onAction();
        }).catch((err) => {
          console.error(err);
          this.setState({ isLoading: false, error: err.message });
        });

        return null;

      }).catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, error: err.message });
      });
    }

    return null;
  }

  handleChange(e) {
    let state = {};
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;

    this.setState(state);
  }

  FieldGroup = ({ id, label, help, ...props }) => {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }

  /**
   * React methods
   */
  render() {
    const { isLoading } = this.state;
    const feedback = this.state.formState === 'success' ? 'Saved' : '';
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={this.state.formState}
        >
          <FieldGroup
            type="text"
            value={this.props.user.username}
            disabled={true}
            name="username"
            label="Username"
          />
          <FieldGroup
            type="text"
            value={this.state.description}
            placeholder="description"
            onChange={this.handleChange}
            name="description"
            label="Description"
          />
          <FieldGroup
            type="file"
            value={this.state.picture}
            onChange={this.handleChange}
            name="picture"
            label="Profile picture"
            inputRef={(input) => this.inputPicture = input}
          />
          {this.props.user.picture.length ? <Image src={this.props.user.picture} width="100" circle /> : ''}
          <Button
            bsStyle="primary"
            disabled={isLoading}
            onClick={isLoading ? null : this.handleClick}
          >
            {isLoading ? 'Loading...' : 'Update profile'}
          </Button>
          <FormControl.Feedback />
          <HelpBlock>{feedback}</HelpBlock>
        </FormGroup>
      </form>
    );
  }
}

export default withRouter(UpdateUser);