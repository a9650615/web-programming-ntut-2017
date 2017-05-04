import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

export default class InputText extends Component {
	constructor(props) {
		super(props)

		this.state = {
			msg: '',
			resData: '',
			sendType: 0
		}
	}
	
	componentWillMount() {
		firebase.database().ref('/data').limitToLast(10).once('value').then((snapshot) => {
			var data = snapshot.val();
			console.log(data)
		});	
	}

	onSubmit(e) {
		if (e.keyCode === 13) {
			let db = firebase.database()
			const newPostKey = db.ref().child('data').push().key;
			let data = {}
			// console.log(firebase.auth().currentUser)
			data[`/data/${newPostKey}`] = {
				msg: this.state.msg,
				user: firebase.auth().currentUser?firebase.auth().currentUser.uid:null,
				time: new Date().getTime()
			}

			// db.ref('data').limitToLast(1).on('value', function(snap) {
			// 	console.log(snap.val());
			// })

			db.ref().update(data).then((data) => {
				this.setState({
					sendType: 1,
					resData: '發送成功',
					msg: ''
				})
			})
			.catch((e) => {
				this.setState({
					sendType: 2,
					resData: e
				})
			})
			// return firebase.database().ref().update(data);
		}
	}

	onChange(e) {
		this.setState({
			msg: e.target.value
		})
	}

	render() {
		return (
			<div style={{marginTop: 10}}>
				<TextField
					ref="textInput"
					hintText="請輸入訊息"
					value={this.state.msg}
					onKeyDown={this.onSubmit.bind(this)}
					onChange={this.onChange.bind(this)}
					/>
				<RaisedButton
				 label="送出"
				 primary
				 style={{marginLeft: 10}}
				 />
				 <Snackbar 
				 	open={this.state.sendType !== 0}
          message={this.state.resData}
          autoHideDuration={2000}
					/>
		 </div>);
	}
}