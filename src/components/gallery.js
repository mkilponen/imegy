import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import JSZip from 'jszip/lib/index.js';
import JSZipUtils from 'jszip-utils'
import GalleryImage from './galleryImage.js';
import Fade from 'react-reveal/Fade';
import { saveAs } from 'save-as';
import '../css/gallery.css';
import '../css/index.css';

//redux
import {connect} from 'react-redux'


const Gallery = (props) =>  {

    const [gallery, setGallery] = useState([])

    function download() {
      let urls = gallery
      var zip = new JSZip();
      var count = 0;
      var zipFilename = props.galleryName;

      urls.forEach((url) => {
        var filename = url.fileName;

        // loading a file
        JSZipUtils.getBinaryContent(url, (err, data) => {
           if(err) {throw err}

           //add file to zip
           zip.file(filename, data, {binary:true});
           count++;
           if (count === urls.length) {
             zip.generateAsync({type:'blob'}).then((content) => {
                saveAs(content, zipFilename);
             });
          }
        });
      });
    }


    useEffect(() => {
      console.log(props.gallery);
      setGallery(props.gallery)
    }, [props.gallery])


    if(props.gallery.length === 0){
      return(
        <h3 className="center">The requested gallery does not exist</h3>
      )
    }
    else{
        return(
          <div>
          <Fade >
            <h2 className="center" style={{marginBottom: 0}}>{props.galleryName}</h2>
            <h3 className="center" style={{color: '#888e94'}}>by {props.owner}</h3>
            <Button onLoad={() => console.log('onload')} className='downloadButton' variant='outlined' onClick={() => download()}>download gallery as .zip</Button>
          </Fade>
            {gallery.map((item, i) =>
              <Fade>
                <GalleryImage src={item.url}/>
              </Fade>
            )}
          </div>
        )
    }
}
const mapStateToProps = (state) => {
  console.log(state);
  return {
    gallery: state.gallery.galleryImages,
    galleryName: state.gallery.galleryName,
    owner: state.gallery.owner,
  }
}
export default connect(mapStateToProps, {})(Gallery)
