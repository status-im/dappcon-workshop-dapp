import { withRouter } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import React, { Component } from 'react';
import DoTweet from './DoTweet';

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component{
  constructor(props, context) {
    super(props, context);
  }

  render(){
    const {picture, username, description} = this.props.user;
    const isEditable = Boolean(username);
    let rendering = <Button onClick={(e) => {this.props.history.push('/create')}} bsStyle="primary">Create user</Button>
    if(isEditable){
      rendering = <Thumbnail src={picture} alt={username} onClick={isEditable ? (e) => {this.props.history.push('/update/@' + username)} : false}>
        <h3>{username}</h3>
        <p>{description}</p>
      </Thumbnail>;
    }
    return (
      <header>
        <Grid>
          <Row>
            <Col xs={10}>
              <DoTweet username={username} visible={isEditable}></DoTweet>
            </Col>
            <Col xs={2}>
              {rendering}
            </Col>
          </Row>
        </Grid>
      </header>
    );
  }
}
export default withRouter(Header)