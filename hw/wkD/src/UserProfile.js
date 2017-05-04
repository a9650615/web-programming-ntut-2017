import React, { Component } from 'react'
import * as firebase from 'firebase'
import 'firebase/auth'

export default class UserProfile extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        let userData = {
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          uid: user.uid,
          providerData: user.providerData
        }
        
        console.log(userData)
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}