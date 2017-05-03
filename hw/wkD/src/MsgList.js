import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import Paper from 'material-ui/Paper'

export default class MsgList extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      
    }
  }
  
  componentWillMount() {
    let db = firebase.database()
    db.ref('data').limitToLast(10).once('value').then((e) => {
      console.log(e.val())
    })
  }

  render() {
    return (
      <Paper>

      </Paper>
    )
  }
}