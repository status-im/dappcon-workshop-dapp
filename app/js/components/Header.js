import { NavLink } from 'react-router-dom'
import { Button, Image, Modal, Navbar, Nav, NavItem, FormGroup, FormControl, Overlay, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import DoTweet from './DoTweet';
import Search from './Search';
import { limitAddressLength } from '../utils';
import Spinner from 'react-spinkit';

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
    const isError = this.props.error && this.props.error.message;
    const isLoading = !Boolean(this.props.account) && !isError;
    const tooltipProps = {
      container: this,
      target: this.tooltipTarget,
      show: this.state.showTooltip
    };
    let states = {};

    // state when we are waiting for the App component to finish loading
    // the current account (address) from web3.eth.getAccounts()
    states.isLoading = <Spinner name="pacman" color="white" fadeIn='none'/>;

    states.isError = <span className='error'>ERROR!</span>;

    // state when our account has loaded, and it was determined that that
    // account (address) has not been mapped to an owner/user in the contract
    // (This happens in the App component)
    states.isNotEditable = <React.Fragment>
      <Navbar.Text pullRight>
        <span
          onMouseEnter={(e) => this._handleToggle(e)}
          onMouseLeave={(e) => this._handleToggle(e)}
          className='address'
          ref={(span) => this.tooltipTarget = span}
        >{limitAddressLength(this.props.account, 4)}
        </span> doesn't have a user.&nbsp;
          <NavLink exact to='/create'>Create one</NavLink>
      </Navbar.Text>
      <Overlay {...tooltipProps} placement="bottom">
        <Tooltip id="overload-bottom">{this.props.account}</Tooltip>
      </Overlay>
    </React.Fragment>;

    // state when our account has loaded, and it was determined that the
    // account (address) has been mapped to an owner/user in the contract
    // (This happens in the App component)
    states.isEditable = <React.Fragment>
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

      <Modal show={this.state.showModal} onHide={(e) => this._handleClose(e)}>
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
    </React.Fragment>;

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

            { isLoading ?
              states.isLoading
              :
              isError ? 
                states.isError
                :
                isEditable ?
                  states.isEditable
                  :
                  states.isNotEditable
            }
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  //#endregion
}
export default Header