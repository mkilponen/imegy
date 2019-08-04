import React, {Component} from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Downshift from 'downshift';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import SearchInput from './searchTextInput.js'
import firebase from 'firebase';
import '../css/searchBar.css';


class SearchBar extends Component {

  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      open: false,
      items : [],
      value: ''
    }
  }

  componentWillMount(){

    firebase.database().ref('/posts/').once('value').then((snapshot) => {
      let gallery = [];

          let ar = []
          snapshot.forEach((childSnap) => {
            let id = childSnap.key
            let galleryName = childSnap.val().galleryName

            ar.push({value: galleryName, id})
          })

          this.setState({items: ar})
          console.log(ar);
    });
  }

  handleChange(e){
    console.log(this.state.value);
    this.setState({value: e.target.value})
  }

  onFocus(){
    console.log('focus');
    this.setState({isOpen: true, value: ''})
  }

  onBlur(){
    console.log('blur');
    this.setState({isOpen: false,  value: ''})
  }

  onChange(gallery){
    if(gallery === null){
      return
    }

    this.setState({isOpen: false, value: ''})
    this.props.appState({gallery: gallery, page: 'gallery'})
  }

  render(){

    return(
      <div className="downshift" >
              <SearchInput
              searchBarStyle={this.props.searchBarStyle}
              value={this.state.value}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              isOpen={this.state.isOpen}
              items={this.state.items}
              handleChange={this.handleChange}
              onChange={this.onChange}/>
      </div>
    )
  }
}
export default SearchBar
