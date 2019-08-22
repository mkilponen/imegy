import React, { useState, useEffect } from 'react';

//components
import NewGallery from './components/newGallery.js';
import SignIn from './components/signIn.js';
import SearchBar from './components/searchBar.js';
import SignUp from './components/signUp.js';
import Video from './components/video.js';
import User from './components/user.js';
import Gallery from './components/gallery.js';
import NavigationMobile from './components/navigationMobile.js';

//other
import firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUpload } from '@fortawesome/free-solid-svg-icons';
import _ from 'underscore'
import Fade from 'react-reveal/Fade';
import imagesToArray from './js/imagesToArray'
import videoTheme from './js/videoTheme'


//redux
import {connect} from 'react-redux'
import {setPage,
        setGallery,
        newGallery,
        setUser,
        setMobileDevice
} from './actions'

//css
import './css/index.css';
import './css/navigation.css';
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

const App = (props) => {

    const [reveal, setReveal]                   = useState(true)
    const [revealText, setRevealText]           = useState(true)
    const [newUserUsername, setNewUserUsername] = useState('')
    const [theme, setTheme]                     = useState(null)

    useEffect(() => {
      let themeFunc = videoTheme()
      let theme = themeFunc
      setTheme(theme)
    }, [])

    //log in observer
    useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log('auth change');
        if (user) {
          props.setPage('home')
          props.setUser(user)
        } else {
          props.setUser(null)
        }
      });
    }, [])

    //helper effect for log in: runs after props.user changes or newUserUsername changeImagesOrder
    //if user is signed in, either push (new) user to firebase or run displayname check
    //also sets sign in form closed
    useEffect(() => {
      if(props.user){
        firebase.database().ref('/users/' + props.user.uid).orderByKey().once('value').then((snapshot) => {
                let snapshotVal = snapshot.val();

                //in case of new user creation push new node to newUserUsername
                //newUserUsername is from the typed in username
                if(snapshotVal === null){
                  firebase.database().ref().child('users/' + props.user.uid).set({
                    email: props.user.email, username: newUserUsername
                  });
                }
                //check if user has displayname, if not: set it from existing firebase node
                else{
                  if(!props.user.displayName){
                    props.user.updateProfile({
                      displayName: snapshotVal.username
                    })
                  }
                }
        });
      }
    }, [props.user, newUserUsername])

    //detect mobiledevice or desktop device
    useEffect(() => {
      window.innerWidth < 800 ? props.setMobileDevice(true) : props.setMobileDevice(false)
    }, [props.mobileDevice])

    //helper for mobiledevie seteter, set resize listener
    window.addEventListener("resize", _.throttle(() => {
      window.innerWidth < 800 ? props.setMobileDevice(true) : props.setMobileDevice(false)
    }, 500));

    //this bypasses a problem with react reveal where text is returned
    //as spans letter by letter, thus making text break mid word with certain breakpoints
    useEffect(() => {
      setReveal(true)
      setTimeout(function(){
        setRevealText(false)
      }, 1000);
    }, [])



    const getGallery = gallery => {
      if(!gallery){
        return
      }
      let galleryId = gallery.id;
      firebase.database().ref('/galleries/' + galleryId).once('value').then((snapshot) => {

          //requested gallery not found
          let value = snapshot.val()
          if(!snapshot.val()){
            return
          }

          let array = [];
          let galleryName = value.galleryName;
          let owner = value.username;
          let remove = value.deleteNow;
          let images = snapshot.val().images;

                Object.entries(images).forEach(([key, value]) => {
                  array.push({url: value.url, fileName: value.fileName})
                });

          let reverseEntries = array.reverse()
          props.setGallery({
            galleryImages: reverseEntries,
            galleryName: galleryName,
            owner: owner
          })

        // if gallery is set to one time read only, remove gallery
        if(remove){
          firebase.database().ref('/galleries/' + galleryId).remove()
        }
      });
    }

    //for first view destruct galleries
    useEffect(() => {
      var url = window.location.href;
      var galleryIdRequest = url.replace('https://blog-9b512.firebaseapp.com/', '');
      if(galleryIdRequest.length !== 0){
        getGallery({id: galleryIdRequest})
      }
    })

    const uploadImages = (e) => {
      let images = imagesToArray(e)
      props.newGallery(images)
    }

    //page navigator
    let pageNav = props.page;
    switch (props.page) {
      case 'gallery':
        pageNav = <Gallery/>
        break;
      case 'newGallery':
        pageNav = <NewGallery uploadImages={(e) => uploadImages(e)} />
        break;
      case 'home':
        pageNav = <div className="mediumContainer">

                    {revealText ?
                      <Fade left cascade duration={500} delay={150}>
                        <h1 className='textShadow white center'>welcome to imegy</h1>
                      </Fade> :
                      <h1 className='textShadow white center'>welcome to imegy</h1>}

                    {revealText ?
                      <Fade right cascade duration={500} delay={230}>
                        <h3 className='textShadow white center'>Share, download and display images in a quick and easy manner</h3>
                      </Fade> :
                      <h3 className='textShadow white center'>Share, download and display images in a quick and easy manner</h3>}

                    <label className='custom-file-upload '>
                      <input style={{display: 'none'}} type='file' name='file' onChange={(e) => uploadImages(e)}  multiple/>
                        <div className='buttonWrap'>
                            <Fade left cascade delay={270}>
                            <p className='buttonText buttonTextShadow white'>upload images</p>
                            </Fade>
                            <Fade right cascade delay={330}>
                            <FontAwesomeIcon className='faUpload' icon={faUpload}/>
                            </Fade>
                        </div>
                    </label>

                </div>
        break;
      case 'signUp':
        pageNav = <SignUp setNewUserUsername={(val) => setNewUserUsername(val)}/>
        break;
      case 'signIn':
        pageNav = <SignIn/>
        break;
      case 'about':
        pageNav = <div className="mediumContainer">
                  <Fade duration={450}>

                  <div className="articleContainer">
                    <h1 className="center" style={{marginBottom: 30, marginTop: 0}}>About</h1>
                    <p style={{marginBottom: 20}}>
                    Imegy is a React/Firebase webapp for slick and easy image sharing.
                    It serves as a sandbox to test out cutting edge React features, libraries and other tools.
                    What I'm after is great UI and UX, while providing reliable functionalities. Here are some steps for future development:
                    </p>
                    <p style={{textDecoration: 'line-through'}}>Fix some known bugs</p>
                    <p style={{textDecoration: 'line-through'}}>Implement more responsiveness to elements</p>
                    <p style={{textDecoration: 'line-through'}}>Implement redux</p>
                    <p style={{textDecoration: 'line-through'}}>Rewrite the entire app with React Hooks</p>
                    <p>Implement Google Material Design with the new hooks</p>
                    <p>Implement React Router</p>
                    <p>Fix bugs with various field validations</p>
                    <p>Polish the general design and composition of the app</p>
                    <p>Polish git, implement proper documentation</p>
                    <p>Polish the animations</p>
                  </div>
                  </Fade>
                </div>
        break;
      case 'user':
        pageNav = <User user={props.user}/>
        break;
      default:
      break;
    }

    if(!theme){
      return null
    }
    else{
      return (
        <div className="appContainer" style={{backgroundImage: props.page === 'home' ? theme.desktop.color : null}}>

            {/*<Video type={'background'} page={props.page} theme={theme} mobileDevice={props.mobileDevice}/> */}
            <Fade top>
            <div className={props.mobileDevice && props.page !== 'home' ? 'headerContainer headerShadow' : 'headerContainer' }>


                    <Video type={'header'} page={props.page} theme={theme} mobileDevice={props.mobileDevice}/>
                    <SearchBar getGallery={(value) => getGallery(value)}/>

                    <Fade cascade>

                        <div className='navigationDesktop'>
                         <p className='navigation white' name='about' onClick={() => props.setPage('home')}>home</p>
                         <p className='navigation white' name='about' onClick={() => props.setPage('about')}>about</p>
                         <input accept="image/*" style={{display: 'none'}} id="contained-button-file" multiple type="file" onChange={(e) => uploadImages(e)}/>
                         <label htmlFor="contained-button-file">
                             <p className='navigation white'  name='about'>new gallery</p>
                         </label>
                         {props.loggedIn ?        <p className='navigation white' onClick={() => props.setPage('user')}>my galleries</p> : null}
                         {props.loggedIn ? null : <p className='navigation white' onClick={() => props.setPage('signUp')}>sign up</p>}
                         <SignIn/>
                       </div>
                    </Fade>

                    <NavigationMobile/>
            </div>
            </Fade>
            <div className='pageContainer'>
              <Fade duration={180}>
              {pageNav}
              </Fade>
            </div>
        </div>
      )
    }
}
const mapStateToProps = (state) => {
  return {
    newGallery: newGallery,
    setGallery: setGallery,
    page: state.page,
    loggedIn: state.loggedIn,
    user: state.user,
    mobileDevice: state.mobileDevice
  }
}
export default connect(mapStateToProps, {
  newGallery,
  setPage,
  setGallery,
  setUser,
  setMobileDevice
})(App)
