import React, { Component } from 'react';
import posed from 'react-pose';




class PostEntrieItem extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    let height = this.props.item.data.image.height;
    let width = this.props.item.data.image.width;
    let orientation;

    if(height > width){
      orientation = "postEntrieItemImgTall"
    }
    else{
      orientation = "postEntrieItemImgWide"
    }

    if (this.props.item.data.postText === "null"){
      return (
        <div className="postEntrieContainer effect2">
          <img className={orientation} src={this.props.item.data.image.url}/>

        </div>
      )
    }
      return (
          <div className="postEntrieContainer effect1">
            <img className={orientation} src={this.props.item.data.image.url}/>
            <p className="description"><i>{this.props.item.data.description}</i></p>
            <p className="postText">{this.props.item.data.postText}</p>
          </div>
      )
  }
}

export default PostEntrieItem;
