const setPage = (page) => {
  return {
    type: 'SELECT_PAGE',
    payload: {
      page: page
    }
  }
}
const setGallery = (gallery) => {
  return {
    type: 'SET_GALLERY',
    payload: gallery
  }
}
const newGallery = (gallery) => {
  return {
    type: 'NEW_GALLERY',
    payload: gallery
  }
}
const setMobileDevice = (bool) => {
  return {
    type: 'SET_MOBILEDEVICE',
    payload: bool
  }
}

/////////////////
const newUserLogIn = (username) => {
  return {
    type: 'NEWUSER_LOGIN',
    payload: username
  }
}
const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: user
  }
}
const setUsername = (user) => {
  console.log('action', user);
  return {
    type: 'SET_USERNAME',
    payload: user
  }
}


///////////////
module.exports = {
  setPage,
  setGallery,
  newGallery,
  newUserLogIn,
  setUser,
  setUsername,
  setMobileDevice
}
