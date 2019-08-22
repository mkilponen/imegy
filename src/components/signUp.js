
import React, { useState } from 'react';
import firebase from 'firebase';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Fade from 'react-reveal/Fade';
import '../css/signUp.css';
import {connect} from 'react-redux';
import {setPage} from '../actions'


const Signup = (props) => {

  const [username, setUsername]                         = useState('');
  const [email, setEmail]                               = useState('');
  const [password,setPassword]                          = useState('');
  const [passwordRepeat,setPasswordRepeat]              = useState('');
  const [error, setError]                               = useState('');
  const [loading, setLoading]                           = useState(false);
  const [usernameHelper, setUsernameHelper]             = useState('')
  const [passwordHelper, setPasswordHelper]             = useState('')
  const [passwordRepeatHelper, setPasswordRepeatHelper] = useState('')

  function evHandler(e){
        let value = e.target.value;
        let field = e.target.name;

        switch (field) {
          case 'email':
                setEmail(value)
                break;

          case 'username':
                if(username.length < 3 || username.length > 1){
                  setUsernameHelper('Username is too short')
                }
                // check if username is taken
                else{
                  firebase.database().ref('/users/').once('value').then((snapshot) => {
                          const users = Object.values(snapshot.val());
                          const user = users.filter(user => user.username ===  username);
                          console.log(user);
                  });
                }
                setUsername(value)
                props.setNewUserUsername(value)
                setUsernameHelper('')
                break;

          case 'password':
                setPassword(value)
                value.length < 5 ? setPasswordHelper('Password is too short') : setPasswordHelper('')
                break;

          case 'passwordRepeat':
                setPasswordRepeat(value)
                value !== password ? setPasswordRepeatHelper("Passwords don't match!") : setPasswordRepeatHelper("")
                break;
          default:
          break;
        }
      }

      const submit = () => {
          //create random email for firebase
          //maybe later implement real email and confirmation
          let random = Math.floor(Math.random() * Math.floor(10000));
          let email = random.toString() + '@imegy.com'

          firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error, user) {
                if(error){
                  var errorCode = error.code;
                  console.log(errorCode, error);
                }
          })
          props.setPage('home')
      }

      let header = props.mobileDevice ? <h2>Create a new account</h2> : <h2>Create a new account</h2>

      return (
        <div className='signUpContainer'>
        <Fade cascade duration={450}>
        {header}

        {/*<FormControl className="formInput" style={{display: 'block'}}>
          <InputLabel  htmlFor='my-input'>Email</InputLabel>
          <Input name='email' onChange={this.evHandler} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'></FormHelperText>
        </FormControl>*/}

        <FormControl className="formInput" style={{display: 'block', left: 0, position: 'relative'}}>
          <InputLabel htmlFor='my-input'>Username</InputLabel>
          <Input name='username' onChange={e => evHandler(e)} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{usernameHelper}</FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block', left: 0, position: 'relative'}}>
          <InputLabel htmlFor='my-input'>Password</InputLabel>
          <Input type='password' name='password' onChange={e => evHandler(e)} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{passwordHelper}</FormHelperText>
        </FormControl>

        <FormControl className="formInput" style={{display: 'block', left: 0, position: 'relative'}}>
          <InputLabel htmlFor='my-input'>Repeat password</InputLabel>
          <Input type='password' name='passwordRepeat' onChange={(e) => evHandler(e)} id='my-input' aria-describedby='my-helper-text' />
          <FormHelperText id='my-helper-text'>{passwordRepeatHelper}</FormHelperText>
        </FormControl>

        <Button style={{display: 'block'}} onClick={(e) => submit(e)} name='submit' variant='outlined' className='signInButton'>
          Sign up
        </Button>
        </Fade>

        </div>
      )
}

const mapStateToProps = (state) => {
  return {
    mobileDevice: state.mobileDevice
  }
}

export default connect(mapStateToProps, {setPage})(Signup)
