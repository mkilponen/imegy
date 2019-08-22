import React, { Component } from 'react';
import firebase from 'firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BounceLoader from 'react-spinners/BounceLoader';
import FormHelperText from '@material-ui/core/FormHelperText';
import NavigationMobile from './navigationMobile.js';
import '../css/navigation.css';
import '../css/index.css';



class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
                  signInFormOpen: false,
                  loading: false,
                  error: '',
                  isVisible: false
                };

    this.fieldEventHandler = this.fieldEventHandler.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.keyPressEventHandler = this.keyPressEventHandler.bind(this)
    this.navigationHandler = this.navigationHandler.bind(this)
  }

  //handle input from sign in fields
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

  // handle sign in with enter press
  keyPressEventHandler(e){
    if(e.key === 'Enter'){
      this.signIn(e)
    }
  }

  signIn(e){
    e.preventDefault()
    let _this = this;
    this.setState({loading: true, error: ''})
    firebase.database().ref('/users/').once('value').then((snapshot) => {

          //map trough all users and search for match with  this.state.username
          // this should be changed for .filter() i think
          snapshot.forEach((childSnap) => {
            let username = childSnap.val().username;
            let password = _this.state.password;
            let email = childSnap.val().email;

            //if match is found, attempt sign in
            if(_this.state.username === username){
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

                  if(error){
                    _this.setState({error: error.message})
                    return
                  }
                  _this.props.appState({loggedIn: true, signInFormOpen: false})
                  return
                });
            }

            //end animation
            _this.setState({loading: false})
            return
          })
          // invalid username needs fixing
            _this.setState({loading: false, error: ''})
    })
  }

  navigationHandler(page){
    this.props.appState({page})
  }


  signOut(){
    let _this = this;
    firebase.auth().signOut().then(function() {
      //rerender non signed in view and default homepage
      _this.props.appState({loggedIn: false, page: 'home', loading: false, username: null})
    }, function(error) {
      console.log(error);
    });
  }

  textStyle(){}


  render(){
    let signInButtonContent;
    switch (this.state.loading ) {
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
      default:
      break;
    }

    {/* wait for firebase to return user or null before displaying navigation*/}
    if(this.props.loggedIn === null){
       return null
    }

    {/* logged in navigation */ }
    if(this.props.loggedIn){
      if(this.props.mobileDevice){return(
        <NavigationMobile
           signOut={this.signOut}
           loggedIn={this.props.loggedIn}
           appState={this.props.appState}
           video={this.props.video}
        />
      )
    }
      else{
        return(
          <div className='navigationDesktop'>
            <p className='navigation white' name='home' onClick={() => this.navigationHandler('home')}>home</p>
            <input accept="image/*" style={{display: 'none'}} id="contained-button-file" multiple type="file" onChange={this.props.uploadImages}/>
            <label htmlFor="contained-button-file">
                <p className='navigation white'  name='about'>new gallery</p>
            </label>
            <p className='navigation white'  name='myGalleries' onClick={() => this.navigationHandler('user')}>my galleries</p>
            <p className='navigation white'  name='about'       onClick={() => this.navigationHandler('about')}>about</p>
            <p className='navigation white' onClick={this.signOut}>sign out</p>
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
                        InputProps={{style: {color: this.props.signInStyle.textColor}}}
                        InputLabelProps={{style: {  color: this.props.signInStyle.textColor, opacity: 0.7}}}
                        type='password'
                        defaultValue=''
                        margin='normal'
                        className='signInField'
                        onChange={this.fieldEventHandler}
                        name='password'
                        onKeyPress={this.keyPressEventHandler}
                      />
                      <Button className='signInButton'  name="button" onClick={this.signIn} value='Submit' variant='contained'>
                        {signInButtonContent}
                      </Button>
                      <FormHelperText className='helperError' id='my-helper-text'>{this.state.error}</FormHelperText>
                </div>
              )
      }
      else{
          return (
            <div style={{display: 'inline'}}>
              <div className='navigationDesktop'>

                <p className='navigation white' name='about' onClick={() => this.navigationHandler('home')}>home</p>
                <p className='navigation white' name='about' onClick={() => this.navigationHandler('about')}>about</p>
                <input accept="image/*" style={{display: 'none'}} id="contained-button-file" multiple type="file" onChange={this.props.uploadImages}/>
                <label htmlFor="contained-button-file">
                    <p className='navigation white'  name='about'>new gallery</p>
                </label>
                <p className='navigation white'  name='createaccount' onClick={() => this.navigationHandler('signUp')}>sign up</p>
                <p className='navigation white'  name='signin' onClick={this.props.handleSignInFormOpen}>sign in</p>

              </div>
              <NavigationMobile
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

export default Navigation;
