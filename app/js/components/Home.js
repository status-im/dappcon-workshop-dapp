import React, { Component } from 'react';
import DTwitter from 'Embark/contracts/DTwitter';
import {Grid, Row, Col, FormGroup, FormControl, Button} from 'react-bootstrap';

class Home extends Component{
  
  constructor(props, context){
    super(props, context);

    // event bindings
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // initial state
    this.state = {
      username: '',
      usernameHasChanged: false
    };
  }

  handleClick(e) {
    if(this.getValidationState() === 'error'){
      return e.preventDefault();
    }
    this.props.history.push('/@' + this.state.username);
  }

  handleChange(e) {
    let state = {usernameHasChanged: true};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  /**
   * Helper methods
   */
  getValidationState() {
    return (this.state.username === '' && !this.state.usernameHasChanged) || this.state.username.length > 0 ? null : 'error';
  }
  render (){
    let validationState = this.getValidationState();
    let isValid = validationState !== 'error';

    return <div>
      <Grid>
        <Row>
          <Col xs={10}>
            <h1>Decentralised Twitter dApp</h1>
            <p>Built using Embark by Status</p>
            <FormGroup
              controlId="formBasicText"
              validationState={validationState}
            >
              <FormControl
                type="text"
                value={this.state.username}
                placeholder="@username"
                onChange={this.handleChange}
                name="username"
              />
              <Button
                bsStyle="primary"
                disabled={!isValid}            
                onClick={!isValid ? null : this.handleClick}

              >Get tweets</Button>
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    </div>
  }
}

export default Home