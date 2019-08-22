import React, { useState, useEffect } from 'react';

//components
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { Line } from 'rc-progress';
import Preview from './preview'
import Fade from 'react-reveal/Fade';
import { DragDropContext } from 'react-beautiful-dnd';

//redux
import {connect} from 'react-redux';
import {newGallery} from '../actions'

//other
import firebase from 'firebase';
import imagesToArray from '../js/imagesToArray'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../css/index.css';
import '../css/newGallery.css';
library.add(faUpload, faRedo)

const NewGallery = (props) => {

  const [checkBox, setCheckBox] = useState(false)
  const [images, setImages] = useState(props.images)
  const [loading, setLoading] = useState(false)
  const [galleryName, setGalleryName] = useState('')
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [totalProgress, setTotalProgress] = useState(0)
  const [newGalleryKey, setNewGalleryKey] = useState(null)
  const [success, setSuccess] = useState(false)
  const [wait, setWait] = useState(0)

  const uploadImages = (e) => {
    let images = imagesToArray(e)
    props.newGallery(images)
  }

  const submit = (e) => {
        e.preventDefault();
        let userID = !props.user  ? 'anonID' : props.user.uid

        var galleryData = {
            userId: userID,
            galleryName: galleryName === '' ? 'untitled' : galleryName,
            username: !props.user ? 'anon' : props.user.displayName,
            date: Date.now(),
            deleteNow: checkBox
        };

        let newGalleryKey = firebase.database().ref().child('galleries').push().key;

        setNewGalleryKey(newGalleryKey)
        setLoading(true)
        let updates = {};
            updates['/galleries/'+ newGalleryKey] = galleryData;

        firebase.database().ref().update(updates)
              .then(() => loop())
              .then(() => {
                setLoading(false)
                setImages([])
                setWait(0)
                setSuccess(true)
        })

              // upload iamges async
              let loop = async () => {
                  for (let image of props.gallery) {
                      var file = image.file;
                      var fileName = image.fileName;
                      await  uploadImage(file, fileName);
                  }
              }

              //single upload task
              let uploadImage = async (file, fileName) =>  {
                      return new Promise((resolve, reject) => {

                        var storageRef = firebase.storage().ref(userID + '/' + newGalleryKey + '/' + fileName);
                        var task = storageRef.put(file);

                        task.on('state_changed', function progress(snapshot){

                          //circle progress
                          let progress = snapshot.bytesTransferred;
                          let totalSize = snapshot.totalBytes;

                          //line progress
                          let picturesLength = props.gallery.length;
                          let lineProgress = 100 / picturesLength
                          let percentage = progress / totalSize;
                          let number = Math.floor((percentage) * 100)

                          if(number === 100){
                            setTotalProgress(totalProgress + lineProgress)
                            setWait(wait + 1)
                          }

                          setProgressPercentage(number)

                        }, function error(err){console.log(err)}, function complete(){

                                   task.snapshot.ref.getDownloadURL().then((downloadURL) =>  {
                                     //push img data to img node
                                      var imgData = {
                                        fileName: fileName,
                                        url: downloadURL,
                                      };

                                      var newImageKey = firebase.database().ref().child('galleries/' + newGalleryKey + '/images/').push().key;
                                      var updates = {};
                                      updates['/galleries/'+ newGalleryKey + '/images/' +  newImageKey] = imgData;
                                      firebase.database().ref().update(updates);
                                      resolve(downloadURL)
                                    });
                            })
                      });
              }
    }

    const removeImage = (item) => {
      let gallery = props.gallery
      let newGallery = gallery.filter(image => item !== image)
      props.newGallery(newGallery)
    }

    const copyClipBoard = () => {
      var copyText = document.getElementById("text");
      copyText.select();
      document.execCommand("copy");
    }

    let helperText = checkBox ? '' : ''
    let url = 'url(' + props.url + ')'

    {/* upload animaton  */ }
    if(loading){
      return (
        <div>
        <Fade cascade duration={200}>
          <h3 className="center">Uploading</h3>
          <Line
            className="line"
            percent={progressPercentage}
            strokeWidth="2" strokeColor="green" />
          <Line
            className="line"
            percent={totalProgress}
            strokeWidth="2"
            strokeColor="green" />
            <p className="center">{wait}/{props.gallery.length}</p>
            <p className="center">Please wait...</p>
          </Fade>
        </div>
      )
    }

    if(success){
      return (
        <div>
            <Fade cascade duration={200}>
            <h1 className="center">success!</h1>
            <p className="center">Your gallery can be found at:</p>
            <p  className="center">https://blog-9b512.firebaseapp.com/{newGalleryKey}</p>
            </Fade>
            <input
              id="text"
              type="text"
              style={{marginLeft: -9999, display: 'block'}}
              value={`https://blog-9b512.firebaseapp.com/${newGalleryKey}`}
              ref={input => input = input}
            />

            {props.mobileDevice ? null :
              <Button
               onClick={() => copyClipBoard()}
               variant="outlined"
               className="copyLink">
               Copy link
               </Button>}

            <div className='successControls'>
               <input
               accept="image/*"
               style={{display: 'none'}}
               id="contained-button-file"
               multiple
               type="file"
               onChange={(e) => uploadImages(e)}
              />

          </div>

      </div>

      )
    }

    else{
        return (
          <div>
              <div className="titleContainer">
                <Fade duration={200}>
                <h2 className="newGalleryTitle">New gallery</h2>
                </Fade>
              </div>

              <div className="optionsContainer">
                    <Fade duration={500}>
                    <div className="inputContainer">
                      <Input
                        onChange={(e) => setGalleryName(e.target.value)}
                        placeholder={'Gallery title'}
                        type='text'
                        className="galleryName"
                          autoFocus={true}
                        />
                    </div>

                    <div className='galleryControls'>
                            <input
                             accept="image/*"
                             style={{display: 'none'}}
                             id="contained-button"
                             multiple
                             type="file"
                             onChange={(e) => uploadImages(e)}
                           />
                           <p style={{float: 'left', width: '100%', marginTop: 0, marginBottom: 10}}>Delete after first view<span><input defaultChecked={checkBox} onChange={(e) => setCheckBox(e.target.checked)} type="checkbox"/></span></p>
                           <label htmlFor="contained-button">
                             <Button style={{marginRight: 5, marginBottom: 5}} variant="outlined" component="span" >
                               {props.gallery.length === 0 ? 'upload' : 'reupload'}
                               {props.gallery.length === 0 ? '' : <FontAwesomeIcon style={{bottom: 5, position: 'relative', color: 'black'}} className='faAwesome'  icon={faRedo}/>}
                             </Button>
                           </label>
                           {props.gallery.length === 0 ? null :

                               <Button style={{marginBottom: 5}}  onClick={(e) => submit(e)} variant="outlined">
                                save gallery
                                <FontAwesomeIcon className='faAwesome' icon={faUpload}/>
                                </Button>

                           }

                    </div>
                    </Fade>
              </div>
            <div className="previewsContainer">

            {props.gallery.map((item, i) =>
                  <Preview
                      item={item}
                      key={i}
                      index={i}
                      url={item.url}
                      removeImage={() => removeImage(item)}
                  />
                )}
            </div>
          </div>
        )
    }
}
const mapStateToProps = (state) => {
  return {
    mobileDevice: state.mobileDevice,
    newGallery: newGallery,
    gallery: state.newGallery,
    user: state.user
  }
}
export default connect(mapStateToProps, {newGallery})(NewGallery)
