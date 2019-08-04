import React, { Component } from 'react';
import firebase from 'firebase';
import { css } from '@emotion/core';
import '../css/newGallery.css';
import Preview from './preview.js';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PulseLoader from 'react-spinners/PulseLoader';
import Loading from 'react-loading-animation'
import { Line, Circle } from 'rc-progress';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faUpload } from '@fortawesome/free-solid-svg-icons';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
library.add(faUpload, faRedo)

class NewPost extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this)
    this.uploadImages = this.uploadImages.bind(this)
    this.changeImagesOrder = this.changeImagesOrder.bind(this)
    this.galleryName = this.galleryName.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
    this.copyClipBoard = this.copyClipBoard.bind(this)
    this.state = {
                 fileName: '',
                 description: '',
                 postText: '',
                 checkBox: false,
                 loading: false,
                 images: this.props.images,
                 wait: 0,
                 galleryName: '',
                 currentImage: 0,
                 progressPercentage: 0,
                 totalProgress: 0
                 }
  }

  uploadImages(e){
    console.log('upload call');
    if(e === undefined){
      e = this.props.e
    }

    let arr = [];
    for(let i=0; i < e.target.files.length; i++){

      let file = e.target.files[i];
      let url = URL.createObjectURL(file);
      let fileName = e.target.files[i].name;
      let reader = new FileReader();


                let imageObject = {
                  file: file,
                  url: url,
                  fileName: fileName,
                  style: {
                    display: 'inline-block',
                    margin: '15px 15px 15px 15px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                  }
                }

                arr.push(imageObject)

     reader.readAsDataURL(file);
    }
    this.setState({images: arr, success: false})
  }

  componentWillMount(){
    this.setState({images: this.props.images, success: false})
  }

  submit(e){
        e.preventDefault();
        let _this = this;
        let images = this.state.images;
        let userId;
        let username;

        if(this.state.images.length === 0){
          alert('no images')
          return
        }

        this.props.username === 'anonymous' ? username = 'anonymous' : username = this.props.username
        this.props.user === 'anonymous' ? userId = 'anonymous' : userId = this.props.user.uid

              var postData = {
                userId: userId,
                galleryName: this.state.galleryName === '' ? 'untitled' : this.state.galleryName,
                username: username,
                date: Date.now(),
                deleteNow: this.state.checkBox
              };

              var newGalleryKey = firebase.database().ref().child('galleries').push().key;
              _this.setState({newGalleryKey})
              var updates = {};
              updates['/galleries/'+ newGalleryKey] = postData;

              firebase.database().ref().update(updates)
              .then(() => _this.setState({loading: true}))
              .then(() => loop())
              .then(() => {
                _this.setState({loading: false, images: [], wait: 0, success: true})

              //  _this.props.appState({page: 'gallery', headerVideoPlays: false, gallery: {id: newGalleryKey}})
              })


              let loop = async () => {
                  for (let image of images) {
                      var file = image.file;
                      var fileName = image.fileName;
                      await  uploadImage(file, fileName);
                  }
              }


              let uploadImage = async (file, fileName) =>  {

                      return new Promise((resolve, reject) => {

                        var storageRef = firebase.storage().ref(userId + '/' + newGalleryKey + '/' + fileName);
                        var task = storageRef.put(file);

                        task.on('state_changed', function progress(snapshot){

                          let progress = snapshot.bytesTransferred;
                          let total = snapshot.totalBytes;
                          let picturesLength = _this.state.images.length;
                          let linePiece = 100 / picturesLength
                          let percentage = progress / total;
                          let number = Math.floor((percentage) * 100)

                          if(number === 100){
                            _this.setState({totalProgress: _this.state.totalProgress + linePiece, wait: _this.state.wait + 1})
                          }
                          _this.setState({progressPercentage: number})

                        }, function error(err){console.log(err)}, function complete(){

                                   task.snapshot.ref.getDownloadURL().then((downloadURL) =>  {

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

    removeImage(item){
      let _this = this;
      let images = this.state.images;
      let image;

      //find image instance from array
      for(image in images){

          if(images[image].url === item.url){

            //create new array without the to be removed image
            let imageIndex = images[image]
            images = images.filter(item => item !== imageIndex)
            _this.setState({images})
            break;
          }
        }
    }

    changeImagesOrder(val){
      this.setState({images: val})
    }


    galleryName(e){
      this.setState({galleryName: e.target.value})
    }

    handleCheckBox(e){
      this.setState({checkBox: e.target.checked})
    }

    copyClipBoard(){
      var copyText = document.getElementById("text");
      copyText.select();
      document.execCommand("copy");
    }

render(){


    let helperText = this.state.checkBox ? 'Gallery will get deleted after the first page load of the gallery. Deleted galleries can not be recovered.' : ''
    let _this  = this;
    let video = this.props.video ?
                <video  className='video' autoplay='autoplay' src={this.props.video} preload='none' muted loop id='myVideo'>
                  Your browser does not support HTML5 video.
                </video>
                :
                null



    {/* upload animaton  */ }
    if(this.state.loading){
      return (
        <div>
          <Circle
            className="circle"
            percent={this.state.progressPercentage}
            strokeWidth="3" strokeColor="green" />
          <Line
            className="line"
            percent={this.state.totalProgress}
            strokeWidth="3"
            strokeColor="green" />
            <p style={{bottom: 150, position: 'relative'}} className="center">{this.state.wait}/{this.state.images.length}</p>
            <p style={{bottom: 160, position: 'relative'}} className="center">Please wait...</p>
        </div>
      )
    }

    if(this.state.success){
      return (
        <div>
            <h1 className="center">success!</h1>
            <p className="center">Your gallery can be found at:</p>
            <p  className="center">https://blog-9b512.firebaseapp.com/{this.state.newGalleryKey}</p>

            <input
              id="text"
              type="text"
              style={{marginLeft: -9999, display: 'block'}}
              value={`http://localhost:3000/${this.state.newGalleryKey}`}
              ref={input => this.input = input}
            />

            <Button
               onClick={this.copyClipBoard}
               variant="outlined"
               className="copyLink">
               Copy link
            </Button>

            <div className='successControls'>
               <input
               accept="image/*"
               style={{display: 'none'}}
               id="contained-button-file"
               multiple
               type="file"
               onChange={this.uploadImages}
              />

               {/*
               <label htmlFor="contained-button-file">
                 <Button variant="outlined" component="span" >
                   Create a new gallery
                   <FontAwesomeIcon style={{bottom: 5, position: 'relative'}} className='faAwesome' style={{color: 'black'}}  icon={faRedo}/>
                 </Button>
               </label>

                Maybe use these, maybe not

                <Button
                style={{marginLeft: 5}}
                onClick={() => _this.props.appState({page: 'gallery', galleryId: this.state.newGalleryKey})}
                variant="outlined">
                Go to {this.state.galleryName === "" ? 'untitled' : this.state.galleryName}
              </Button>*/}

          </div>
      </div>

      )
    }

    else{
        return (
          <div>
              <div className="titleContainer">
                <h2 className="newGalleryTitle">New gallery</h2>
              </div>

              <div className="optionsContainer">
                    <div className="inputContainer">
                      <Input
                        onChange={this.galleryName}
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
                             onChange={this.uploadImages}
                           />
                           <p style={{float: 'left', width: '100%'}}>Delete after first view<span><input defaultChecked={this.state.checkBox} onChange={this.handleCheckBox} type="checkbox"/></span></p>
                           <label htmlFor="contained-button">
                             <Button style={{marginRight: 5, marginBottom: 5}} variant="outlined" component="span" >
                               {this.state.images.length === 0 ? 'upload' : 'reupload'}
                               {this.state.images.length === 0 ? '' : <FontAwesomeIcon style={{bottom: 5, position: 'relative'}} className='faAwesome' style={{color: 'black'}}  icon={faRedo}/>}
                             </Button>
                           </label>

                           <Button style={{marginBottom: 5}}  onClick={this.submit} variant="outlined">
                            save gallery
                            <FontAwesomeIcon className='faAwesome' icon={faUpload}/>
                          </Button>
                    </div>
              </div>

            <div className="previewsContainer">

            <div style={{minHeight: 20, maxHeight: 20}}>
              <p style={{dispaly: 'block'}}> {helperText}</p>
            </div>

              {this.state.images.map((item, i) =>

                  <Preview
                      images={this.state.images}
                      length={this.state.images.length}
                      item={item}
                      key={i}
                      index={i}
                      url={item.url}
                      style={item.style}
                      removeImage={() => this.removeImage(item)}
                      changeImageArray={this.changeImageArray}
                      changeImagesOrder={this.changeImagesOrder}
                  />

                )}
            </div>
          </div>
        )
    }
}


}
export default NewPost;
