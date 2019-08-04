import React, { Component } from 'react';
import GalleryItem from './galleryItem.js';
import firebase from 'firebase';
import posed from 'react-pose';
import Button from '@material-ui/core/Button';
import JSZip from 'jszip/lib/index.js';
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'save-as';
import '../css/gallery.css';



class Gallery extends Component {

    constructor(props) {
      super(props);
      this.download = this.download.bind(this)
      this.accordionContent =[];
      this.state = {
        gallery: [],
        name: '',
        inputRefs: [],
        url: 'https://firebasestorage.googleapis.com/v0/b/blog-9b512.appspot.com/o/anon%2F-LjKZIYsDdaY2HRSlA-L%2FP2010444.jpg?alt=media&token=b60a5b86-a5ab-4e97-ac1c-69d80bbaa753'
      }
    }

    componentWillMount(){
      console.log(this.props);
    }

    setGallery(selection){
      let id = selection.id
      let _this = this
      firebase.database().ref('/posts/' + id).once('value').then((snapshot) => {
          let gallery = [];
          let galleryName = snapshot.val().galleryName;
          let username = snapshot.val().username;
          console.log(username);
          let userId = snapshot.val().userId;

              let images = snapshot.val().images;
                Object.entries(images).forEach(([key, value]) => {
                  gallery.push(value.url)
                });

        let reverseEntries = gallery.reverse()
        _this.setState({ gallery: reverseEntries, galleryName, headerVideoPlays: true })
      });
    }

    download() {

      let urls = this.props.gallery
      var zip = new JSZip();
      var count = 0;
      var zipFilename = this.props.name;

      urls.forEach(function(url){
      var filename = 'filename';
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(url, function (err, data) {
         if(err) {
            throw err; // or handle the error
         }
         zip.file(count + '.jpg', data, {binary:true});
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
    let url = this.state.url
      return(
        <div>
          <h1>{this.props.galleryName}</h1>
          <p> by {this.props.username}</p>

          <Button className='downloadButton' variant='outlined' onClick={this.download}>download images</Button>

          {this.state.gallery.map((item, i) =>
            <GalleryItem item={item} key={i}/>
          )}
        </div>
      )


  }
}

export default Gallery;
