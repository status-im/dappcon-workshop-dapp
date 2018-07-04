import { Link } from 'react-router-dom';
import {Grid, Row, Col, Thumbnail, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';
import imgAvatar from '../../img/avatar-default.png';

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
class UserTweets extends Component {
  
  constructor(props, context){
    super(props, context);
    this.state = {
      user: {},
      tweets: []
    };
  }

  componentDidMount(){
    EmbarkJS.onReady((err) => {
      this._getUserDetails();

      // subscribe to tweet events
      this._subscribeToNewTweetEvent();
    });
  }

  _getUserDetails = async() => {
      // get user details and update state
      let user = await DTwitter.methods.users(web3.utils.keccak256(this.props.match.params.username)).call();

      // update picture url for ipfs
      user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
      
      this.setState({user: user});
  }

  _subscribeToNewTweetEvent(){
    const username = this.props.match.params.username;


    DTwitter.events.NewTweet({_from: web3.utils.keccak256(username), fromBlock: 0})
      .on('data', (event) => {
        console.log('new tweet event fired: ' + JSON.stringify(event));
        let index = parseInt(event.returnValues.index);
        console.log('calling getTweet with index ' + index);
        DTwitter.methods.getTweet(username, index).call().then((tweet) => {
          console.log('get tweet at index ' + index + ': ' + JSON.stringify(tweet));
          let tweets = this.state.tweets;
          tweets.push(tweet);
          this.setState({tweets: tweets});
          return null;
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
  }

  render(){
    const {user} = this.state;

    if (user === {}) {
      // Render loading state ...
      return (<div>Loading...</div>);
    } else if (user.username === ''){
      return (<div><strong>{this.props.match.params.username}</strong> doesn't exist!</div>);  
    }else {
      // Render real UI ...
      const {username, description, picture} = user;
      const tweetList = this.state.tweets.map(function(tweet, index){
                          return <ListGroupItem key={index} header={username}>{tweet}</ListGroupItem>
                        });
      return (
        <Grid>
          <Row>
            <Col xs={12} md={4}>
              <Thumbnail src={picture} alt={username}>
                <h3>{username}</h3>
                <p>{description}</p>
              </Thumbnail>
              
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