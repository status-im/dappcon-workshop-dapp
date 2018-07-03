import Header from './Header'
import Main from './Main'
import React, { Component } from 'react';
import imgAvatar from '../../img/avatar-default.png';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      user: {}
    }
  }

  componentDidMount(){
    EmbarkJS.onReady(() => {
      setTimeout(() => { this._loadCurrentUser(); }, 0);
    });
  }

  _loadCurrentUser = () => {
    let self = this;
    DTwitter.methods.owners(web3.eth.defaultAccount).call().then((usernameHash) => {
      if(usernameHash){
        DTwitter.methods.users(usernameHash).call().then((user) => {
          user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
          console.log('got user details from contract: ' + JSON.stringify(user));
          self.setState({user: user});
        }).catch(console.error);
      }
      return null;
    });
  }

  render(){
    return (
      <div>
        <Header user={this.state.user} />
        <Main user={this.state.user} onAction={(e) => this._loadCurrentUser()} />
      </div>
    );
  }
}

export default App