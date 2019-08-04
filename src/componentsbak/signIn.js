import React, { Component } from 'react';
import '../css/signIn.css';
import firebase from 'firebase';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BounceLoader from 'react-spinners/BounceLoader';
import FormHelperText from '@material-ui/core/FormHelperText';
import Drawer from './drawer.js';


class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {password: 'false',
                  username: 'false',
                  signInFormOpen: false,
                  signInText: '',
                  loading: false,
                  error: ''
                };

    this.fieldEventHandler = this.fieldEventHandler.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.keyPressEventHandler = this.keyPressEventHandler.bind(this)
  }

  fieldEventHandler(e){
    switch (e.target.name) {
      case 'username':
        this.setState({username: e.target.value})
        break;
      case 'email':
        this.setState({email: e.target.value})
        break;
      case 'password':
        this.setState({password: e.target.value})
        break;
      default:
    }
  }

  keyPressEventHandler(e){
    if(e.key === 'Enter'){
      this.signIn(e)
    }
  }

  handleClick(e){
    this.setState({signInFormOpen: true})
  }


  signIn(e){
    e.preventDefault()
    let _this = this;
    this.setState({loading: true})
    firebase.database().ref('/users/').once('value').then((snapshot) => {

          //map trough all users and search for match with the username user has typed as state
          snapshot.forEach((childSnap) => {
            let username = childSnap.val().username;
            let password = _this.state.password;
            let email = childSnap.val().email;

            //if match is found, attempt sign in
            if(_this.state.username === username){
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  if(error){

                    console.log(this.setState({error: errorMessage}));
                    return
                  }
                  else{

                    _this.setState({loading: false, error: ''})
                    _this.props.appState({loggedIn: true, signInFormOpen: false})
                  }

                });
            }
            else{
              console.log('no such user');
              _this.setState({loading: false, error: 'no such user', username: '', password: ''})
            }
          })
    })
  }



  signOut(){
    console.log('sign out');
    let _this = this;
    firebase.auth().signOut().then(function() {
      //rerender non signed in view and default homepage
      _this.props.appState({loggedIn: false, page: 'welcome', loading: false, headerVideoPlays: false, username: null})
    }, function(error) {
      console.log(error);
    });
  }

  textStyle(){}


  render(){
    let signInButtonContent;



    switch (this.state.loading) {
      case true:
        signInButtonContent =
          <BounceLoader
      //  css={override}
          sizeUnit={'px'}
          size={25}
          color={'white'}
          loading={this.state.loading}
        />
        break;
      case false:
        signInButtonContent = 'Sign in'
        break;
    }

    {/* wait for firebase to return user or null before displaying navigation*/}
    if(this.props.loggedIn === null){
       return null
    }

    {/* logged in navigation */ }
    if(this.props.loggedIn){
      if(this.props.mobileDevice){return(
        <Drawer
           signOut={this.signOut}
           loggedIn={this.props.loggedIn}
           appState={this.props.appState}
           video={this.props.video}
        />
      )
    }
      else{
        return(
          <div className='signInDesktop'>
            <p className='navigation' onClick={this.signOut}>sign out</p>
            <p className='navigation'  name='about' onClick={() => this.props.appState({page: 'about', headerVideoPlays: true})}>about</p>
            <p className='navigation' onClick={() => this.props.appState({page: 'user'})}>my galleries</p>
            <p className='navigation'  name='about' onClick={() => this.props.appState({page: 'newPost', headerVideoPlays: true})}>new post</p>
          </div>
        )
      }

    }
    else{
      if(this.props.signInFormOpen){
        return(
                <div className='signInFormDesktop' ref={form => this.form = form} onClick={() => this.props.handleSignInFormOpen}>

                      <TextField
                        id='standard-uncontrolled'
                        label='username'
                        InputLabelProps={{style: {color: this.props.signInStyle.textColor}}}
                        InputProps={{style: {color: this.props.signInStyle.textColor}}}
                        style={{color: 'black'}}
                        defaultValue=''
                        margin='normal'
                        autoFocus={true}
                        className='signInField'
                        onChange={this.fieldEventHandler}
                        name='username'
                      />
                      <TextField
                        id='standard-uncontrolled'
                        label='password'
                        InputLabelProps={{style: {  color: this.props.signInStyle.textColor, opacity: 0.7}}}

                        type='password'
                        defaultValue=''
                        margin='normal'
                        className='signInField'
                        onChange={this.fieldEventHandler}
                        name='password'
                        onKeyPress={this.keyPressEventHandler}
                      />

                      <Button className='signInButton'  name="button" onClick={this.signIn} value='Submit' variant='outlined'>
                        {signInButtonContent}
                      </Button>
                      <FormHelperText className='helperError' id='my-helper-text'>{this.state.error}</FormHelperText>

                </div>
              )
      }
      else{
          return (
            <div style={{display: 'inline'}}>
              <div className='signInDesktop' name='controls'>
                <p className='navigation'  name='signin' onClick={this.props.handleClick}>sign in</p>
                <p className='navigation'  name='createaccount' onClick={() => this.props.appState({page: 'signUp'})}>sign up</p>
                <p className='navigation'  name='about' onClick={() => this.props.appState({page: 'about', headerVideoPlays: true})}>about</p>
                <p className='navigation'  name='about' onClick={() => this.props.appState({page: 'newPost', headerVideoPlays: true})}>new post</p>
              </div>
              <Drawer
                 signOut={this.signOut}
                 loggedIn={this.props.loggedIn}
                 appState={this.props.appState}
                 video={this.props.video}
              />
            </div>
          )
      }
    }
  }
}

export default SignIn;
