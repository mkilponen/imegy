import React, { Component } from 'react';
import firebase from 'firebase';
import posed from 'react-pose';
import Button from '@material-ui/core/Button';
import JSZip from 'jszip/lib/index.js';
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'save-as';
import BounceLoader from 'react-spinners/BounceLoader';
import '../css/gallery.css';



class Gallery extends Component {

    constructor(props) {
      super(props);
      this.download = this.download.bind(this)
      this.accordionContent =[];
      this.state = {
        noGallery: null,
        url: 'https://firebasestorage.googleapis.com/v0/b/blog-9b512.appspot.com/o/anon%2F-LjKZIYsDdaY2HRSlA-L%2FP2010444.jpg?alt=media&token=b60a5b86-a5ab-4e97-ac1c-69d80bbaa753'
      }
    }

    download() {
      let urls = this.props.gallery.galleryImages
      var zip = new JSZip();
      var count = 0;
      var zipFilename = this.props.name;

      urls.forEach(function(url){
      var filename = url.fileName;
      console.log(filename);
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(url, function (err, data) {
         if(err) {
            throw err; // or handle the error
         }
         zip.file(filename, data, {binary:true});
         count++;
         if (count == urls.length) {
           zip.generateAsync({type:'blob'}).then(function(content) {
              saveAs(content, zipFilename);
           });
        }
      });
      });
}


  render(){
    console.log('gallery render');
    if(this.props.gallery.galleryImages.length === 0){
      return(
        <h3 className="center">The requested gallery does not exist</h3>
      )
    }
    else{
      let url = this.state.url
        return(
          <div>
            <h2 className="center">{this.props.gallery.galleryName}</h2>
            <p className="center" style={{marginBottom: 30}}> by {this.props.gallery.owner}</p>

            <Button className='downloadButton' variant='outlined' onClick={this.download}>download gallery</Button>

            {this.props.gallery.galleryImages.map((item, i) =>
              <img className="galleryImage" src={item.url}/>
            )}
          </div>
        )
    }



  }
}

export default Gallery;
