import { Link } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

// The Header creates links that can be used to navigate
// between routes.
class DoTweet extends Component{
  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      tweet: '',
      tweetHasChanged: false,
      isLoading: false,
      error: ''
    };
  }

  componentDidMount(){
    
  }

  /**
   * Events
   */
  handleClick = async (e) => {
    if(this.getValidationState() === 'error'){
      return e.preventDefault();
    }
    
    this.setState({ isLoading: true });

    // send tweet to the contract
    const { tweet } = DTwitter.methods;
    try{
      const gasEstimate = await tweet(this.props.username, this.state.tweet).estimateGas();

      await tweet(this.props.username, this.state.tweet).send({gas: gasEstimate});

      this.setState({ isLoading: false });

      this.props.onAfterTweet();
    }
    catch(err){
      this.setState({ isLoading: false, error: err.message });
    }
  }

  handleChange(e) {
    let state = {tweetHasChanged: true};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  /**
   * Helper methods
   */
  getValidationState() {
    return ((this.state.tweet === '' && !this.state.tweetHasChanged) || (this.state.tweet.length > 0 && this.state.tweet.length <= 140)) ? null : 'error';
  }

  render(){

    const validationState = this.getValidationState();
    const isValid = validationState !== 'error';
    const { isLoading, error, tweet } = this.state;

    let feedback = !isValid ? 'Tweet must be 140 characters or less' : '';
    if(this.state.error) feedback = error;

    return (
      <form>
        <FieldGroup
          type="text"
          value={ tweet }
          placeholder="140 characters or less..."
          onChange={ (e) => this.handleChange(e) }
          name="tweet"
          componentClass="textarea"
          hasFeedback={true}
          validationState={validationState}
        />
        <Button
          bsStyle="primary"
          disabled={ !isValid && !error }            
          onClick={ (!isValid && !error) ? null : (e) => this.handleClick(e) }
        >{isLoading ? 'Loading...' : 'Post tweet'}</Button>
        <FormGroup
          controlId="formBasicText"
          validationState={ validationState }
        >
          <HelpBlock>{ feedback }</HelpBlock>
        </FormGroup>
      </form>
    );
  }
}
export default DoTweet