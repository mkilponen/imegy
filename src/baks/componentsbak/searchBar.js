import React, {Component} from 'react';
import SearchInput from './searchTextInput.js'
import firebase from 'firebase';
import '../css/searchBar.css';


class SearchBar extends Component {

  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      open: false,
      items : [],
      value: ''
    }
  }

  componentWillMount(){

    //get all galleries
    firebase.database().ref('/galleries/').once('value').then((snapshot) => {

          let ar = []
          snapshot.forEach((childSnap) => {
            let id = childSnap.key
            let galleryName = childSnap.val().galleryName
            let owner = childSnap.val().username
            
            ar.push({value: galleryName, id, owner})
          })
          this.setState({items: ar})
    });
  }

  handleChange(e){
    this.setState({value: e.target.value})
  }

  onChange(gallery){
    if(gallery === null){
      return
    }
    this.props.getGallery(gallery.id)
  }

  render(){

    return(
      <div className="downshift" >
          <SearchInput
          mobileDevice={this.props.mobileDevice}
          searchBarStyle={this.props.searchBarStyle}
          value={this.state.value}
          items={this.state.items}
          handleChange={this.handleChange}
          onChange={this.onChange}/>
      </div>
    )
  }
}
export default SearchBar
