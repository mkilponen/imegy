import React, { Component } from 'react';
import posed from 'react-pose';




class GalleryItem extends Component {

  constructor(props){
    super(props)
    this.state = {style: {}};
        this.onImgLoad = this.onImgLoad.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  onImgLoad({target:img}) {
        if(img.offsetWidth > img.offsetHeight){
          this.setState({style: {}})
        }
    }

    componentDidMount() {

      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {

      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {

      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }


  render(){
    const {style} = this.state.style;

    const divStyle = {
      maxHeight: '90vh',
      maxWidth: '90vw',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '20px',
      height: 'auto',
    };

    return (


              <img style={divStyle} onLoad={this.onImgLoad} src={this.props.item}/>
          
    )
  }
}

export default GalleryItem;
