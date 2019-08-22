import Snowing from '../media/snow.mp4'
import SnowingHeader from '../media/snowheader.mp4'
import SnowingMobile from '../media/snowmobile.mp4'
import SnowingMobileHeader from '../media/snowmobileheader.mp4'

import BlueVid from '../media/blue.mp4'
import BlueVidHeader from '../media/blueheader.mp4'
import BlueVidMobile from '../media/bluemobile.mp4'
import BlueVidMobileHeader from '../media/bluemobileheader.mp4'

import Autumn from '../media/autumn.mp4'
import AutumnHeader from '../media/autumnheader.mp4'
import AutumnMobile from '../media/autumnmobile.mp4'
import AutumnMobileHeader from '../media/autumnmobileheader.mp4'
//import Abstract from './media/abstract.mp4'
//import AbstractHeader from './media/abstractheader.mp4'
//import AbstractMobile from './media/abstractmobile.mp4'
//import AbstractMobileHeader from './media/abstractmobileheader.mp4'


export default function videoTheme(){
  //set video background
  let videos = [ Snowing, BlueVid, Autumn ]
//  let video = videos[Math.floor(Math.random() * 3)]
  let video = Snowing

  switch (video) {
    case '/static/media/snow.6a9251eb.mp4':
        //snowing video
        return {
          desktop: {
            color: 'linear-gradient(to top, #112933, #1a323c, #223c46, #2b454f, #344f59, #3e5963, #49636d, #536e78, #627c85, #708a92, #80989f, #8fa6ad)',
            background: Snowing,
            header:SnowingHeader
          },
          mobile: {
            background: SnowingMobile,
            header: SnowingMobileHeader,
          }
        }
    break;
    case '/static/media/blue.29d6f388.mp4' :
      //blue and black ink video
      return {
        desktop: {
          color: 'linear-gradient(to top, #08005a, #0b1366, #102372, #18327c, #224086, #1e5597, #2069a7, #2b7eb5, #399fca, #58bfdc, #7edfeb, #aafffb)',
          background: BlueVid,
          header:BlueVidHeader
        },
        mobile: {
          background: BlueVidMobile,
          header: BlueVidMobileHeader,
        }
      }
    break;
    case '/static/media/autumn.e994f831.mp4' :
      //autumn video
      return {
        desktop: {
          color: 'linear-gradient(to top, #362a14, #423216, #503a19, #5d421b, #6c4a1e, #7d5627, #8e6230, #a06f39, #b7844a, #cf9a5b, #e7b16d, #ffc880)',
          background: Autumn,
          header:AutumnHeader
        },
        mobile: {
          background: AutumnMobile,
          header: AutumnMobileHeader,
        }
      }
    break;
    default:
    break;
  }
}
