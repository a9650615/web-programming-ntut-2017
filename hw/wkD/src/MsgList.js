import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import Paper from 'material-ui/Paper'
import './MsgList.css'

export default class MsgList extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      msgs: []
    }
  }
  
  componentWillMount() {
    let db = firebase.database()
    db.ref('data').limitToLast(10).once('value').then((snapshot) => {
      this.setState({
        msgs: snapshot.val()
      });
    })

    db.ref('data').on('child_added', (data) => {
      let tmpData = {}
      tmpData[data.getKey()] = data.val()
      this.setState({
        msgs: Object.assign({}, this.state.msgs, tmpData)
      })
    })
  }

  render() {
    let user = firebase.auth().currentUser
    let msgs = this.state.msgs
    let msgsArr = Object.keys(msgs)
    let tmpTime
    return (
      <Paper className="main-box">
        <div className="main-chat-box">
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
                      {msgs[key].msg}
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