import React, { Component } from 'react'
import * as firebase from 'firebase'
import 'firebase/auth'
import FlatButton from 'material-ui/FlatButton'
import './UserButton.css'

export default class UserButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    let t = this;
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
        
        t.setState({
          user: userData
        })
      } else {
        t.setState({
          user: null
        })
      }
    });  
  }

  _logout() {
    firebase.auth().signOut()
  }

  render() {
    return (
      <div>
        {
          this.state.user && 
            <div>
              <FlatButton className="button" label="更改個人資訊" />
              <FlatButton className="button" label="登出" onTouchTap={this._logout.bind(this)} />
            </div>
        }
        {
          !this.state.user && 
            <div>
              <FlatButton className="button" label="登入" onTouchTap={this.props.login} />
            </div>
        }
      </div>
    )
  }
}