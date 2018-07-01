import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import UserTweets from './UserTweets'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import React from 'react';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/@:username' component={UserTweets}/>
      <Route path='/create' component={CreateUser}/>
      <Route path='/update/@:username' component={UpdateUser}/>
    </Switch>
  </main>
)

export default Main
