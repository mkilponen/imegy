import React from 'react';
import { fade, withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Downshift from 'downshift';
import MenuItem from '@material-ui/core/MenuItem';
import { green } from '@material-ui/core/colors';
import '../css/searchBar.css';


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
    margin: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

function stateReducer(state, changes) {
  // this prevents the menu from being closed when the user
  // selects an item with a keyboard or mouse
  console.log(changes.type)
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

export default function CustomizedInputs(props) {
  const classes = useStyles();
  const style = props.searchBarStyle;

  return (
    <div className={classes.root}>
    <Downshift
      stateReducer={stateReducer}
      onClick={() => console.log('click')}
      onChange={gallery => props.onChange(gallery)}
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
            <CssTextField
              placeholder='Search for galleries...'
              value={props.value}
              className={classes.margin}
              InputProps={{
                  style: {color: style.textColor, width: props.mobileDevice ? '200%' : 400}
              }}
              InputLabelProps={{
                    style: {color: style.placeHolderColor}
              }}
              {...getInputProps({onBlur: props.onBlur, onChange: clearSelection, onFocus: openMenu})}
            />



          <Paper {...getMenuProps()}  className="paper" style={{backgroundColor: props.searchBarStyle.paperColor}}>
              {
                isOpen
                ? props.items.filter(item => !inputValue || item.value.includes(inputValue))
                    .map((item, index) => (
                      <MenuItem
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          onChange: clearSelection

                        })}
                        style={{color: style.menuItemColor}}
                      >
                      <div>
                        <p style={{display: 'block', marginBottom: 0, marginTop: 0}}>{item.value}</p>
                        <p style={{color: '#969696',display: 'block', fontSize: 12, marginBottom: 0, marginTop: 0}}>by {item.owner}</p>
                        </div>
                      </MenuItem>
                    ))
                : null}
            </Paper>
          </div>
        )}
</Downshift>


    </div>
  );
}
