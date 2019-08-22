import React, { Component } from 'react';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import '../css/user.css';
import '../css/index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faTrash)


class User extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.deleteGallery = this.deleteGallery.bind(this)
    this.state = {userGalleries: [], helperText: ''}
  }

  componentWillMount(){
    let uid = this.props.user.uid
    let _this = this
    console.log(uid);
    firebase.database().ref('/galleries/').once('value').then((snapshot) => {

        let userGalleries = []
        snapshot.forEach((item) =>{
          if(uid === item.val().userId){
            let obj = {}
            obj.val = item.val()
            obj.key = item.key

            userGalleries.push(obj)
          }
        })
        let helperText = userGalleries.length === 0 ? 'You have not uploaded any galleries' : ''
        _this.setState({userGalleries, helperText})
    });
  }


  handleClick(item){
    console.log(item);
  }

  deleteGallery(key){
    firebase.database().ref('/galleries/' + key).remove().then(() => {

      let uid = this.props.user.uid

      firebase.database().ref('/galleries/').once('value').then((snapshot) => {

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
        return (
          <div className="contentContainer userContainer">
          <h1 className="center"> My galleries </h1>
          <p className="center">{this.state.helperText}</p>
              {this.state.userGalleries.map((item, key) => {
                return(
                  <div key={item.key}>
                    <div className="galleryNameContainer">
                      <MenuItem className="menuitem" onClick={() => this.handleClick(item)}>{item.val.galleryName}</MenuItem>
                    </div>
                      <Button onClick={() => this.deleteGallery(item.key)} className='deleteGallery' variant='default' color='primary'>
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
