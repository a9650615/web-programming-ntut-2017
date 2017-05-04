import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'

export default class UserBlock extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      account: '',
      password: '',
      status: -1
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged( user => {
      if(user) {
        this.props.close()
      } else {
        this.setState({
          status: 0
        })
      }
    })
  }

  authLogin() {
    firebase.auth().signInWithEmailAndPassword(this.state.account, this.state.password).then(() => {
      this.setState({
        status: 2 //登入成功
      })
      this.props.close()
    }).catch((data) => {
      this.setState({
        status: 3 //登入失敗
      })
    })
  }

  authRegister() {
    let t = this;
    firebase.auth().createUserWithEmailAndPassword(this.state.account, this.state.password)
      .then((data) => {
        this.setState({
          status: 1 //註冊成功
        })
        t.props.close();
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        let type = 4;
        switch(errorCode) {
          case 'auth/email-already-in-use':
            console.log('註冊過囉')
            type = 5;
            break;
          case 'auth/weak-password':
            type = 7; //密碼過少
            break;
          default:
            console.log(errorCode + '|' +errorMessage) 
            break;
        }
        
        t.setState({
          status: type
        })
      })
  }

  onSubmit() {
    let t = this;
    firebase.auth().fetchProvidersForEmail(this.state.account).then((data) => {
      // console.log(data.length)
      if (data.length) {
        //有帳號
        this.authLogin.call(this)
      } else {
        //沒有帳號
        this.authRegister.call(this)
      }
    }).catch((error) => {
      let errorCode = error.code;
      // let errorMessage = error.message;
      let type = 4;
      switch(errorCode) {
        case 'auth/invalid-email':
          type = 6; //非法格式
          break;
        default:
        
      }
      t.setState({
        status: type
      })
    })
  }

  getCodeData(status) {
    let data = [
      {text: '', success: 0},
      {text: '註冊成功', success: 1},
      {text: '登入成功', success: 1},
      {text: '登入失敗', success: 2},
      {text: '未知錯誤', success: 2},
      {text: '帳號已註冊過', success: 2},
      {text: '帳號格式錯誤', success: 2},
      {text: '密碼過少字', success: 2},
    ]
    if (status >= 0)
      return data[status]
  }
  
  _renderChild() {
    return ( 
     <div>
       未註冊者按下登入即表示同意註冊及登入
        <div style={{width: 260, margin: 'auto'}}>
          <div>
            <TextField 
              hintText="帳號"
              floatingLabelText="請輸入您的帳號"
              type="text"
              value={this.state.account}
              onChange={(e) => {this.setState({account: e.target.value})}}
              />
          </div>
          <div>
            <TextField 
              hintText="密碼" 
              floatingLabelText="請輸入您的密碼"
              type="password"
              value={this.state.password}
              onChange={(e) => {this.setState({password: e.target.value})}}
              />
          </div>
          <div>
            <FlatButton 
              label="登入"
              fullWidth
              onTouchTap={this.onSubmit.bind(this)}/>
          </div>
          {this.getCodeData(this.state.status).text}
        </div>
     </div>
    )
  }

  _loading() {
    return ( 
      <CircularProgress size={80} thickness={5} style={{display:'block', margin: 'auto'}}/> 
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
          (this.state.status === -1)? this._loading(): this._renderChild()
        }
      </Dialog>
    )
  }
}