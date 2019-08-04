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
                  signInText: '',
                  loading: false,
                  error: ''
                };

    this.fieldEventHandler = this.fieldEventHandler.bind(this);
    this.signIn = this.signIn.bind(this);
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
                  console.log('nyttt');
                  if(error){
                    console.log('if');
                    alert(error)
                    this.setState({error: errorMessage})
                    return
                  }
                  else{

                    console.log('elseeen');
                    _this.props.appState({loggedIn: true, page: 'welcome', headerVideoPlays:false})
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


  render(){
    console.log(this.props.users, this.state.loading);
    let signInButtonContent;

    switch (this.state.loading) {
      case true:
        signInButtonContent =
          <BounceLoader
      //  css={override}
          sizeUnit={'px'}
          size={25}
          color={'black'}
          loading={this.state.loading}
        />
        break;
      case false:
        signInButtonContent = 'Sign in'
        break;
    }

        return(
                <div className='signInFormMobile'>
                      <TextField
                        id='standard-uncontrolled'
                        label='username'
                        InputLabelProps={{style: {color: 'black'}}}
                        InputProps={{style: {color: 'black'}}}
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
                        InputLabelProps={{style: {  color: 'black', opacity: 0.7}}}

                        type='password'
                        defaultValue=''
                        margin='normal'
                        className='signInField'
                        onChange={this.fieldEventHandler}
                        name='password'
                        onKeyPress={this.keyPressEventHandler}
                      />

                      <Button style={{marginTop: 25}} name="button" onClick={this.signIn} value='Submit' variant='outlined'>
                        {signInButtonContent}
                      </Button>
                      <FormHelperText className='helperError' id='my-helper-text'>{this.state.error}</FormHelperText>
                </div>
            )
      }
}


export default SignIn;
