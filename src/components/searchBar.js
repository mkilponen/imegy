import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Downshift from 'downshift';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from 'react-reveal/Fade';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase';
import '../css/searchBar.css';
import {connect} from 'react-redux'

const SearchBar = (props) => {

  //this component needs some tidying up...

  const [items, setItems] = useState([])
  const [value, setValue] = useState(null)

  useEffect(() => {
      //get all galleries
      firebase.database().ref('/galleries/').once('value').then((snapshot) => {

            let ar = []
            snapshot.forEach((childSnap) => {
              let id = childSnap.key
              let galleryName = childSnap.val().galleryName
              let owner = childSnap.val().username
              ar.push({value: galleryName, id, owner})
            })
            setItems(ar)
      });
  }, [])


  const CssTextField = withStyles({
    root: {
    },
  })(TextField);

  const useStyles = makeStyles(theme => ({
    root: {
      overflow: 'hidden',
      borderRadius: 4,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
      },
      '&$focused': {
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.primary.main,
      },
    },
    margin: {
      margin: 8,
    },
  }));


  function stateReducer(state, changes) {
    // this prevents the menu from being closed when the user
    // selects an item with a keyboard or mouse
    switch (changes.type) {

      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: false,
          highlightedIndex: state.highlightedIndex,
        }
      default:
        return changes
    }
  }

  const classes = useStyles();
  const style = props.searchBarStyle;

  return (
    <div className='downshift'>
    <Downshift

      stateReducer={stateReducer}
      onClick={() => console.log('click')}
      onChange={gallery => props.getGallery(gallery)}
      itemToString={item => (item ? item.value : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          clearSelection,
          highlightedIndex,
          openMenu
        }) => (
          <div>
            <TextField
              placeholder='Search for galleries...'
              value={props.value}
              InputProps={{
                  style: {color: 'white',margin: 8, width: props.mobileDevice ? '100%' : 300}
              }}
              InputLabelProps={{
                    style: {color: 'white'}
              }}
              {...getInputProps({onBlur: props.onBlur, onChange: clearSelection, onFocus: openMenu})}
            />

            <Paper {...getMenuProps()} className="paper">
                {
                  isOpen
                  ? items.filter(item => !inputValue || item.value.includes(inputValue))
                      .map((item, index) => (
                        <Fade top cascade duration={150}>
                        <MenuItem
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            onChange: clearSelection

                          })}
                          style={{color: 'black', zIndex: '120 !important'}}
                        >
                        <div>
                          <p style={{display: 'block', marginBottom: 0, marginTop: 0}}>{item.value}</p>
                          <p className="owner">by {item.owner}</p>
                          </div>
                        </MenuItem>
                        </Fade>
                      ))
                  : null}
              </Paper>
          </div>
        )}
</Downshift>
</div>
  );
}

const mapStateToProps = (state) => {
  return {
    mobileDevice: state.mobileDevice
  }
}

export default connect(mapStateToProps, {})(SearchBar)
