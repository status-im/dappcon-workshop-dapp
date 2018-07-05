import Header from './Header'
import Main from './Main'
import React, { Component } from 'react';
import imgAvatar from '../../img/avatar-default.png';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    EmbarkJS.onReady(() => {
      setTimeout(() => { this._loadCurrentUser(); }, 0);
    });
  }

  _loadCurrentUser = async () => {
    const accounts = await web3.eth.getAccounts();
    try {
      const usernameHash = await DTwitter.methods.owners(accounts[0]).call();
      if (usernameHash) {
        // get user details from contract
        const user = await DTwitter.methods.users(usernameHash).call();

        // update user picture with ipfs url
        user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;

        // update state with user details
        return this.setState({ user: user, account: accounts[0] });
      }
    }
    catch (err) {
      console.error('Error loading currenet user: ', err);
    }
  }

  render() {
    return (
      <div>
        <Header user={ this.state.user } account={ this.state.account } />
        <Main user={ this.state.user } account={ this.state.account } onAfterUserUpdate={ (e) => this._loadCurrentUser() } />
      </div>
    );
  }
}

export default App