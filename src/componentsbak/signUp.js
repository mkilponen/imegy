import React, { Component } from 'react';
import firebase from 'firebase';
import { css } from '@emotion/core';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import PulseLoader from 'react-spinners/PulseLoader';
import '../css/signUp.css';


class SignUp extends Component {

  constructor(props) {
    super(props);
    this.evHandler = this.evHandler.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
                 username: '',
                 usernameHelper: '',
                 password: '',
                 passwordHelper: '',
                 passwordRepeat: '',
                 passwordRepeatHelper: ''
                 }
  }

  firebaseValidation(){
    console.log('heyyy')
  }

  componentDidMount(){
    this.props.appState({headerVideoPlays: true})
  }



  evHandler(e){
    let value = e.target.value;
    let field = e.target.name;
    let _this = this;

    switch (field) {
      case 'email':
        this.setState({email: value})
        break;
      case 'username':
        if(value.length < 5){
          this.setState({usernameHelper: 'Username is too short'})
        }

        else{
          firebase.database().ref('/users/').once('value').then((snapshot) => {

                  snapshot.forEach((child) => {
                    let username = child.val().username
                    if(username === value){
                      _this.setState({usernameHelper: 'Username taken'})
                    }
                    else{
                    _this.setState({usernameHelper: ''})
                    }
                  })
          });
        }
        this.setState({username: value})


        break;
      case 'password':

          this.setState({password: value})
          value.length < 5 ? this.setState({passwordHelper: 'Password is too short'}) : this.setState({passwordHelper: ''})
          break;

      case 'passwordRepeat':
          this.setState({passwordRepeat: value})
          value != this.state.password ? this.setState({passwordRepeatHelper: "Passwords don't match!"}) : this.setState({passwordRepeatHelper: ''})
          break;
    }
  }

  submit(){
        console.log('submit');
        let email = this.state.email;
        let password = this.state.password;

        this.props.appState({username: this.state.username, page: 'newPost'})
          firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error, user) {

          if(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, error);
          }

          });
  }

render(){
  let header = this.props.mobileDevice ? <h2>Create a new account</h2> : <h1>Create a new account</h1>
      return (
        <div className='signUpContainer'>
        {header}

        <FormControl className="formInput" style={{display: 'block'}}>
          <InputLabel  htmlFor='my-input'>Email</InputLabel>
          <Input name='email' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'></FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block'}}>
          <InputLabel htmlFor='my-input'>Username</InputLabel>
          <Input name='username' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{this.state.usernameHelper}</FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block'}}>
          <InputLabel htmlFor='my-input'>Password</InputLabel>
          <Input name='password' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{this.state.passwordHelper}</FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block'}}>
          <InputLabel htmlFor='my-input'>Repeat password</InputLabel>
          <Input name='passwordRepeat' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{this.state.passwordRepeatHelper}</FormHelperText>
        </FormControl>

        <Button style={{display: 'block', color: 'black'}} onClick={this.submit} name='submit' variant='outlined' className='signInButton'>
          Sign up
        </Button>
        </div>
      )
    }
}

export default SignUp;
