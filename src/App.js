import React, { Component } from 'react';
import NewGallery from './components/newGallery.js';
import Navigation from './components/navigation.js';
import SearchBar from './components/searchBar.js';
import SignUp from './components/signUp.js';
import User from './components/user.js';
import Gallery from './components/gallery.js';
import SignInMobile from './components/signInMobile.js'
import firebase from 'firebase';
import _ from 'underscore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUpload } from '@fortawesome/free-solid-svg-icons';

//video
import Snowing from './media/snow.mp4'
import SnowingHeader from './media/snowheader.mp4'
import SnowingMobile from './media/snowmobile.mp4'
import SnowingMobileHeader from './media/snowmobileheader.mp4'

import BlueVid from './media/blue.mp4'
import BlueVidHeader from './media/blueheader.mp4'
import BlueVidMobile from './media/bluemobile.mp4'
import BlueVidMobileHeader from './media/bluemobileheader.mp4'

import Abstract from './media/abstract.mp4'
import AbstractHeader from './media/abstractheader.mp4'
import AbstractMobile from './media/abstractmobile.mp4'
import AbstractMobileHeader from './media/abstractmobileheader.mp4'

import Autumn from './media/autumn.mp4'
import AutumnHeader from './media/autumnheader.mp4'
import AutumnMobile from './media/autumnmobile.mp4'
import AutumnMobileHeader from './media/autumnmobileheader.mp4'

import './css/index.css';
import './css/app.css';


var config = {
    apiKey: 'AIzaSyC6IcPMhJfb4ARt6jV12qYI2lXAqKWJnAE',
    authDomain: 'blog-9b512.firebaseapp.com',
    databaseURL: 'https://blog-9b512.firebaseio.com',
    projectId: 'blog-9b512',
    storageBucket: 'gs://blog-9b512.appspot.com/',
    messagingSenderId: '681433505725'
  };
  firebase.initializeApp(config);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
                  search: '',
                  loggedIn: null,
                  page: 'home',
                  user: null,
                  signInFormOpen: false,
                  video: null,
                  headerVideoPlays: false,
                  images: [],
                  gallery: null,
                  mobileDevice: null,
                  username: null
                };
    this.handleSignInFormOpen = this.handleSignInFormOpen.bind(this);
    this.appState = this.appState.bind(this);
    this.uploadImages = this.uploadImages.bind(this)
    this.setVideo = this.setVideo.bind(this)
    this.getGallery = this.getGallery.bind(this)
  }


  setVideo(width, video){

    let mobileDevice = width < 800 ? true : false;
    switch (video) {
      case '/static/media/snow.6a9251eb.mp4':
        //snowing video
          this.setState({
                       video: mobileDevice ? SnowingMobile : Snowing ,
                       mobileDevice: mobileDevice ? true : false,
                       style: 'light',
                       headerVideo: mobileDevice ? SnowingMobileHeader : SnowingHeader,
                       searchBarStyle: {textColor:        '#112D38',
                                        placeHolderColor: 'white',
                                        underlineColor:   'white',
                                        paperColor:       '#9BAFB8',
                                        menuItemColor:    'white'},
                       signInStyle:    {textColor: mobileDevice ? 'black' : 'white'}
                        })
      break;
      case '/static/media/blue.29d6f388.mp4' :
        //blue and black ink video
          this.setState({
                       video: mobileDevice ? BlueVidMobile : BlueVid ,
                       mobileDevice: mobileDevice ? true : false,
                       style: 'light',
                       headerVideo: mobileDevice ? BlueVidMobileHeader : BlueVidHeader,
                       searchBarStyle: {textColor: 'white',
                                        placeHolderColor: 'white',
                                        underlineColor: 'white',
                                        paperColor: '#303030',
                                        menuItemColor: 'white'},
                       signInStyle:    {textColor: mobileDevice ? 'black' : 'white'}
                     })
      break;
      case '/static/media/autumn.e994f831.mp4' :
        //autumn video
        this.setState({
                       video: mobileDevice ? AutumnMobile : Autumn ,
                       mobileDevice: mobileDevice ? true : false,
                       style: 'light',
                       headerVideo: mobileDevice ? AutumnMobileHeader : AutumnHeader,
                       searchBarStyle: {textColor: 'white',
                                        placeHolderColor: 'white',
                                        underlineColor: 'white',
                                        paperColor: 'white',
                                        menuItemColor: '#3b3b3b'},
                       signInStyle:    {textColor: mobileDevice ? 'black' : 'white'}
                     })
      break;
      case '/static/media/abstract.9435cd4e.mp4' :
       // abstact blue smoke
        this.setState({
                       video: mobileDevice ? AbstractMobile : Abstract ,
                       mobileDevice: mobileDevice ? true : false,
                       style: 'light',
                       headerVideo: mobileDevice ? AbstractMobileHeader : AbstractHeader,
                       searchBarStyle: {textColor: 'black',
                                        placeHolderColor: '#2971AD',
                                        underlineColor: '#135DA1',
                                        paperColor: 'white',
                                        menuItemColor: 'black'},
                       signInStyle:    {textColor: 'black'}
                     })
      break;
    }
  }


  componentWillMount(){
    let _this = this;
    var url = window.location.href;
    var galleryIdRequest = url.replace('https://blog-9b512.firebaseapp.com', '');
    console.log('request', galleryIdRequest);
    if(galleryIdRequest.length != 0){
      this.getGallery(galleryIdRequest)
    }

    let videos = [ Snowing, BlueVid, Autumn ]
    let video = videos[Math.floor(Math.random() * 3)]
    this.setVideo(window.innerWidth, video)

    window.addEventListener("resize", _.throttle(() => this.setVideo(window.innerWidth, video), 500));

    //check if a user is logged in / the authentication status of user has changed
    firebase.auth().onAuthStateChanged(function(user) {
      console.log('auth changed');
      //if user is true, get this users data such as username and rerender page with userdata
      if (user) {
          firebase.database().ref('/users/' + user.uid).orderByKey().once('value').then((snapshot) => {
                  let userVal = snapshot.val();

                  //in case of new user creation
                  if(userVal === null){
                    let username = _this.state.username
                    let email = user.email
                    let id = user.uid
                    let userObj = {username: username, email: email}

                    firebase.database().ref().child('users/' + id).set({
                      username: username,
                      email: email
                    });
                    _this.setState({loggedIn: true, user: userObj, username})
                  }
                  else{
                    let username = snapshot.val().username;
                    userVal.id = snapshot.key;
                    _this.setState({loggedIn: true, user, username})
                  }
          });
      }
      //default view of no user is rendered
      else{
        console.log('no user');
        _this.setState({loggedIn: false, user: 'anonymous', username: 'anonymous', userId: 'anonymous'})
      }
    });
  }

  //passed as props to child components of app
  appState(state){
    console.log(state);
    this.setState(state)
  }

  getGallery(galleryId){
    console.log('getgallery');
    let _this = this
    firebase.database().ref('/galleries/' + galleryId).once('value').then((snapshot) => {

        let val = snapshot.val()
        if(val === null){
          return
        }

        let array = [];
        let galleryName = val.galleryName;
        let owner = val.username;
        let userId = val.userId;
        let remove = val.deleteNow;
        let images = snapshot.val().images;

              Object.entries(images).forEach(([key, value]) => {
                array.push({url: value.url, fileName: value.fileName})
              });

      let reverseEntries = array.reverse()
      let gallery = {
        galleryImages: reverseEntries,
        galleryName: galleryName,
        owner: owner
      }
      console.log(gallery);
      _this.setState({gallery, page: 'gallery'})

      if(remove){
        firebase.database().ref('/galleries/' + galleryId).remove()
      }
    });
  }

 //handle desktop sign in form visibility when click outside occurs
  handleSignInFormOpen(e, a) {
    if(this.state.mobileDevice){
      return
    }
    if(e.target.getAttribute("name") === 'signin'){
      this.setState({signInFormOpen: true})
    }
    if(e.target.getAttribute("name") === 'button' || e.target.getAttribute('class') === 'MuiButton-label'){
      console.log(e.target.getAttribute("name"));
      return
    }
    if(e.target.getAttribute("name") === null){
      this.setState({signInFormOpen: false})
    }
  }


  uploadImages(e){
    if(e === undefined){
      e = this.props.e
    }

    let imagesArray = [];
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

                imagesArray.push(imageObject)

     reader.readAsDataURL(file);
    }
    this.setState({images: imagesArray, page: 'newGallery'})
  }

  render() {

    //page navigator
    let page = this.state.page;
    switch (this.state.page) {
      case 'gallery':
        page = <Gallery
                gallery={this.state.gallery}
                appState={this.appState}/>
        break;
      case 'newGallery':
        page = <NewGallery
                  appState={this.appState}
                  images={this.state.images}
                  uploadImages={this.uploadImages}
                  user={this.state.user}
                  username={this.state.username}/>
        break;
      case 'home':
        page = <div>
                  <h1 className='textShadow white center'>welcome to imegy</h1>
                  <h3 className='textShadow white center'>Share, download and display images in a quick and easy manner</h3>
                  <label className='custom-file-upload '>
                      <input style={{display: 'none'}} type='file' name='file' onChange={this.uploadImages}  multiple/>
                        <div className='buttonWrap'>
                             <p className='buttonText buttonTextShadow white'>upload images</p>
                             <FontAwesomeIcon className='faUpload' icon={faUpload}/>
                        </div>
                  </label>
                </div>
        break;
      case 'signUp':
        page = <SignUp
                appState={this.appState}
                mobileDevice={this.state.mobileDevice}/>
        break;
      case 'signIn':
        {/* used exclusively for mobile view */}
        page = <SignInMobile
                appState={this.appState}
                user={this.state.user}
                loggedIn={this.state.loggedIn}
                />
        break;
      case 'about':
        page = <div className="aboutContainer">
                  <h2 className="center">About</h2>
                  <p>Imegy is a React/Firebase webapp for slick and easy image sharing. It is currently in a state of active development.</p>
                  <p>Here are some steps for future development</p>
                  <ul>
                    <li>Fix some known bugs                                                                              </li>
                    <li>Implement more responsiveness to elements                                                        </li>
                    <li><a href="https://www.youtube.com/watch?v=dpw9EHDh2bM">Rewrite the entire app with React Hooks</a></li>
                    <li>Implement Google Material Design with the new hooks                                              </li>
                    <li>Polish the general design and composition of the app                                             </li>

                  </ul>
                </div>
        break;
      case 'user':
        page = <User
                user={this.state.user}/>
        break;
    }

    // handle logic for background and header videos
    let headerVideo     = this.state.page === 'home' ?  null : <video  className='headerVideo' autoplay='autoplay' src={this.state.headerVideo} preload='none' muted loop id='myVideo'></video>
    let backgroundVideo = this.state.page === 'home' ?  <video className='backgroundVideo' autoplay='autoplay' src={this.state.video} preload='none' muted loop id='myVideo'></video> : null

    return (
      <div className="appContainer" onClick={this.handleSignInFormOpen}>
        {backgroundVideo}

          <div className= {this.state.mobileDevice && this.state.page != 'home' ? 'headerContainer headerShadow' : 'headerContainer' }>
              {headerVideo}

              <SearchBar
               getGallery={this.getGallery}
               setGallery={this.setGallery}
               mobileDevice={this.state.mobileDevice}
               searchBarStyle={this.state.searchBarStyle}
               appState={this.appState}/>

               <Navigation
                uploadImages={this.uploadImages}
                signInStyle={this.state.signInStyle}
                video={this.state.video}
                mobileDevice={this.state.mobileDevice}
                handleSignInFormOpen={this.handleSignInFormOpen}
                signInFormOpen={this.state.signInFormOpen}
                user={this.state.user}
                username={this.state.username}
                loggedIn={this.state.loggedIn}
                appState={this.appState}/>
          </div>

          <div className='pageContainer'>
                {page}
          </div>

      </div>
    )
  }
}

export default App;
