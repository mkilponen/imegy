import React, { Component } from 'react';
import firebase from 'firebase';
import { css } from '@emotion/core';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import PulseLoader from 'react-spinners/PulseLoader';
import '../css/user.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faTrash)


class User extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.deleteGallery = this.deleteGallery.bind(this)
    this.state = {userGalleries: []}
  }

  componentWillMount(){
    let uid = this.props.user.uid
    let _this = this

    firebase.database().ref('/posts/').once('value').then((snapshot) => {

        let userGalleries = []
        snapshot.forEach((item) =>{
          if(uid === item.val().userId){
            let obj = {}
            obj.val = item.val()
            obj.key = item.key

            userGalleries.push(obj)
          }
        })
        this.setState({userGalleries})
    });
  }

  handleClick(item){
    console.log(item);
  }

  deleteGallery(key){
    firebase.database().ref('/posts/' + key).remove().then(() => {

      let uid = this.props.user.uid
      let _this = this

      firebase.database().ref('/posts/').once('value').then((snapshot) => {

          let userGalleries = []
          snapshot.forEach((item) =>{
            if(uid === item.val().userId){
              let obj = {}
              obj.val = item.val()
              obj.key = item.key

              userGalleries.push(obj)
            }
          })
          this.setState({userGalleries})
      });

    })
  }

  render(){
    console.log(this.state.userGalleries);
        return (
          <div className="contentContainer userContainer">
          <h1> My galleries </h1>

              {this.state.userGalleries.map((item, key) => {
                return(
                  <div key={item.key}>
                    <div className="galleryNameContainer">
                      <MenuItem className="menuitem" onClick={() => this.handleClick(item)}>{item.val.galleryName}</MenuItem>
                    </div>
                      <Button onClick={() => this.deleteGallery(item.key)} className='deleteButton' variant='default' color='primary'>
                        <FontAwesomeIcon  className='deleteIcon' icon='trash'  />
                      </Button>
                  </div>
                )
              })}

          </div>
        )
      }
}

export default User;
