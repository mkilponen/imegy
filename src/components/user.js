import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from 'react-reveal/Fade';
import '../css/user.css';
import '../css/index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faTrash)


export default function user(props){

  const [userGalleries, setUserGalleries] = useState([])

  useEffect(() => {
    let uid = props.user.uid
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
        console.log(userGalleries);
        setUserGalleries(userGalleries)
    });
  }, [])

  function deleteGallery(e, key){
    firebase.database().ref('/galleries/' + key).remove().then(() => {

      let uid = props.user.uid

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
          setUserGalleries(userGalleries)
      });

    })
  }

  return (
      <div className="contentContainer userContainer">
      <Fade duration={450}>
      <h1 className="center"> My galleries </h1>
      <p className="center">{userGalleries.length === 0 ? 'You have not uploaded any galleries' : ''}</p>
          {userGalleries.map((item, key) => {
              return(
                  <div key={item.key}>
                      <div className="galleryNameContainer">
                        <MenuItem className="menuitem">{item.val.galleryName}</MenuItem>
                      </div>
                      <Button onClick={(e) => deleteGallery(e, item.key)} className='deleteGallery' variant='default' color='primary'>
                        <FontAwesomeIcon  className='deleteIcon' icon='trash'  />
                      </Button>
                  </div>
              )
          })}
      </Fade>
      </div>
  )
}
