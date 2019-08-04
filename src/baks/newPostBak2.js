import React, { Component } from 'react';
import firebase from 'firebase';
import { css } from '@emotion/core';
import '../css/newPost.css';
import Preview from './preview.js';
// First way to import
// Another way to import
import PulseLoader from 'react-spinners/PulseLoader';

class NewPost extends Component {

  constructor(props) {
    super(props);
    this.eventHandler = this.eventHandler.bind(this);
    this.state = {
                 fileName: "",
                 description: "",
                 postText: "",
                 loading: false,
                 images: [],
                 wait: "",
                 asd: [{asd: 'asd'},{asd: 'asd'}]
                 }
  }

  componentWillMount(){
    console.log('asd');
  }

  eventHandler(e){
    //save new post events to state
    let value = e.target.value;
    let _this = this;
    switch (e.target.name) {

      case 'description':
        this.setState({ description: value })
      break;

      case 'file':


          let arr = [];
          for(let i=0; i < e.target.files.length; i++){
            console.log(arr);
            let file = e.target.files[i];
            let fileName = e.target.files[i].name;
            let reader = new FileReader();

            reader.onload = function(evt) {

                  let image = new Image();
                  image.src = evt.target.result;

                   image.onload = function() {

                      let width = this.width;
                      let height = this.height;
                      let url = URL.createObjectURL(file);
                      let imageObject = {
                        file: file,
                        url: url,
                        fileName: fileName,
                        dimensions: {width: width, height: height},
                      }
                      arr.push(imageObject)
                  };
            };
           reader.readAsDataURL(file);
          }


          this.setState({ images: arr });

      break;

      case 'textarea':
          this.setState({ postText: value })
      break;

      case 'submit':
          e.preventDefault();
          let images = this.state.images;
          const userId = this.props.user.id;

                var postData = {
                  userId: userId,
                  description: this.state.description,
                  postText: this.state.postText,
                };

                var newPostKey = firebase.database().ref().child('posts').push().key;
                var updates = {};
                updates['/posts/'+ newPostKey] = postData;


                firebase.database().ref().update(updates)
                .then(() => _this.setState({loading: true}))
                .then(() => loop())
                .then(() => _this.setState({loading: false}))


                let loop = async () => {
                    for (let image of images) {
                        var file = image.file;
                        var fileName = image.fileName;
                        await  uploadImage(file, fileName);
                    }
                }


                let uploadImage = async (file, fileName) =>  {

                        return new Promise((resolve, reject) => {

                          var storageRef = firebase.storage().ref(userId + "/" + newPostKey + "/" + fileName);
                          var task = storageRef.put(file);

                          task.on('state_changed', function progress(snapshot){}, function error(err){console.log(err)}, function complete(){

                                     task.snapshot.ref.getDownloadURL().then((downloadURL) =>  {
                                        console.log(downloadURL);
                                        var imgData = {
                                          fileName: fileName,
                                          url: downloadURL,
                                        };

                                        var newImageKey = firebase.database().ref().child('posts/' + newPostKey + "/images/").push().key;
                                        var updates = {};
                                        updates['/posts/'+ newPostKey + "/images/" +  newImageKey] = imgData;
                                        firebase.database().ref().update(updates);
                                        resolve(downloadURL)
                                      });
                          })
                        });
                }

      break;
    }
  }

render(){


  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    position: relative;
    left:45%;
    right:45%;
`;
    if(this.state.loading){
      return (
        <div>
        <PulseLoader
        //  css={override}
          sizeUnit={"px"}
          size={15}
          color={'#123abc'}
          loading={this.state.loading}
        />
        <p>{this.state.wait}</p>
        </div>
      )
    }

    else{
  
      return (
        <div className="newPostContainer">
          <span classNme="spanFont">Current blog: </span>
          <span classNme="spanFont">reiccublog</span>
          <form onSubmit={this.eventHandler} className="effect1" name="submit">

              <label class="custom-file-upload">
                  <input  type="file" name="file" onChange={this.eventHandler} id="file" multiple/>
                   <p className="submitButtonText">upload</p>
              </label>



              <label className="formRow">
                <input type="text" className="formRow" name="description" onChange={this.eventHandler} placeholder="Description..."/>
              </label>

              <textarea onChange={this.eventHandler} placeholder="post" name="textarea"></textarea>
              <input type="submit" value="Submit" />
              <div className='sweet-loading'>

          </div>
          </form>
        </div>
      )

    }

}


}
export default NewPost;
