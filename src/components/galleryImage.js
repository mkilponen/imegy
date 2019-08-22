import React, { useState, useEffect } from 'react';
import ImageOnLoad from 'react-image-onload';
import '../css/gallery.css';
import '../css/index.css';


const GalleryImage = (props) =>  {

    const [loaded, setLoaded] = useState('none')


    useEffect(() => {
      return () => setLoaded('none');
    }, [])

    return(
          <ImageOnLoad
            onLoad={() => setLoaded('block')}
            src={props.src}
            style={{display: loaded}}
            className="galleryImage"
            alt="background image"
        />
        )
}

export default GalleryImage
