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


class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
                 username: '',
                 usernameHelper: '',
                 password: '',
                 passwordHelper: '',
                 passwordRepeat: '',
                 passwordRepeatHelper: ''
                 }
  }

render(){
      return (

        <h1> account </h1>

      )
    }
}

export default User;
