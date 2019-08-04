import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import '../css/signIn.css';
library.add(faBars)


const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer(props) {
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
            {[{text: 'home', page: 'welcome'}, {text: 'new gallery', page: 'newGallery'}, {text: 'my galleries', page: 'user'}, {text: 'about', page: 'about'}  ].map((item, index) => (
            <ListItem button key={item.text} onClick={() => props.appState({page: item.page, headerVideoPlays: true})}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            ))}
            <List>
                <ListItem button  onClick={() => props.signOut()}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={'sign out'} />
                </ListItem>
            </List>
          </div>

          :

          <div>
            {[{text: 'home', page: 'welcome'}, {text: 'new gallery', page: 'newGallery'}, {text: 'about', page: 'about'}  ].map((item, index) => (
            <ListItem button key={item.text} onClick={() => props.appState({page: item.page, headerVideoPlays: item.page === 'welcome' ? false : true})}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            ))}
          <Divider />
          <List>
                <ListItem button  >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={'sign in'} onClick={() => props.appState({page: 'signIn', headerVideoPlays: true})}/>
                </ListItem>
                <ListItem button >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={'sign up'} onClick={() => props.appState({page: 'signUp', headerVideoPlays: true})}/>
                </ListItem>
          </List>
          </div>
      }
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
