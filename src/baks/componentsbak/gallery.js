import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import JSZip from 'jszip/lib/index.js';
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'save-as';
import '../css/gallery.css';
import '../css/index.css';

class Gallery extends Component {

    constructor(props) {
      super(props);
      this.download = this.download.bind(this)
      this.state = {
      }
    }

    download() {
      let urls = this.props.gallery.galleryImages
      var zip = new JSZip();
      var count = 0;
      var zipFilename = this.props.name;

      urls.forEach(function(url){
      var filename = url.fileName;

      // loading a file
      JSZipUtils.getBinaryContent(url, function (err, data) {
         if(err) {
            throw err; // or handle the error
         }

         //add file to zip
         zip.file(filename, data, {binary:true});
         count++;
         if (count === urls.length) {
           zip.generateAsync({type:'blob'}).then(function(content) {
              saveAs(content, zipFilename);
           });
        }
      });
      });
}


  render(){

    if(this.props.gallery.galleryImages.length === 0){
      return(
        <h3 className="center">The requested gallery does not exist</h3>
      )
    }
    else{
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
