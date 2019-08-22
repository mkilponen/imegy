import React, {useState, useEffect} from 'react';
import '../css/newGallery.css';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Fade from 'react-reveal/Fade';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faTrash)

export default function preview(props) {

  const [reveal, setReveal] = useState(false)
  let filename = props.item.fileName
  if(filename.length > 8) {
    filename = filename.substring(0,8) + filename.substring(filename.length - 4,filename.length);
  }

  useEffect(() => {
    setReveal(true)
  }, [])

  return (
    <div className='previewContainer'>
    <Fade cascade delay={100} when={reveal}>
      <Paper>
          <p className='fileName'>{filename}</p>
          <Button style={{position: 'relative', float: 'right'}} onClick={props.removeImage} variant='outlined' >
            <FontAwesomeIcon  className='deleteIcon' icon='trash'  />
          </Button>
          <div className='imageContainer'>
            <img className="image" src={props.url}/>
          </div>
        </Paper>
        </Fade>
    </div>
)

}
