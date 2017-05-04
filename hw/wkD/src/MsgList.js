import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
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
    return (
      <Paper className="main-box">
        <div className="main-chat-box">
          {
            Object.keys(this.state.msgs).map((key) => {
              return <div className="main-chat-element" key={key}>{this.state.msgs[key].msg}</div>
            })
          }
        </div>
      </Paper>
    )
  }
}