import React, { Component } from 'react';
import firebase from 'firebase';
import { css } from '@emotion/core';
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
                 wait: ""
                 }
  }

  componentDidMount(){
    console.log(this.props.user.id);
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
            let file = e.target.files[i];
            let fileName = e.target.files[i].name;
            let reader = new FileReader();

            reader.onload = function(evt) {

                  let image = new Image();
                  image.src = evt.target.result;

                   image.onload = function() {

                      let width = this.width;
                      let height = this.height;
                      arr.push({
                        file: file,
                        fileName: fileName,
                        dimensions: {width: width, height: height},
                      })

                  };
            };
            reader.readAsDataURL(file);
          }

          this.setState({ images: arr })

      break;

      case 'textarea':
          this.setState({ postText: value })
      break;

      case 'submit':
        e.preventDefault();
          let images = this.state.images;
          const userId = this.props.user.id;
          const storageRef = firebase.storage().ref(userId + "/" + images[0].fileName);
          this.setState({loading:true})

                var postData = {
                  userId: userId,
                  description: this.state.description,
                  postText: this.state.postText,
                };

                var newPostKey = firebase.database().ref().child('posts').push().key;
                var updates = {};
                updates['/posts/'+ newPostKey] = postData;

                async function addAll(){
                  let toPrint = ''
                  toPrint = await addString(toPrint, 'A')
                  toPrint = await addString(toPrint, 'B')
                  toPrint = await addString(toPrint, 'C')
                  console.log(toPrint) // Prints out " A B C"
                }

                addAll()

                firebase.database().ref().update(updates).then(() => {

                            for (var i = 0; i < images.length; i++) {
                                var imageFile = images[i].file;
                                var fileName = images[i].fileName;
                                uploadImageAsPromise(imageFile, fileName);
                            }

                            function uploadImageAsPromise (imageFile, fileName) {

                                return new Promise(function (resolve, reject) {
                                    var storageRef = firebase.storage().ref(userId + "/" + newPostKey + "/" + images[i].fileName);
                                    var task = storageRef.put(imageFile);

                                    task.on('state_changed',
                                        function progress(snapshot){},
                                        function error(err){},
                                        function complete(){

                                              task.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                                                var imgData = {
                                                  fileName: fileName,
                                                  url: downloadURL,
                                                };

                                                var newImageKey = firebase.database().ref().child('posts/' + newPostKey + "/images/").push().key;
                                                var updates = {};
                                                updates['/posts/'+ newPostKey + "/images/" +  newImageKey] = imgData;
                                                firebase.database().ref().update(updates);

                                              });
                                        }
                                    );
                                });
                            }
                });
                this.setState({loading:false})
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
          css={override}
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
        <form onSubmit={this.eventHandler} className=" effect1" name="submit">

            <label for="file" className="formRow">
              <input  type="file" name="file" onChange={this.eventHandler} id="file" multiple/>
            </label>

            <label className="formRow">
              <input type="text" className="formRow" name="description" onChange={this.eventHandler} placeholder="Description..."/>
            </label>

            <textarea onChange={this.eventHandler} placeholder="post" name="textarea"></textarea>
            <input type="submit" value="Submit" />
            <div className='sweet-loading'>

        </div>
        </form>
      )

    }

}


}
export default NewPost;
