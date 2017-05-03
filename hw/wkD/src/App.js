import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from './logo.svg';
import './App.css';
import InputText from './InputText';
import MsgList from './MsgList'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <MsgList />
          </div>
          <div>
            <InputText />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
