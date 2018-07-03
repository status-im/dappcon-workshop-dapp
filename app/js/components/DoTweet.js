import { Link } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import React, { Component } from 'react';
import DTwitter from 'Embark/contracts/DTwitter';

// The Header creates links that can be used to navigate
// between routes.
class DoTweet extends Component{
  constructor(props, context) {
    super(props, context);

    // properties pass-through
  const { username, visible } = props;
  console.log('Do Tweet: username = '+ username + ', visible = ' + visible);

    // event bindings
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // initial state
    this.state = {
      visible: visible,
      username: username,
      tweet: '',
      tweetHasChanged: false
    };
  }

  componentDidMount(){
    
  }

  /**
   * Events
   */
  handleClick(e) {
    if(this.getValidationState() === 'error'){
      return e.preventDefault();
    }
    
    // send tweet to the contract
    DTwitter.methods.tweet(this.props.username, this.state.tweet).send({gas: 800000});
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
    // hide when not visible
    if(!this.props.visible) return null; 

    let validationState = this.getValidationState();
    let isValid = validationState !== 'error';


    return (
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={validationState}
        >
          <FormControl
            type="text"
            value={this.state.tweet}
            placeholder="140 characters or less..."
            onChange={this.handleChange}
            name="tweet"
            componentClass="textarea"
            maxLength="140"
          />
          <Button
            bsStyle="primary"
            disabled={!isValid}            
            onClick={!isValid ? null : this.handleClick}
          >Post tweet</Button>
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
export default DoTweet