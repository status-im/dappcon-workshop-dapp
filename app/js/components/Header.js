import { Link, withRouter } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import React from 'react';

// The Header creates links that can be used to navigate
// between routes.
class Header extends React.Component{
  constructor(props, context) {
    super(props, context);

    // event bindings
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // initial state
    this.state = {
      username: '',
      usernameHasChanged: false
    };
  }

  componentDidMount(){
    //this.setState({username: this.props.match.username});
  }

  /**
   * Events
   */
  handleClick(e) {
    console.log('handling click, validations state = ' + this.getValidationState());
    if(this.getValidationState() === 'error'){
      return e.preventDefault();
    }
    this.props.history.push('/@' + this.state.username);
  }

  handleChange(e) {
    let state = {usernameHasChanged: true};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  /**
   * Helper methods
   */
  getValidationState() {
    return (this.state.username === '' && !this.state.usernameHasChanged) || this.state.username.length > 0 ? null : 'error';
  }

  render(){

    let validationState = this.getValidationState();
    let isValid = validationState !== 'error';

    return (
      <form>
        <Link to='/create'>Create user</Link>
        <FormGroup
          controlId="formBasicText"
          validationState={validationState}
        >
          <FormControl
            type="text"
            value={this.state.username}
            placeholder="@username"
            onChange={this.handleChange}
            name="username"
          />
          <Button
            bsStyle="primary"
            disabled={!isValid}            
            onClick={!isValid ? null : this.handleClick}

          >Get tweets</Button>
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
// const Header = () => (
//   <header>
//     <nav>
//       <ul>
//         <li><Link to='/'>Home</Link></li>
//         <li><Link to='/create'>Create user</Link></li>
//       </ul>
//       <input type="text" placeholder="@username"/><button id="btnGetUserTweets">Get Tweets</button>
//     </nav>
//   </header>
// )
}
export default withRouter(Header)