import { NavLink, withRouter } from 'react-router-dom'
import { Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import DoTweet from './DoTweet';
import Search from './Search';
import { limitLength, limitAddressLength } from '../utils';
import Spinner from 'react-spinkit';
import FieldGroup from './FieldGroup';
import { map } from 'async';
import imgAvatar from '../../img/avatar-default.png';

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
      showTooltip: false,
      userAccounts: []
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

  _handleAcctChange(e) {
    web3.eth.defaultAccount = e.target.attributes.value.value;
    this.props.onAfterUserUpdate();
    if(e.target.attributes.username.value){
      this.props.history.push('/update/@' + e.target.attributes.username.value);
    }
    else{
      this.props.history.push('/create');
    }
  }

  _initUserAccounts = async () => {
    console.log('halo! accounts = ' + this.props.accounts);
    await map(this.props.accounts, async function (address, next) {
      console.log('iterating accounts')
      const balance = await web3.eth.getBalance(address);
      console.log(address + ' with balance ' + balance);
      const usernameHash = await DTwitter.methods.owners(address).call();

      // get user details from contract
      const user = await DTwitter.methods.users(usernameHash).call();
      // update user picture with ipfs url
      user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;

      next(null, {
        address: address,
        user: user,
        balance: web3.utils.fromWei(balance, 'ether')
      });
    }, (err, userAccounts) => {
      this.setState({ userAccounts: userAccounts })
    });
  }

  _formatBalance(balance){
    return 'Ξ' + limitLength(
      parseFloat(
        balance
      ).toFixed(4), 6, '', true
    );
  }
  //#endregion

  //#region React lifecycle events

  componentDidMount() {
    EmbarkJS.onReady((err) => {
      this._initUserAccounts();
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.accounts !== prevProps.accounts) {
      this._initUserAccounts();
    }
  }
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
    const currBalance = this._formatBalance(this.props.balance);
    let navClasses = [];
    if(isError) navClasses.push('error');
    if(!isEditable) navClasses.push('logged-out');
    let states = {};

    // state when we are waiting for the App component to finish loading
    // the current account (address) from web3.eth.getAccounts()
    states.isLoading = <Spinner name="pacman" color="white" fadeIn='none' />;

    states.isError = <span className='error'>ERROR!</span>;

    // state when our account has loaded, and it was determined that that
    // account (address) has not been mapped to an owner/user in the contract
    // (This happens in the App component)
    states.isNotEditable = (account) => <React.Fragment>
      <Navbar.Text pullRight>
          <NavLink exact to='/create'><span
          onMouseEnter={(e) => this._handleToggle(e)}
          onMouseLeave={(e) => this._handleToggle(e)}
          className='address'
          ref={(span) => this.tooltipTarget = span}
        >Create user
        </span></NavLink>
      </Navbar.Text>
      <Overlay {...tooltipProps} placement="bottom">
        <Tooltip id="overload-bottom">Create a user for { account }</Tooltip>
      </Overlay>
    </React.Fragment>;

    // state when our account has loaded, and it was determined that the
    // account (address) has been mapped to an owner/user in the contract
    // (This happens in the App component)
    states.isEditable = (user) => <React.Fragment>
      <NavLink exact to={ '/update/@' + user.username } className='profile-link'>
        <Image
          src={ user.picture }
          alt={ user.username }
          width={ 60 }
          circle
          className='profile'
        ></Image>
        <span className='username'>{ user.username }</span>
      </NavLink>
    </React.Fragment>;

    states.tweet = <React.Fragment>
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

    const accts = this.state.userAccounts.map( (userAccount, index) => {
      return <option
        key={index}
        value={userAccount.address}>
        {`${userAccount.user && userAccount.user.username ? userAccount.user.username + ' - ' : ''}${limitAddressLength(userAccount.address, 4)} (${this._formatBalance(userAccount.balance)})`}
      </option>
    });

    const accts2 = this.state.userAccounts.map( (userAccount, index) => {
      const isCurrUser = userAccount.address === this.props.account;
      const hasUser = Boolean(userAccount.user.username);
      return <MenuItem
        key={ index }
        eventKey={ index }
        active={ isCurrUser }
        value={ userAccount.address }
        username={ userAccount.user.username }
        onSelect={ (key, e) => this._handleAcctChange(e, key) }
      >
      { hasUser ? 
        //states.isEditable(userAccount.user)
        <React.Fragment><Image
          src={ userAccount.user.picture }
          alt={ userAccount.user.username }
          width={ 30 }
          circle
          className='profile'
        ></Image>
        <span className='username'>{ userAccount.user.username }</span></React.Fragment>
        : 
        limitAddressLength(userAccount.address, 4)
        }
        <React.Fragment> ({this._formatBalance(userAccount.balance)})</React.Fragment>
      </MenuItem>
    });
    console.log('isEditable = ' + isEditable + ', using class ' + (isEditable ? '' : 'logged-out'));

    return (
      <Navbar collapseOnSelect className={navClasses.join(' ')}>
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
            <ButtonToolbar>
              <Dropdown id="dropdown-accounts">
                <Dropdown.Toggle>
                  {isEditable ?
                    states.isEditable(this.props.user)
                    :
                    <React.Fragment>
                      {limitAddressLength(this.props.account, 4)} ({this._formatBalance(this.props.balance)})</React.Fragment>
                    }
                </Dropdown.Toggle>
                <Dropdown.Menu className="accounts-list">
                  {accts2}
                </Dropdown.Menu>
              </Dropdown>
            </ButtonToolbar>
            {isLoading ?
              states.isLoading
              :
              isError ?
                states.isError
                :
                isEditable ?
                  states.tweet
                  :
                  states.isNotEditable(this.props.account)
            }
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  //#endregion
}
export default withRouter(Header)