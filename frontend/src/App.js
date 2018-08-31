import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarChart from './components/bar_chart';
import MapComponent from './components/map';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h1> Hello </h1>
        {/* <BarChart data={[5,10,1,3]} size={[500,500]}/> */}
        <MapComponent />
      </div>
    );
  }
}

export default App;
