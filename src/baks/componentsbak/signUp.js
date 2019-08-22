
import React, { Component } from 'react';
import firebase from 'firebase';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
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

  evHandler(e){
    let value = e.target.value;
    let field = e.target.name;
    let _this = this;

    switch (field) {
      case 'email':
        this.setState({email: value})
        break;
      case 'username':

        //check if username is too short
        if(this.state.username.length < 3 || this.state.username.length > 1){
          this.setState({usernameHelper: 'Username is too short', username: e.value})
        }

        // check if username is taken
        else{
          firebase.database().ref('/users/').once('value').then((snapshot) => {

                  snapshot.forEach((child) => {
                    let username = child.val().username
                    if(username === value){
                      _this.setState({usernameHelper: 'Username taken', username: e.value})
                      return
                    }
                    else{
                      _this.setState({usernameHelper: '', username: e.value})
                      return
                    }
                  })
          });
        }

        this.setState({username: value, usernameHelper: ''})

        break;
      case 'password':

          this.setState({password: value})
          value.length < 5 ? this.setState({passwordHelper: 'Password is too short'}) : this.setState({passwordHelper: ''})
          break;

      case 'passwordRepeat':
          this.setState({passwordRepeat: value})
          value !== this.state.password ? this.setState({passwordRepeatHelper: "Passwords don't match!"}) : this.setState({passwordRepeatHelper: ''})
          break;
      default:
      break;
    }
  }

  submit(){

        //create random email for firebase
        //maybe later implement real email and confirmation
        let random = Math.floor(Math.random() * Math.floor(10000));
        let email = random.toString() + '@imegy.com'
        let password = this.state.password;
        const _this = this

          firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error, user) {

          if(error){
            var errorCode = error.code;
            console.log(errorCode, error);
          }
          else{
            _this.props.appState({username: this.state.username, page: 'home'})
          }

          });
          _this.props.appState({page: 'home'})
  }

render(){
  let header = this.props.mobileDevice ? <h2>Create a new account</h2> : <h2>Create a new account</h2>
      return (
        <div className='signUpContainer'>
        {header}

        {/*<FormControl className="formInput" style={{display: 'block'}}>
          <InputLabel  htmlFor='my-input'>Email</InputLabel>
          <Input name='email' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'></FormHelperText>
        </FormControl>*/}

        <FormControl className="formInput" style={{display: 'block', left: 0, position: 'relative'}}>
          <InputLabel htmlFor='my-input'>Username</InputLabel>
          <Input name='username' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{this.state.usernameHelper}</FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block', left: 0, position: 'relative'}}>
          <InputLabel htmlFor='my-input'>Password</InputLabel>
          <Input name='password' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{this.state.passwordHelper}</FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block', left: 0, position: 'relative'}}>
          <InputLabel htmlFor='my-input'>Repeat password</InputLabel>
          <Input name='passwordRepeat' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{this.state.passwordRepeatHelper}</FormHelperText>
        </FormControl>

        <Button style={{display: 'block'}} onClick={this.submit} name='submit' variant='outlined' className='signInButton'>
          Sign up
        </Button>

        </div>
      )
    }
}

export default SignUp;
