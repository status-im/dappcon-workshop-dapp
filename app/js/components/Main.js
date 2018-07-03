import { Switch, Route } from 'react-router-dom';
import PropsRoute from './PropsRoute';
import Home from './Home';
import UserTweets from './UserTweets';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import React, { Component } from 'react';

class Main extends Component {

  constructor(props){
    super(props);
  }

  render () {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home}/>
          <PropsRoute path='/@:username' component={UserTweets} user={this.props.user} {...this.props}/>
          <PropsRoute path='/create' component={CreateUser} onAction={this.props.onAction} {...this.props}/>
          <PropsRoute path='/update/@:username' component={UpdateUser} onAction={this.props.onAction} user={this.props.user} {...this.props}/>
        </Switch>
      </main>
    )
  }
}

export default Main
