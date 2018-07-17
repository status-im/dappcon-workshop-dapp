import Header from './Header'
import Main from './Main'
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import imgAvatar from '../../img/avatar-default.png';

/**
 * Class representing the highest order component. Any user
 * updates in child components should trigger an event in this
 * class so that the current user details can be re-fetched from
 * the contract and propagated to all children that rely on it
 * 
 * @extends React.Component
 */
class App extends Component {

  //#region Constructor
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      account: '',
      error: {},
      accounts: [],
      balance: 0
    }
  }
  //#endregion

  //#region Helper methods
  /**
   * Loads user details from the contract based on the current
   * account (address).
   * 
   * First, the owners mapping is queried using the owner address key. It returns
   * the hash of the username it maps to. This username hash is then used to query
   * the users mapping in the contract to get the details of the user. Once the user
   * details are returned, the state is updated with the details, which triggers a
   * render in this component and all child components.
   * 
   * @returns {null}
   */
  _loadCurrentUser = async () => {
    const accounts = await web3.eth.getAccounts();
    try {
      // get the owner associated with the current defaultAccount
      const usernameHash = await DTwitter.methods.owners(web3.eth.defaultAccount).call();

      // get user details from contract
      const user = await DTwitter.methods.users(usernameHash).call();

      // update user picture with ipfs url
      user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;

      // get current user balance
      const balance = await web3.eth.getBalance(web3.eth.defaultAccount);

      // update state with user details
      return this.setState({ user: user, account: web3.eth.defaultAccount, accounts: accounts, balance: web3.utils.fromWei(balance, 'ether') });
    }
    catch (err) {
      this._onError(err, 'App._loadCurrentUser');
    }
  }

  /**
   * Sets the App state error and redirects the user to the error page
   * 
   * @param {Error} err - error encountered
   */
  _onError(err, source) {
    if(source) err.source = source;
    this.setState({ error: err });
    this.props.history.push('/whoopsie');
  }
  //#endregion

  //#region React lifecycle events
  componentDidMount() {
    EmbarkJS.onReady(() => {
      setTimeout(() => { this._loadCurrentUser(); }, 0);
    });
  }

  render() {
    return (
      <div>
        <Header
          user={this.state.user}
          account={this.state.account}
          accounts={this.state.accounts}
          balance={this.state.balance}
          error={this.state.error}
          onAfterUserUpdate={(e) => this._loadCurrentUser()} />
        <Main
          user={this.state.user}
          account={this.state.account}
          accounts={this.state.accounts}
          error={this.state.error}
          onAfterUserUpdate={(e) => this._loadCurrentUser()}
          onError={(err, source) => this._onError(err, source)} />
      </div>
    );
  }
  //#endregion
}

export default withRouter(App)