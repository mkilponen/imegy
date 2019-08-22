import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BounceLoader from 'react-spinners/BounceLoader';
import FormHelperText from '@material-ui/core/FormHelperText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {connect} from 'react-redux'
import {setPage} from '../actions'
import '../css/signIn.css';
import '../css/index.css';

const SignIn = (props) => {

    const [open, setOpen]           = useState(false);
    const [username, setUsername]   = useState('');
    const [password,setPassword]    = useState('');
    const [error, setError]         = useState('');
    const [loading, setLoading]     = useState(false);

    // handle sign in with enter press
    function keyPressEventHandler(e){
      if(e.key === 'Enter'){
        signIn(e)
      }
    }

    function signIn(e){
      e.preventDefault()
      setLoading(true)
      setError('')
      firebase.database().ref('/users/').once('value').then((snapshot) => {

            //check if user exists
            const users = Object.values(snapshot.val());
            const user = users.filter(user => user.username ===  username);

            //no match
            if(user.length === 0){
              setLoading(false)
              setError('no such user')
              return
            }

            //match for user
            else{
              const email = user[0].email;

              firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                if(error){
                  setError(error.message)
                  return
                }
                else{

                }
              });
            }
      })
    }

    useEffect(() => {
      setLoading(false)
      setOpen(false)
    }, [props.loggedIn])

    function signOut(){
      firebase.auth().signOut().then(function() {
        //rerender non signed in view and default homepage
        props.setPage('home')
      }, function(error) {
        console.log(error);
      });
    }

      if(open || props.mobileDevice){
        return(
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div className='signInFormDesktop'>
                      <TextField
                        id='standard-uncontrolled'
                        label='username'
                        InputLabelProps={{style: {color: props.mobileDevice ? 'black' : 'white'}}}
                        InputProps={{style: {color: props.mobileDevice ? 'black' : 'white'}}}
                        style={{color: 'black'}}
                        defaultValue=''
                        margin='normal'
                        autoFocus={true}
                        className='signInField'
                        onChange={(e) => setUsername(e.target.value)}
                        name='username'
                      />
                      <TextField
                        id='standard-uncontrolled'
                        label='password'
                        InputProps={{style: {color: props.mobileDevice ? 'black' : 'white'}}}
                        InputLabelProps={{style: {color: props.mobileDevice ? 'black' : 'white', opacity: 0.5}}}
                        type='password'
                        defaultValue=''
                        margin='normal'
                        className='signInField'
                        onChange={(e) => setPassword(e.target.value)}
                        name='password'
                        onKeyPress={(e) => keyPressEventHandler(e)}
                      />
                      {loading ?
                        <Button value="sign in"className='signInButton' onClick={(e) => signIn(e)} value='Submit' variant='contained'>
                        <BounceLoader
                        sizeUnit={'px'}
                        size={25}
                        color={'white'}
                        loading={true}
                        />
                        </Button>
                        :
                        <Button value="sign in" className='signInButton' onClick={(e) => signIn(e)} value='Submit' variant='contained'>
                        sign in
                        </Button>
                      }
                      {props.mobileDevice ? null : <FormHelperText className='helperError' id='my-helper-text'>{error}</FormHelperText>}
                </div>
                 </ClickAwayListener>
              )
      }
      else if (props.loggedIn){
        return(<p className='navigation white' onClick={() => signOut()}>sign out</p>)
      }
      else{
        return (<p className='navigation white'  name='signin' onClick={() => setOpen(true)}>sign in</p>)
      }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    setPage: setPage,
    loggedIn: state.loggedIn,
    mobileDevice: state.mobileDevice
  }
}
export default connect(mapStateToProps, {setPage})(SignIn)
