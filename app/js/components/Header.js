import { NavLink } from 'react-router-dom'
import { Button, Image, Modal, Navbar, Nav, NavItem, FormGroup, FormControl, Overlay, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import DoTweet from './DoTweet';
import Search from './Search';
import { limitLength } from '../utils';

/**
 * Class representing the header of the page that handles
 * commone functions such as navigation, searching of users,
 * link to create account, and modal to tweet
 * 
 * @extends React.Component
 */
class Header extends Component {

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      showTooltip: false
    };
  }
  //#endregion

  //#region Component events
  /**
   * Hides the tweet modal
   */
  _handleClose() {
    this.setState({ showModal: false });
  }

  /**
   * Shows the tweet modal
   */
  _handleShow() {
    this.setState({ showModal: true });
  }

  /**
   * Toggles the current account address tooltip
   */
  _handleToggle() {
    this.setState({ showTooltip: !this.state.showTooltip });
  }
  //#endregion

  //#region React lifecycle events
  render() {
    const { picture, username, description } = this.props.user;
    const isEditable = Boolean(username);
    const tooltipProps = {
      container: this,
      target: this.tooltipTarget,
      show: this.state.showTooltip
    };

    return (
      <Navbar collapseOnSelect className={this.props.user.username ? '' : 'logged-out'}>
        <Navbar.Header>
          <Navbar.Brand>
            <NavLink exact to="/">dTwitter <small>embark by Status</small></NavLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <div className='navbar-right'>
            <Navbar.Form>
              <Search />
            </Navbar.Form>

            {!isEditable ?
              <React.Fragment>
                <Navbar.Text pullRight>
                  <span
                    onMouseEnter={(e) => this._handleToggle(e)}
                    onMouseLeave={(e) => this._handleToggle(e)}
                    className='address'
                    ref={(span) => this.tooltipTarget = span}
                    >{limitLength(this.props.account, 7)}
                  </span> doesn't have a user.&nbsp;
                  <NavLink exact to='/create'>Create one</NavLink>
                </Navbar.Text>
                <Overlay {...tooltipProps} placement="bottom">
                  <Tooltip id="overload-bottom">{this.props.account}</Tooltip>
                </Overlay>
              </React.Fragment>
              :
              <React.Fragment>
                <NavLink exact to={'/update/@' + username} className='profile-link'>
                  <Image
                    src={picture}
                    alt={username}
                    width={60}
                    circle
                    className='profile'
                  ></Image>
                  <span className='username'>{username}</span>
                </NavLink>

                <Button bsStyle="primary" onClick={(e) => this._handleShow(e)}>
                  Tweet
                </Button>

                <Modal show={ this.state.showModal } onHide={(e) => this._handleClose(e)}>
                  <Modal.Header closeButton>
                    <Modal.Title>New tweet</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <DoTweet username={username} onAfterTweet={(e) => this._handleClose()}></DoTweet>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={(e) => this._handleClose(e)}>Close</Button>
                  </Modal.Footer>
                </Modal>
              </React.Fragment>
            }
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  //#endregion
}
export default Header