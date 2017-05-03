import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import TextField from 'material-ui/TextField'

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
			
			data[`/data/${newPostKey}`] = {
				msg: this.state.msg,
				user: 123,
				time: '123'
			}

			// db.ref('data').limitToLast(1).on('value', function(snap) {
			// 	console.log(snap.val());
			// })

			db.ref().update(data).then((data) => {
				this.setState({
					sendType: 1,
					resData: '發送成功'
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
		return (<TextField
			ref="textInput"
		 	hintText="請輸入訊息"
			value={this.state.msg}
			onKeyDown={this.onSubmit.bind(this)}
			onChange={this.onChange.bind(this)}
		 />);
	}
}