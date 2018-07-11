import { Link } from 'react-router-dom';
import {Grid, Row, Col, Thumbnail, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';
import React, { Component } from 'react';
import imgAvatar from '../../img/avatar-default.png';

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
class UserTweets extends Component {
  
  //#region Constructor
  constructor(props, context){
    super(props, context);
    this.state = {
      user: {},
      tweets: []
    };
    this.event = null;
  }
  //#endregion

  //#region Helper methods
  /**
   * Get the user details and subscribe to their tweet event
   */
  _init(){
    const { username } = this.props.match.params;
    this._getUserDetails(username);

    // subscribe to tweet events
    this._subscribeToNewTweetEvent(username);
  }

  /**
   * Fetches the user's details from the contract for display
   */
  _getUserDetails = async(username) => {
      // get user details and update state
      let user = await DTwitter.methods.users(web3.utils.keccak256(username)).call();

      // update picture url for ipfs
      user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
      // TODO: update to Date.js
      user.creationDate = this._formatDate(user.creationDate);
      
      this.setState({user: user});
  }

  /**
   * Subscribes to a tweet event from the contract.
   * When a tweet is received, it is appended to the list of
   * tweets.
   * 
   * @param {String} username 
   * @returns {null}
   */
  _subscribeToNewTweetEvent(username){
    this.event = DTwitter.events.NewTweet({
        filter: {_from: web3.utils.keccak256(username)}, 
        fromBlock: 0
      })
      .on('data', (event) => {
        console.log('new tweet event fired: ' + JSON.stringify(event));
        let tweets = this.state.tweets;
        tweets.push({
          content: event.returnValues.tweet,
          // TODO: update to Date.js
          time: this._formatDate(event.returnValues.time)
        });
        this.setState({tweets: tweets});
      })
      .on('changed', function (event){
        console.warn('event removed: ' + JSON.stringify(event));
      })
      .on('error', function(error){
        console.error('error occurred with tweet event: ', error);
      });
  }

  /**
   * Formats an int date into a displayable date
   * @param {Number} intDate - date in seconds
   * @returns {String} prettyfied date
   */
  _formatDate(intDate){
    const padZeros = 13 - intDate.length;
    if(padZeros > 0){
      intDate *= Math.pow(10, padZeros);
    }
    return new Date(intDate).toString();
  }
  //#endregion

  //#region React lifecycle events
  /**
   * Get the user details and subscribe to their tweet event
   */
  componentDidMount(){
    EmbarkJS.onReady((err) => {
      this._init();
    });
  }

  /**
   * If the username was changed (ie redirected from a new route),
   * we need to get the new user's details and subscribe to their tweet
   * event.
   */
  componentDidUpdate(prevProps){
    if(this.props.match.params.username !== prevProps.match.params.username){
      this._init();
    }
  }

  /**
   * Unsubscribe from our tweet event so we stop
   * receiving tweets.
   */
  componentWillUnmount(){
    if(!this.event) return;
    // TODO: check if this is the 'right' way to remove / stop the event listener
    this.event.removeListener(this.event);
  }

  render(){
    const {user} = this.state;

    if (user === {}) {
      // Render loading state ...
      return (<Grid><Row><Col xs={12}>Loading...</Col></Row></Grid>);
    } else if (user.username === ''){
      return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageHeader>{ this.props.match.params.username } <small>doesn't exist!</small></PageHeader>
          </Col>
        </Row>
      </Grid>);  
    }else {
      // Render real UI ...
      const {username, description, picture, creationDate} = user;
      const tweetList = this.state.tweets.map(function(tweet, index){
                          return <ListGroupItem className='tweet' key={ index } header={ tweet.time }>{ tweet.content }</ListGroupItem>
                        });
      return (
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>{ username }'s <small>tweets</small></PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Thumbnail src={picture} alt={username}>
                <h3>{ username }</h3>
                <p>{ description }</p>
                <p>Member since: { creationDate }</p>
              </Thumbnail>
              
            </Col>
            <Col xs={8}>
              <ListGroup className='tweets'>
                { tweetList }
              </ListGroup>
            </Col>
          </Row>
        </Grid>
      )
    }
  }
  //#endregion
}
export default UserTweets
