import React, { Component } from 'react';
import firebase from 'firebase';
import { css } from '@emotion/core';
import '../css/newPost.css';
import Preview from './preview.js';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
// First way to import
// Another way to import
import PulseLoader from 'react-spinners/PulseLoader';

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
    this.changeImageArray = this.changeImageArray.bind(this)
    this.changeImagesOrder = this.changeImagesOrder.bind(this)
    this.galleryName = this.galleryName.bind(this)
    this.state = {
                 fileName: '',
                 description: '',
                 postText: '',
                 loading: false,
                 images: this.props.images,
                 wait: '',
                 galleryName: '',
                 wait: 0
                 }
  }

  uploadImages(e){
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
    this.setState({images: arr})
  }

  componentWillMount(){
    this.setState({images: this.props.images})
  }

  submit(e){
        e.preventDefault();
        let _this = this;
        let images = this.state.images;
        let userId;
        let username;
        this.props.username === null ? username = 'Anonymous' : username = this.props.username
        this.props.user === null ? userId = 'anon' : userId = this.props.user.uid

              var postData = {
                userId: userId,
                galleryName: this.state.galleryName,
                username: username
              };

              var newPostKey = firebase.database().ref().child('posts').push().key;
              var updates = {};
              updates['/posts/'+ newPostKey] = postData;

              firebase.database().ref().update(updates)
              .then(() => _this.setState({loading: true}))
              .then(() => loop())
              .then(() => _this.setState({loading: false, images: [], wait: 0}))


              let loop = async () => {
                  for (let image of images) {
                      var file = image.file;
                      var fileName = image.fileName;
                      await  uploadImage(file, fileName);
                  }
              }


              let uploadImage = async (file, fileName) =>  {

                      return new Promise((resolve, reject) => {

                        var storageRef = firebase.storage().ref(userId + '/' + newPostKey + '/' + fileName);
                        var task = storageRef.put(file);
                        _this.setState({wait: this.state.wait + 1})
                        task.on('state_changed', function progress(snapshot){}, function error(err){console.log(err)}, function complete(){

                                   task.snapshot.ref.getDownloadURL().then((downloadURL) =>  {

                                      var imgData = {
                                        fileName: fileName,
                                        url: downloadURL,
                                      };

                                      var newImageKey = firebase.database().ref().child('posts/' + newPostKey + '/images/').push().key;
                                      var updates = {};
                                      updates['/posts/'+ newPostKey + '/images/' +  newImageKey] = imgData;
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

    changeImageArray(value, index){
      let images = this.state.images;
      let list={
        height: '185px',
        width: '185px',
        margin: '15px 15px 15px 15px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
      let row={
        height: '185px',
        width: '185px',
        margin: '15px 15px 15px 15px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }

      if(value === 'List'){
        images[index].style = list
      }
      else{
        images[index].style = row
      }
      this.setState({images: images})
    }

    galleryName(e){
      this.setState({galleryName: e.target.value})
      console.log(this.state.galleryName);
    }

render(){
    let _this  = this;
    console.log(this.state.images);

    let video = this.props.video ?
                <video  className='video' autoplay='autoplay' src={this.props.video} preload='none' muted loop id='myVideo'>
                  Your browser does not support HTML5 video.
                </video>
                :
                null



    {/* upload animaton  */ }
    if(this.state.loading){
      return (
        <div style={{top:100,position: 'relative'}}>
        <PulseLoader
        //  css={override}
          sizeUnit={'px'}

          size={15}
          color={'#123abc'}
          loading={this.state.loading}
        />
        <p>Uploading...</p>
        <p>{this.state.wait}/{this.state.images.length}</p>
        <p>Don't close this page</p>
        </div>
      )
    }

    else{
        return (
          <div className="newPostContainer">

              <div className="titleContainer">
                <h1>New gallery</h1>
              </div>
              <div className="optionsContainer">
                <Input
                  onChange={this.galleryName}
                  placeholder={'Gallery title'}
                  type='text'
                  className="galleryName"
                  />
                <div className='galleryControls'>

                  <label className="button" id='uploadbutton'>
                     <input  type='file' name='file' onChange={this.uploadImages}  multiple/>
                     <p  className='buttonText'>redo images</p>
                     <FontAwesomeIcon className='faAwesome' style={{color: 'black'}}  icon={faRedo}/>
                  </label>


                  <label className="button" id='submitbutton'>
                    <input  name='file' onClick={this.submit} type='file' multiple/>
                    <p className='buttonText'>upload images</p>
                    <FontAwesomeIcon className='faAwesome' icon={faUpload}/>
                  </label>
              </div>


                <p style={{bottom: -20, position: 'relative'}}>{this.props.user ? '' : ''}</p>
                <div className='sweet-loading'></div>

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
        )
    }
}


}
export default NewPost;
