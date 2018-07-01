import { Link } from 'react-router-dom';
import {Grid, Row, Col, Thumbnail, ListGroup, ListGroupItem } from 'react-bootstrap';
import React from 'react';
import imgAvatar from '../../img/avatar-default.png';
import DoTweet from './DoTweet';

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
class UserTweets extends React.Component {
  
  constructor(props, context){
    super(props, context);
    this.state = {
      user: {},
      account: '',
      tweets: []
    };
  }

  componentDidMount(){
    const self = this;
    EmbarkJS.onReady(() => {
      // get user details and update state
      DTwitter.methods.users(web3.utils.keccak256(this.props.match.params.username)).call().then((user) => {
        user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
        console.log('user: ' + JSON.stringify(user));
        this.setState({user: user});
      }).catch(console.error);

      // so we can check our current node accounts to see if we are the owner of this account
      web3.eth.getAccounts().then((accounts) => {
        console.log('got accounts: ' + accounts);
        if(accounts.length){
          this.setState({account: accounts[0]});
        }
      }).catch(console.error);

      // subscribe to tweet events
      DTwitter.events.NewTweet({_from: web3.utils.keccak256(this.props.match.params.username), fromBlock: 0})
      .on('data', function (event){
        console.log('new tweet event fired: ' + JSON.stringify(event));
        let index = parseInt(event.returnValues.index);
        console.log('calling getTweet with index ' + index);
        DTwitter.methods.getTweet(self.props.match.params.username, index).call().then(function(tweet) {
          console.log('get tweet at index ' + index + ': ' + JSON.stringify(tweet));
          let tweets = self.state.tweets;
          tweets.push(tweet);
          self.setState({tweets: tweets});

        }).catch(function(error){
          console.error('error getting tweet at index ' + index, error);
        });
      })
      .on('changed', function (event){
        console.warn('event removed: ' + JSON.stringify(event));
      })
      .on('error', function(error){
        console.error('error occurred with tweet event: ', error);
      });
    });
  }

  render(){
    const {user} = this.state;
    const isEditable = this.state.account != '' && this.state.account === user.owner;

    if (user === {}) {
      // Render loading state ...
      return (<div>Loading...</div>);
    } else if (user.username === ''){
      return (<div>User doesn't exist!</div>);  
    }else {
      // Render real UI ...
      const {username, description, picture} = this.state.user;
      const tweetList = this.state.tweets.map(function(tweet, index){
                          return <ListGroupItem key={index} header={username}>{tweet}</ListGroupItem>
                        });
      return (
        <Grid>
          <Row>
            <Col xs={12} md={4}>
              <Thumbnail src={picture} alt={username} href={isEditable ? '/update/@' + username : ''}>
                <h3>{username}</h3>
                <p>{description}</p>
              </Thumbnail>
              <DoTweet username={username} visible={isEditable}></DoTweet>
            </Col>
            <Col xs={12} md={8}>
              <ListGroup>
                {tweetList}
              </ListGroup>
            </Col>
          </Row>
        </Grid>
      )
    }
  }
  
}
export default UserTweets