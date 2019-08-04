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

export default function CustomizedInputs(props) {
  const classes = useStyles();
  const style = props.searchBarStyle;

  return (
    <div className={classes.root}>
    <Downshift

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
        }) => (
          <div>
            <CssTextField
              placeholder='Search for galleries...'
              value={props.value}
              onFocus={props.onFocus}
              className={classes.margin}
              InputProps={{
                  style: {color: style.textColor, }
              }}
              InputLabelProps={{
                    style: {color: style.placeHolderColor}
              }}
              {...getInputProps({onBlur: props.onBlur, onChange: clearSelection})}
            />



          <Paper {...getMenuProps()} style={{zIndex: 2, backgroundColor: style.paperColor}}>
              {props.isOpen
                ? props.items
                  .filter(item => !inputValue || item.value.includes(inputValue))
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
                        {item.value}
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
