import React, { Component } from 'react'
import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import Dialog from 'material-ui/Dialog'
import Avatar from 'material-ui/Avatar'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
import './UserProfile.css'

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      uid: null,
      name: null,
      age: null,
      occupation: null,
      summary: null,
      photo: null,
      loaded: false
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
          // photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          uid: user.uid,
          providerData: user.providerData
        }
        
        t.setState(userData)

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
          let data = Object.assign(snapshot.val(), {
            loaded: true
          })
          t.setState(data)
        });
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  _checkProfileUpdate() {
    let t = this
    let file = this.refs.fileSelecter.files[0]
    
    this.setState({
      loaded: false
    })

    if (file) {
      firebase.storage().ref('user/'+this.state.uid).put(file).then((data) => {
        firebase.storage().ref('user/'+this.state.uid).getDownloadURL().then((url) => {
          this.setState({photo: url})
          this._updateProfile.call(t)
        })
      })
    } else {
      this._updateProfile.call(this)
    }
  }

  _updateProfile() {
    let prop = this.state
    let data = {
      name: prop.name,
      occupation: prop.occupation,
      photo: prop.photo,
      age: prop.age,
      summary: prop.summary
    }
    let t = this
    firebase.database().ref('users/'+this.state.uid).update(data).then(() => {
      t.setState({
        loaded: true
      })
    })
  }

  _changeData(e, name) {
    let data = {}
    data[name] = e.target.value
    this.setState(data)
  }

  _selectFile() {
    this.refs.fileSelecter.click()
  }

  _renderChildElement() {
    return (
      <div>
         <div>個人資訊</div>
        <div>
          <TextField
            defaultValue={this.state.name}
            hintText="輸入您的暱稱"
            floatingLabelText="名稱"
            ref="name"
            onChange={e => this._changeData(e, 'name')}
          /><br />
          <TextField
            defaultValue={this.state.occupation}
            hintText="輸入您的職業"
            floatingLabelText="職業"
            ref="occupation"
            onChange={e => this._changeData(e, 'occupation')}
          /><br />
          <div className="upload-photo">
            {
              !this.state.photo &&
              <Avatar size={30}>
                <span>{this.state.email.substring(0, 1).toUpperCase()}</span>
              </Avatar>
            }
            {
              this.state.photo &&
              <Avatar size={30} src={this.state.photo} />
            }
            <input type="file" style={{display: 'none'}} ref="fileSelecter" accept="image/*" />
            <FlatButton label="上傳照片" onTouchTap={this._selectFile.bind(this)} />
          </div>
          <TextField
            defaultValue={this.state.age}
            hintText="輸入您的年齡"
            floatingLabelText="年齡"
            ref="age"
            type="number"
            min="0"
            max="120"
            onChange={e => this._changeData(e, 'age')}
          /><br />
          <TextField
            defaultValue={this.state.summary}
            hintText="輸入您的相關說明"
            floatingLabelText="簡介"
            ref="summary"
            multiLine={true}
            rows={2}
            rowsMax={4}
            onChange={e => this._changeData(e, 'summary')}
          /><br />
        </div>
        <div>
          <FlatButton label="取消" onTouchTap={this.props.close} />
          <FlatButton primary label="更新狀態" onTouchTap={this._checkProfileUpdate.bind(this)} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <Dialog
        modal={true}
        open={this.props.show}
        contentStyle={{
          width: '80vw',
          maxWidth: 500
        }}
        >
       {
         this.state.loaded &&
         this._renderChildElement()
       }
       {
         !this.state.loaded &&
         <CircularProgress size={80} thickness={5} style={{margin: 'auto', display: 'block'}} />
       }
      </Dialog>
    )
  }
}