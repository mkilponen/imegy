import React from 'react';
import Fade from 'react-reveal/Fade';
import { saveAs } from 'save-as';
import '../css/video.css';
import '../css/index.css';

export default function video(props){

  if(!props.theme){
    return null
  }

  else{
    let desktopBackground = props.theme.desktop.background
    let desktopHeader     = props.theme.desktop.header
    let mobileBackground  = props.theme.mobile.background
    let mobileHeader      = props.theme.mobile.header

    if(props.type === 'background'){
      return props.page === 'home' ?
        <Fade duration={150}>
          <video
           className='backgroundVideo'
           autoplay='autoplay'
           src={props.mobileDevice ? mobileBackground : desktopBackground}
           preload='auto'
           muted
           loop
           id='myVideo'>
           </video>
        </Fade> : null
    }

    else{
      return (
        <Fade top duration={300} when={props.page !== 'home'}>
          <video
           className='headerVideo'
           autoplay='autoplay'
           src={props.mobileDevice ? mobileHeader : desktopHeader}
           preload='auto'
           muted
           loop>
           </video>
           <div className="shadow"></div>
        </Fade>
      )

    }
  }

}
