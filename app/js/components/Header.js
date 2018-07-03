import { withRouter } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import React, { Component } from 'react';
import EmbarkJS from 'Embark/EmbarkJS';

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component{
  constructor(props, context) {
    super(props, context);

    // event bindings
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      user: {}
    }
  }

  componentDidMount(){
    let self = this;
    // setTimeout(
    // EmbarkJS.onReady(function(){
    //   DTwitter.methods.users("0xc1671a7151e1edce1c1199a5d6db723cf1b0815d5f42c3e782581dde347530d6").call().then((user) => {
    //     user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
    //     self.setState({user: user});
    //   }).catch(console.error);
    // }), 10000);
  }

  /**
   * Events
   */
  handleClick(e){
    this.props.history.push('/create');
  }

  render(){
    const {picture, username, description} = this.state.user;
    const isEditable = Boolean(username);
    let rendering = <Button onClick={this.handleClick} bsStyle="primary">Create user</Button>
    if(isEditable){
      rendering = <Thumbnail src={picture} alt={username} href={isEditable ? '/update/@' + username : ''}>
        <h3>{username}</h3>
        <p>{description}</p>
      </Thumbnail>;
    }
    return (
      <header>
        <Grid>
          <Row>
            <Col xs={10}>
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