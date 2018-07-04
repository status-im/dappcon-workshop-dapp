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
          <PropsRoute path='/@:username' component={UserTweets} {...this.props}/>
          <PropsRoute path='/create' component={CreateUser} {...this.props}/>
          <PropsRoute path='/update/@:username' component={UpdateUser} {...this.props}/>
        </Switch>
      </main>
    )
  }
}

export default Main
