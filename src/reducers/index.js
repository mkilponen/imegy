import {combineReducers} from 'redux';

const page = (page = 'home', action) => {
  if(action.type === 'SELECT_PAGE'){
    return action.payload.page
  }
  if(action.type === 'SET_GALLERY'){
    return 'gallery'
  }
  if(action.type === 'NEW_GALLERY'){
    return 'newGallery'
  }
  if(action.type === 'NEWUSER_LOGIN'){
    return 'home'
  }
  return page
}

//
const gallery = (gallery = null, action) => {
  if(action.type === 'SET_GALLERY'){
    return action.payload
  }
  return gallery
}

const newGallery = (gallery = [], action) => {
  if(action.type === 'NEW_GALLERY'){
    return action.payload
  }
  return gallery
}

//
const newUserLogIn = (username = null, action) => {
  if(action.type === 'NEWUSER_LOGIN'){
    return action.payload
  }
  return username
}

const user = (user = null, action) => {
  if(action.type === 'SET_USER'){
    return action.payload
  }
  return user
}

const loggedIn = (loggedIn = null, action) => {
  if(action.type === 'SET_USER'){
    if(action.payload === null){
      return false
    } else {
      return true
    }
  }
  else if(action.type === 'NEWUSER_LOGIN'){
    return true
  }
  return loggedIn
}

const username = (username = 'null', action) => {
  if(action.type === 'SET_USERNAME'){
    return action.payload
  }
  return username
}

const mobileDevice = (mobileDevice = null, action) => {
  if(action.type === 'SET_MOBILEDEVICE'){
    return action.payload
  }
  return mobileDevice
}
//

export default combineReducers({
  page,
  gallery,
  newGallery,
  newUserLogIn,
  user,
  loggedIn,
  username,
  mobileDevice
})
