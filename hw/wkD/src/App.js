import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import logo from './logo.svg';
import './App.css';
import InputText from './InputText';
import MsgList from './MsgList'
import LoginRegister from './LoginRegister'
import UserProfile from './UserProfile'
import UserBottom from './UserBotton'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: 1
    }
  }

  showLogin() {
    this.setState({open: 1})
  }

  closeDialog() {
    this.setState({open: 0})
  }

  showProfile() {
    this.setState({open: 2})
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <LoginRegister 
            show={this.state.open === 1} 
            close={this.closeDialog.bind(this)}
            />
          <UserProfile 
            show={this.state.open === 2} 
            close={this.closeDialog.bind(this)}
            />
          <div className="App-header">
            <UserBottom 
              login={this.showLogin.bind(this)}
              profile={this.showProfile.bind(this)}
              />
          </div>
          <MsgList />
          <div>
            <InputText />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
