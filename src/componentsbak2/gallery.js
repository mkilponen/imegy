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
        gallery: [],
        name: '',
        loading: false,
        inputRefs: [],
        noGallery: null,
        url: 'https://firebasestorage.googleapis.com/v0/b/blog-9b512.appspot.com/o/anon%2F-LjKZIYsDdaY2HRSlA-L%2FP2010444.jpg?alt=media&token=b60a5b86-a5ab-4e97-ac1c-69d80bbaa753'
      }
    }

    componentWillMount(){
      let _this = this
      let galleryId = this.props.galleryId
      firebase.database().ref('/galleries/' + galleryId).once('value').then((snapshot) => {

          let val = snapshot.val()
          if(val === null){
            this.setState({noGallery: true})

            return
          }

          let gallery = [];
          let galleryName = val.galleryName;
          let owner = val.username;
          let userId = val.userId;
          let remove = val.deleteNow;
          console.log('remove', remove);

              let images = snapshot.val().images;
                Object.entries(images).forEach(([key, value]) => {
                  gallery.push(value.url)
                });

        let reverseEntries = gallery.reverse()
        _this.setState({ gallery: reverseEntries, galleryName, owner })

        if(remove){
          firebase.database().ref('/galleries/' + galleryId).remove()
          console.log(owner);

        }
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

    if(this.state.noGallery){
      return(
        <h3>Gallery does not exist</h3>
      )
    }
    else{
      let url = this.state.url
        return(
          <div>
            <h2 className="title">{this.state.galleryName}</h2>
            <p style={{marginBottom: 30, color: '#5e5e5e'}}> by {this.state.owner}</p>

            <Button className='downloadButton' variant='outlined' onClick={this.download}>download gallery</Button>

            {this.state.gallery.map((item, i) =>
              <img className="galleryImage" src={item}/>
            )}
          </div>
        )
    }



  }
}

export default Gallery;
