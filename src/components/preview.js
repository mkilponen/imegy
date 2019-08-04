import React, { Component } from 'react';
import '../css/newGallery.css';

import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import Paper from '@material-ui/core/Paper';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import Select from '@material-ui/core/Select';
library.add(faTrash)

class Preview extends Component {

constructor(props){
  super(props);
  this.state = {
    value: this.props.index,
    row: false
  }
  this.selectIndex = this.selectIndex.bind(this)
  this.selectDisplay = this.selectDisplay.bind(this)
}

componentWillMount(){
  console.log(this.props);
  this.setState({value: this.props.index + 1, index: this.props.index + 1 })
}

selectIndex(event){
  let newIndex = event.target.value - 1
  let oldIndex = this.state.value - 1

  //create a mutable version of props.images
  let ar = [];
  this.props.images.map((item) => ar.push(item))

  //swap image indexes and call the changer function from props
  let temp = ar[oldIndex]
  ar[oldIndex] = ar[newIndex]
  ar[newIndex] = temp
  this.props.changeImagesOrder(ar)
}


selectDisplay(event){

  switch (event.target.name) {
    case 'selectDisplay':
      let value = event.target.value
    //  this.props.changeImageArray(value, this.props.index)
      break;
    default:
  }
}

render(){
  let url = 'url(' + this.props.url + ')'

  let filename = this.props.item.fileName
  if(filename.length > 8) {
    filename = filename.substring(0,8) + filename.substring(filename.length - 4,filename.length);
  }


  return (

    <div className='previewContainer'>
      <Paper>
          <p className='fileName'>{filename}</p>
          <Button style={{position: 'relative', float: 'right'}} onClick={this.props.removeImage} variant='outlined' >
            <FontAwesomeIcon  className='deleteIcon' icon='trash'  />
          </Button>
          <div className='imageContainer'>
            <img className="image" src={this.props.url}/>
          </div>

            {/* Going to implement a drag and drop system
              <NativeSelect className='selectIndex' name='selectIndex' value={this.state.index} onChange={this.selectIndex}>
                  {this.props.images.map((item, i ) => {
                    return <option style={{zIndex: 10}} item={item} key={i}>{i+1}</option>
                  })}
              </NativeSelect> */}





          {/*  <NativeSelect name='selectDisplay' value={this.state.display} onChange={this.selectDisplay}>
                <option>Row</option>
                <option>List</option>
            </NativeSelect> */ }

        </Paper>
    </div>

)
}
}

export default Preview;
