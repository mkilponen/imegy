
  createUser(e){
    e.preventDefault()
    let signIn = this
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(function(snapshot){

          let uid = snapshot.user.uid
          firebase.database().ref('users/' + uid).set({
            username: signIn.state.username,
            email: signIn.state.email,
          })

    }).catch(function(error) {
        console.log(error);
    });
    signIn.props.pageChange('gallery', true)
    e.preventDefault()
  }
