import { withRouter, NavLink } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, Image, Media, Modal, Glyphicon } from 'react-bootstrap';
import React, { Component } from 'react';
import DoTweet from './DoTweet';

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component{
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render(){
    const {picture, username, description} = this.props.user;
    const isEditable = Boolean(username);
    
    return (
      <header>
        <Grid>
          <Row>
            <Col xs={8}>
              { isEditable ? 
                <React.Fragment>
                  <Button bsStyle="primary" bsSize="large" onClick={ (e) => this.handleShow(e) }>
                    <Glyphicon glyph="pencil" />
                  </Button>

                  <Modal show={ this.state.show } onHide={ (e) => this.handleClose(e) }>
                    <Modal.Header closeButton>
                      <Modal.Title>New tweet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <DoTweet username={username} visible={isEditable} onAfterTweet={ (e) => this.handleClose() }></DoTweet>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={ (e) => this.handleClose(e) }>Close</Button>
                    </Modal.Footer>
                  </Modal> 
                </React.Fragment>
                : '' 
              }
              <NavLink exact to="/">Home</NavLink>
            </Col>
            <Col xs={4}>
              { !isEditable ? 
                <Button onClick={(e) => {this.props.history.push('/create')}} bsStyle="primary">Create user</Button> 
                :
                <NavLink exact to={'/update/@' + username}>
                  <Media>
                    <Media.Body>
                      <Media.Heading>{ username }</Media.Heading>
                    </Media.Body>
                    <Media.Right>
                    <Image 
                      src={picture} 
                      alt={username} 
                      width={150} 
                      circle
                    ></Image>
                    </Media.Right>
                  </Media>
                </NavLink>
              }
            </Col>
          </Row>
        </Grid>
      </header>
    );
  }
}
export default withRouter(Header)