import React from 'react';

//components
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../css/navigation.css';
import {connect} from 'react-redux'
import {setPage} from '../actions'
library.add(faBars)

const NavigationMobile = (props) => {

  function signOut(){
    firebase.auth().signOut().then(function() {
      //rerender non signed in view and default homepage
      props.setPage('home')
    }, function(error) {
      console.log(error);
    });
  }

  const useStyles = makeStyles({
    list: {
      width: 250
    },
    fullList: {
      width: 'auto',
    },
  });

  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };
  const loggedIn =  [{text: 'home', page: 'home'}, {text: 'new gallery', page: 'newGallery'}, {text: 'my galleries', page: 'user'}, {text: 'about', page: 'about'}  ]
  const loggedOut = [{text: 'home', page: 'home'}, {text: 'new gallery', page: 'newGallery'}, {text: 'about', page: 'about'}  ]


  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >

      <List>
        {props.loggedIn ?
          <div>
            {loggedIn.map((item, index) => (
            <ListItem button key={item.text} onClick={() => props.setPage(item.page)}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            ))}
            <Divider />
            <List>
                <ListItem button  onClick={() => signOut()}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={'sign out'} />
                </ListItem>
            </List>
          </div>

          :

          <div>
            {loggedOut.map((item, index) => (
            <ListItem button key={item.text} onClick={() => props.setPage(item.page)}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            ))}
          <Divider />
          <List>
              <ListItem button  >
                <ListItemIcon></ListItemIcon>
                <ListItemText primary={'sign in'} onClick={() => props.setPage('signIn')}/>
              </ListItem>
              <ListItem button >
                <ListItemIcon></ListItemIcon>
                <ListItemText primary={'sign up'} onClick={() => props.setPage('signUp')}/>
              </ListItem>
          </List>
          </div>}
      </List>
    </div>
  );

  return (
    <div className="hamburger">
      <Button onClick={toggleDrawer('right', true)} >
        <FontAwesomeIcon style={{color: 'white', display: 'inline', marginLeft: 5}} icon={faBars}/>
      </Button>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
        {sideList('right')}
      </Drawer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    mobileDevice: state.mobileDevice,
    loggedIn: state.loggedIn,
    setPage: setPage
  }
}

export default connect(mapStateToProps, {setPage})(NavigationMobile)
