import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import './MsgList.css'

export default class MsgList extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      msgs: [],
      users: {}
    }
  }
  
  componentWillMount() {
    let db = firebase.database()
    db.ref('data').limitToLast(20).once('value').then((snapshot) => {
      // this.setState({
      //   msgs: snapshot.val()
      // });
      this.getAccountInfo(snapshot.val())
      // const scrollHeight = this.refs.chatBox.scrollHeight;
      // this.refs.chatBox.scrollTop = scrollHeight;
    })

    db.ref('data').on('child_added', (data) => {
      let tmpData = {}
      tmpData[data.getKey()] = data.val()
      this.setState({
        msgs: Object.assign({}, this.state.msgs, tmpData)
      })
      this.getAccountInfo(data.val())
    })
  }

  getAccountInfo(data) {
    let msgs = data
    let users = this.state.users

    for (let key in msgs) {
      if (users[msgs[key].user]) {
        msgs[key].user = users[msgs[key]];
      } else {
        firebase.database().ref('users/'+msgs[key].user).once('value').then((data) => {
          users[msgs[key].user] = data.val()
          // msgs[key].user = data.val()
          this.setState({users: users})
        })
      }
    }
  }

  render() {
    let user = firebase.auth().currentUser
    let users = this.state.users
    let msgs = this.state.msgs
    let msgsArr = Object.keys(msgs)
    let tmpTime
    return (
      <Paper className="main-box">
        <div className="main-chat-box" ref="chatBox">
          {
            msgsArr.map((key, i) => {
              tmpTime = new Date(msgs[key].time)
              return (
                <div key={key}>
                  { 
                    (i === 0 || msgs[key].time - (msgs[msgsArr[i-1]].time) > 1200000) && //20分鐘
                    <div className="show-time">{tmpTime.toLocaleDateString()+' '+(tmpTime.getHours()/12>=1?'下午':'上午')+' '+tmpTime.getHours()%12+':'+tmpTime.getMinutes()}</div>
                  }
                  <div 
                    className={`${(user && user.uid === this.state.msgs[key].user)? 'right-chat': 'left-chat'} main-chat-element`}
                    >
                    <div className={`${(user && user.uid === this.state.msgs[key].user)? 'right-avatar': 'left-avatar'} avatar`}>
                      <span className="user-name">{(users[msgs[key].user])?users[msgs[key].user].name: ''}</span>
                      {
                        (users[msgs[key].user] && !users[msgs[key].user].photo) &&
                        <Avatar size={30}>
                          <span>{(users[msgs[key].user])?users[msgs[key].user].name.substring(0, 1).toUpperCase():'?'}</span>
                        </Avatar>
                      }
                      {
                        (users[msgs[key].user] && users[msgs[key].user].photo) &&
                        <Avatar size={30} src={users[msgs[key].user].photo} />
                      }
                    </div>
                    <div className="chat-text">{msgs[key].msg}</div>
                  </div> 
                </div>
                )
            })
          }
        </div>
      </Paper>
    )
  }
}