import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Image } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

class UpdateUser extends Component {
  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      isLoading: false,
      picture: '',
      description: this.props.user.description,
      error: '',
      formState: null,
      formUpdated: false
    };
  }

  /**
   * Events
   */
  handleClick = async () => {
    this.setState({ isLoading: true });

    if(!this.state.formUpdated) return; // no form update => do nothing

    let hash = '';
    if (this.state.picture !== '') {
      try{
        hash = await EmbarkJS.Storage.uploadFile([this.inputPicture]);
      }
      catch(err){
        return this.setState({ isLoading: false, formState: 'error', error: err.message });
      }
    }

    const gasEstimate = await DTwitter.methods.editAccount(this.props.user.username, this.state.description, hash).estimateGas();

    try{
      const result = await DTwitter.methods.editAccount(this.props.user.username, this.state.description, hash).send({gas: gasEstimate});
      if(result.status !== '0x1'){
        return this.setState({ isLoading: false, formState: 'error', error: 'Error executing transaction, transaction details: ' + JSON.stringify(result) });
      }

      this.setState({ isLoading: false, formState: 'success' });

      // tell parent we've got an updated user
      return this.props.onAction();
    }
    catch(err){
      this.setState({ isLoading: false, formState: 'error', error: err.message });
    }    

    return null;
  }

  handleChange(e) {
    let state = {formUpdated: true};
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;

    this.setState(state);
  }

  /**
   * React methods
   */
  render() {
    const { isLoading, error, formState, description, picture } = this.state;
    const { user } = this.props;
    const feedback = formState === 'success' ? 'Saved' : error;
    return (
      <form>
        <FieldGroup
          type="text"
          value={ user.username }
          disabled={true}
          name="username"
          label="Username"
        />
        <FieldGroup
          type="text"
          value={ description }
          placeholder="description"
          onChange={ (e) => this.handleChange(e) }
          name="description"
          label="Description"
          validationState={ formState }
        />
        <FieldGroup
          type="file"
          value={ picture }
          onChange={ (e) => this.handleChange(e) }
          name="picture"
          label="Profile picture"
          inputRef={ (input) => this.inputPicture = input }
          validationState={ formState }
        />
        { user.picture.length ? <Image src={ user.picture } width="100" circle /> : '' }
        <Button
          bsStyle="primary"
          disabled={ isLoading }
          onClick={ isLoading ? null : (e) => this.handleClick(e) }
        >
          { isLoading ? 'Loading...' : 'Update profile' }
        </Button>
        <FormGroup
          validationState={ formState }
        >
          <HelpBlock>{ feedback }</HelpBlock>
        </FormGroup>
      </form>
    );
  }
}

export default withRouter(UpdateUser);